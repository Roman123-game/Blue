package com.bluetoothmonitor

import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothProfile
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.PowerManager
import android.os.VibrationEffect
import android.os.Vibrator
import android.util.Log
import androidx.core.app.NotificationCompat
import java.io.IOException
import java.util.ArrayDeque

class BackgroundMonitorService : Service() {
  private var deviceName = "Bluetooth device"
  private var deviceAddress: String? = null
  private var isDanger = false
  private var alarmPlayer: MediaPlayer? = null
  private var monitorWakeLock: PowerManager.WakeLock? = null
  private var screenWakeLock: PowerManager.WakeLock? = null
  private var bluetoothGatt: BluetoothGatt? = null
  private var gattConnected = false
  private var rssiReadPending = false
  private val rssiSamples = ArrayDeque<Int>()
  private val handler = Handler(Looper.getMainLooper())
  private val reconnectRunnable = Runnable { connectToDevice() }
  private val rssiPollRunnable = Runnable { readRemoteRssi() }
  private val rssiReadTimeoutRunnable = Runnable {
    if (rssiReadPending) {
      Log.e(TAG, "BLE RSSI read timed out")
      rssiReadPending = false
      handler.postDelayed(rssiPollRunnable, RSSI_POLL_INTERVAL_MS)
    }
  }

  private val bluetoothGattCallback = object : BluetoothGattCallback() {
    override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
      if (bluetoothGatt !== gatt) {
        gatt.close()
        return
      }
      if (status == BluetoothGatt.GATT_SUCCESS && newState == BluetoothProfile.STATE_CONNECTED) {
        gattConnected = true
        Log.i(TAG, "Connected to monitored device; starting native RSSI polling")
        handler.removeCallbacks(reconnectRunnable)
        readRemoteRssi()
        return
      }

      Log.e(TAG, "BLE connection state changed (status=$status, state=$newState)")
      if (bluetoothGatt === gatt) {
        bluetoothGatt = null
      }
      handler.removeCallbacks(rssiReadTimeoutRunnable)
      handler.removeCallbacks(rssiPollRunnable)
      rssiReadPending = false
      gatt.close()
      if (gattConnected) {
        gattConnected = false
        updateDistance(DISTANCE_LIMIT_METERS + 1.0)
      }
      handler.removeCallbacks(reconnectRunnable)
      handler.postDelayed(reconnectRunnable, RECONNECT_DELAY_MS)
    }

