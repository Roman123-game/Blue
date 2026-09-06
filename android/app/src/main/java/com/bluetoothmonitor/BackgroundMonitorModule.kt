package com.bluetoothmonitor

import android.content.Intent
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BackgroundMonitorModule(
    private val context: ReactApplicationContext,
) : ReactContextBaseJavaModule(context) {
  override fun getName(): String = NAME

  @ReactMethod
  fun start(deviceName: String?) {
    val intent = Intent(context, BackgroundMonitorService::class.java)
      .putExtra(BackgroundMonitorService.EXTRA_DEVICE_NAME, deviceName ?: "Bluetooth device")
    ContextCompat.startForegroundService(context, intent)
  }

  @ReactMethod
  fun updateDistance(distanceMeters: Double) {
    BackgroundMonitorService.updateDistance(context, distanceMeters)
  }

  @ReactMethod
  fun stop() {
    context.stopService(Intent(context, BackgroundMonitorService::class.java))
  }

  companion object {
    const val NAME = "BackgroundMonitor"
  }
}