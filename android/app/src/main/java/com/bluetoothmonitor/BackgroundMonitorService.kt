package com.bluetoothmonitor

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.Build
import android.os.IBinder
import android.os.VibrationEffect
import android.os.Vibrator
import android.util.Log
import androidx.core.app.NotificationCompat
import java.io.IOException

class BackgroundMonitorService : Service() {
  private var deviceName = "Bluetooth device"
  private var isDanger = false
  private var alarmPlayer: MediaPlayer? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    deviceName = intent?.getStringExtra(EXTRA_DEVICE_NAME) ?: deviceName
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
      .build()

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

  private fun startAlarm() {
    getSystemService(Vibrator::class.java)?.let { vibrator ->
      val pattern = longArrayOf(0, 800, 500)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        vibrator.vibrate(VibrationEffect.createWaveform(pattern, 0))
      } else {
        @Suppress("DEPRECATION")
        vibrator.vibrate(pattern, 0)
      }
    }

    if (alarmPlayer != null) return

    val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
    if (alarmUri == null) {
      Log.e(TAG, "No default alarm sound is configured")
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
    getSystemService(Vibrator::class.java)?.cancel()
    alarmPlayer?.also { player ->
      player.setOnPreparedListener(null)
      player.setOnErrorListener(null)
      player.release()
    }
    alarmPlayer = null
  }

  companion object {
    private const val TAG = "BackgroundMonitorService"
    const val EXTRA_DEVICE_NAME = "deviceName"
    private const val SERVICE_CHANNEL_ID = "distance-monitor-service"
    private const val ALERT_CHANNEL_ID = "distance-monitor-alerts"
    private const val NOTIFICATION_ID = 1001
    private const val ALERT_NOTIFICATION_ID = 1002

    fun updateDistance(context: Context, distanceMeters: Double) {
      val service = activeService ?: return
      val danger = distanceMeters > DISTANCE_LIMIT_METERS
      if (danger != service.isDanger) {
        service.isDanger = danger
        if (danger) {
          service.startAlarm()
          service.showAlertNotification("WARNING: device is ${"%.2f".format(distanceMeters)} m away")
        } else {
          service.stopAlarm()
          service.clearAlertNotification()
          service.updateNotification("Monitoring ${service.deviceName}")
        }
      }
    }

    private const val DISTANCE_LIMIT_METERS = 3.0
    private var activeService: BackgroundMonitorService? = null
  }

  override fun onCreate() {
    super.onCreate()
    activeService = this
    createNotificationChannel()
    startForeground(NOTIFICATION_ID, notification("Monitoring distance"))
  }

  override fun onDestroy() {
    activeService = null
    stopAlarm()
    clearAlertNotification()
    super.onDestroy()
  }
}