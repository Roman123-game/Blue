package com.bluetoothmonitor

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.core.app.NotificationCompat

class BackgroundMonitorService : Service() {
  private var deviceName = "Bluetooth device"
  private var isDanger = false

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
    NotificationCompat.Builder(this, CHANNEL_ID)
      .setSmallIcon(android.R.drawable.ic_dialog_info)
      .setContentTitle("Bluetooth distance monitor")
      .setContentText(message)
      .setOngoing(true)
      .setCategory(NotificationCompat.CATEGORY_SERVICE)
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .build()

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        CHANNEL_ID,
        "Distance monitoring",
        NotificationManager.IMPORTANCE_HIGH,
      )
      channel.enableVibration(true)
      getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
    }
  }

  private fun startAlarm() {
    val vibrator = getSystemService(Vibrator::class.java) ?: return
    val pattern = longArrayOf(0, 800, 500)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      vibrator.vibrate(VibrationEffect.createWaveform(pattern, 0))
    } else {
      @Suppress("DEPRECATION")
      vibrator.vibrate(pattern, 0)
    }
  }

  companion object {
    const val EXTRA_DEVICE_NAME = "deviceName"
    private const val CHANNEL_ID = "distance-monitor"
    private const val NOTIFICATION_ID = 1001

    fun updateDistance(context: Context, distanceMeters: Double) {
      val service = activeService ?: return
      val danger = distanceMeters > DISTANCE_LIMIT_METERS
      if (danger != service.isDanger) {
        service.isDanger = danger
        if (danger) {
          service.startAlarm()
          service.updateNotification("WARNING: device is ${"%.2f".format(distanceMeters)} m away")
        } else {
          context.getSystemService(Vibrator::class.java)?.cancel()
          service.updateNotification("Monitoring ${service.deviceName}")
        }
      }
    }

    private const val DISTANCE_LIMIT_METERS = 2.0
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
    getSystemService(Vibrator::class.java)?.cancel()
    super.onDestroy()
  }
}