    override fun onReadRemoteRssi(gatt: BluetoothGatt, rssi: Int, status: Int) {
      handler.removeCallbacks(rssiReadTimeoutRunnable)
      rssiReadPending = false
      if (status == BluetoothGatt.GATT_SUCCESS && bluetoothGatt === gatt) {
        rssiSamples.addLast(rssi)
        if (rssiSamples.size > RSSI_SMOOTHING_WINDOW) {
          rssiSamples.removeFirst()
        }
        val averageRssi = kotlin.math.round(rssiSamples.average()).toInt()
        updateDistance(distanceForRssi(averageRssi))
      } else {
        Log.e(TAG, "Unable to read monitored device RSSI (status=$status)")
      }
      handler.removeCallbacks(rssiPollRunnable)
      handler.postDelayed(rssiPollRunnable, RSSI_POLL_INTERVAL_MS)
    }
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val preferences = getSharedPreferences(PREFERENCES_NAME, MODE_PRIVATE)
    deviceName = intent?.getStringExtra(EXTRA_DEVICE_NAME)
      ?: preferences.getString(EXTRA_DEVICE_NAME, deviceName)
      ?: deviceName
    val requestedAddress = intent?.getStringExtra(EXTRA_DEVICE_ADDRESS)
      ?: preferences.getString(EXTRA_DEVICE_ADDRESS, null)
    if (requestedAddress != null && requestedAddress != deviceAddress) {
      closeBluetoothConnection()
      deviceAddress = requestedAddress
      preferences.edit()
        .putString(EXTRA_DEVICE_NAME, deviceName)
        .putString(EXTRA_DEVICE_ADDRESS, requestedAddress)
        .apply()
      rssiSamples.clear()
      connectToDevice()
    }
    updateNotification("Monitoring $deviceName")
    return START_STICKY
  }

  override fun onBind(intent: Intent?): IBinder? = null

  private fun updateNotification(message: String) {
    getSystemService(NotificationManager::class.java)
      .notify(NOTIFICATION_ID, notification(message))
  }

  private fun notification(message: String): Notification =
    NotificationCompat.Builder(this, SERVICE_CHANNEL_ID)
      .setSmallIcon(android.R.drawable.ic_dialog_info)
      .setContentTitle("Bluetooth distance monitor")
      .setContentText(message)
      .setOngoing(true)
      .setCategory(NotificationCompat.CATEGORY_SERVICE)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .build()

  private fun alertNotification(message: String): Notification =
    NotificationCompat.Builder(this, ALERT_CHANNEL_ID)
      .setSmallIcon(android.R.drawable.ic_dialog_alert)
      .setContentTitle("Bluetooth distance monitor")
      .setContentText(message)
      .setCategory(NotificationCompat.CATEGORY_ALARM)
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setDefaults(Notification.DEFAULT_SOUND)
      .setOnlyAlertOnce(true)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .setFullScreenIntent(createAlertPendingIntent(), true)
      .build()

  private fun createAlertPendingIntent(): PendingIntent {
    val intent = Intent(this, MainActivity::class.java).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or
        Intent.FLAG_ACTIVITY_CLEAR_TOP or
        Intent.FLAG_ACTIVITY_SINGLE_TOP
    }
    return PendingIntent.getActivity(
      this,
      ALERT_NOTIFICATION_ID,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val manager = getSystemService(NotificationManager::class.java)
      val serviceChannel = NotificationChannel(
        SERVICE_CHANNEL_ID,
        "Distance monitoring",
        NotificationManager.IMPORTANCE_LOW,
      )
      serviceChannel.setSound(null, null)
      serviceChannel.enableVibration(false)

      val alertChannel = NotificationChannel(
        ALERT_CHANNEL_ID,
        "Distance alerts",
        NotificationManager.IMPORTANCE_HIGH,
      )
      alertChannel.enableVibration(false)

      manager.createNotificationChannel(serviceChannel)
      manager.createNotificationChannel(alertChannel)
    }
  }

  private fun showAlertNotification(message: String) {
    getSystemService(NotificationManager::class.java)
      .notify(ALERT_NOTIFICATION_ID, alertNotification(message))
  }

  private fun clearAlertNotification() {
    getSystemService(NotificationManager::class.java).cancel(ALERT_NOTIFICATION_ID)
  }

  private fun connectToDevice() {
    val address = deviceAddress ?: return
    if (bluetoothGatt != null) return
    try {
      val adapter = getSystemService(android.bluetooth.BluetoothManager::class.java).adapter
      if (adapter == null || !adapter.isEnabled) {
        Log.e(TAG, "Bluetooth is unavailable; retrying connection")
        scheduleReconnect()
        return
      }
      val device = adapter.getRemoteDevice(address)
      bluetoothGatt = device.connectGatt(
        this,
        false,
        bluetoothGattCallback,
        BluetoothDevice.TRANSPORT_LE,
      )
      if (bluetoothGatt == null) {
        Log.e(TAG, "Unable to create BLE connection; retrying")
        scheduleReconnect()
      }
    } catch (error: SecurityException) {
      Log.e(TAG, "Bluetooth permission denied; unable to monitor device", error)
      scheduleReconnect()
    } catch (error: IllegalArgumentException) {
      Log.e(TAG, "Invalid Bluetooth device address: $address", error)
    }
  }

  private fun readRemoteRssi() {
    val gatt = bluetoothGatt ?: return
    if (rssiReadPending) return

    try {
      rssiReadPending = gatt.readRemoteRssi()
      if (!rssiReadPending) {
        Log.e(TAG, "BLE RSSI read could not be started")
        handler.postDelayed(rssiPollRunnable, RSSI_POLL_INTERVAL_MS)
      } else {
        handler.postDelayed(rssiReadTimeoutRunnable, RSSI_READ_TIMEOUT_MS)
      }
    } catch (error: SecurityException) {
      Log.e(TAG, "Bluetooth permission denied while reading RSSI", error)
      handler.postDelayed(rssiPollRunnable, RSSI_POLL_INTERVAL_MS)
    }
  }

  private fun scheduleReconnect() {
    handler.removeCallbacks(reconnectRunnable)
    handler.postDelayed(reconnectRunnable, RECONNECT_DELAY_MS)
  }

  private fun closeBluetoothConnection() {
    handler.removeCallbacks(reconnectRunnable)
    handler.removeCallbacks(rssiPollRunnable)
    handler.removeCallbacks(rssiReadTimeoutRunnable)
    rssiReadPending = false
    gattConnected = false
    bluetoothGatt?.let { gatt ->
      try {
        gatt.disconnect()
        gatt.close()
      } catch (error: SecurityException) {
        Log.e(TAG, "Bluetooth permission denied while closing BLE connection", error)
      }
    }
    bluetoothGatt = null
  }

  private fun updateDistance(distanceMeters: Double) {
    val danger = distanceMeters > DISTANCE_LIMIT_METERS
    if (danger == isDanger) return

    isDanger = danger
    if (danger) {
      Log.i(TAG, "Alert started at ${"%.2f".format(distanceMeters)} m")
      startAlarm()
      showAlertNotification("WARNING: device is ${"%.2f".format(distanceMeters)} m away")
    } else {
      stopAlarm()
      clearAlertNotification()
      updateNotification("Monitoring $deviceName")
    }
  }

  private fun distanceForRssi(rssi: Int): Double {
    val distance = Math.pow(10.0, (TX_POWER - rssi) / (10.0 * PATH_LOSS_EXPONENT))
    return (distance.coerceIn(0.0, 100.0) * 100).toInt() / 100.0
  }

  private fun startAlarm() {
    Log.i(TAG, "Distance limit exceeded; starting alarm")
    acquireScreenWakeLock()

    getSystemService(Vibrator::class.java)?.let { vibrator ->
      val pattern = longArrayOf(0, 800, 500)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        vibrator.vibrate(VibrationEffect.createWaveform(pattern, 0))
      } else {
        @Suppress("DEPRECATION")
        vibrator.vibrate(pattern, 0)
      }
    }

    if (alarmPlayer != null) {
      return
    }

    val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
      ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
    if (alarmUri == null) {
      Log.e(TAG, "No default alarm or notification sound is configured")
      return
    }

    val player = MediaPlayer()
    alarmPlayer = player
    player.setAudioAttributes(
      AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_ALARM)
        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
        .build(),
    )
    player.isLooping = true
    player.setOnPreparedListener {
      if (isDanger && alarmPlayer === it) {
        it.start()
      } else if (alarmPlayer === it) {
        alarmPlayer = null
        it.release()
      }
    }
    player.setOnErrorListener { mediaPlayer, what, extra ->
      Log.e(TAG, "Unable to play the distance alarm (what=$what, extra=$extra)")
      if (alarmPlayer === mediaPlayer) {
        alarmPlayer = null
      }
      mediaPlayer.release()
      true
    }

    try {
      player.setDataSource(this, alarmUri)
      player.prepareAsync()
    } catch (error: IOException) {
      alarmPlayer = null
      player.release()
      Log.e(TAG, "Unable to load the distance alarm", error)
    } catch (error: IllegalArgumentException) {
      alarmPlayer = null
      player.release()
      Log.e(TAG, "Unable to load the distance alarm", error)
    } catch (error: SecurityException) {
      alarmPlayer = null
      player.release()
      Log.e(TAG, "Unable to load the distance alarm", error)
    }
  }

  private fun stopAlarm() {
    Log.i(TAG, "Distance is safe; stopping alarm")
    getSystemService(Vibrator::class.java)?.cancel()
    screenWakeLock?.let { wakeLock ->
      if (wakeLock.isHeld) {
        wakeLock.release()
      }
    }
    screenWakeLock = null
    alarmPlayer?.also { player ->
      player.setOnPreparedListener(null)
      player.setOnErrorListener(null)
      player.release()
    }
    alarmPlayer = null
  }

  private fun acquireMonitorWakeLock() {
    val powerManager = getSystemService(PowerManager::class.java)
    val wakeLock = monitorWakeLock
      ?: powerManager.newWakeLock(
        PowerManager.PARTIAL_WAKE_LOCK,
        "$TAG:monitor",
      ).also { monitorWakeLock = it }

    if (!wakeLock.isHeld) {
      wakeLock.acquire()
      Log.i(TAG, "Acquired CPU wake lock for background monitoring")
    }
  }

  private fun releaseMonitorWakeLock() {
    monitorWakeLock?.let { wakeLock ->
      if (wakeLock.isHeld) {
        wakeLock.release()
        Log.i(TAG, "Released CPU wake lock")
      }
    }
    monitorWakeLock = null
  }

  @Suppress("DEPRECATION")
  private fun acquireScreenWakeLock() {
    val powerManager = getSystemService(PowerManager::class.java)
    val wakeLock = screenWakeLock
      ?: powerManager.newWakeLock(
        PowerManager.SCREEN_BRIGHT_WAKE_LOCK or
          PowerManager.ACQUIRE_CAUSES_WAKEUP or
          PowerManager.ON_AFTER_RELEASE,
        "$TAG:alert",
      ).also { screenWakeLock = it }

    if (!wakeLock.isHeld) {
      wakeLock.acquire()
    }
  }

  companion object {
    private const val TAG = "BackgroundMonitorService"
    const val EXTRA_DEVICE_NAME = "deviceName"
    const val EXTRA_DEVICE_ADDRESS = "deviceAddress"
    private const val SERVICE_CHANNEL_ID = "distance-monitor-service"
    private const val ALERT_CHANNEL_ID = "distance-monitor-alerts"
    private const val PREFERENCES_NAME = "background_monitor"
    private const val NOTIFICATION_ID = 1001
    private const val ALERT_NOTIFICATION_ID = 1002
    private const val DISTANCE_LIMIT_METERS = 3.0
    private const val RSSI_SMOOTHING_WINDOW = 8
    private const val RSSI_POLL_INTERVAL_MS = 1_000L
    private const val RSSI_READ_TIMEOUT_MS = 5_000L
    private const val RECONNECT_DELAY_MS = 5_000L
    private const val TX_POWER = -59.0
    private const val PATH_LOSS_EXPONENT = 2.5
  }

  override fun onCreate() {
    super.onCreate()
    createNotificationChannel()
    startForeground(NOTIFICATION_ID, notification("Monitoring distance"))
    acquireMonitorWakeLock()
  }

  override fun onDestroy() {
    closeBluetoothConnection()
    stopAlarm()
    releaseMonitorWakeLock()
    clearAlertNotification()
    getSharedPreferences(PREFERENCES_NAME, MODE_PRIVATE).edit().clear().apply()
    super.onDestroy()
  }
}