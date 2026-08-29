package com.bluetoothmonitor

import android.os.Process
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Native bridge used by [ExitButton] to completely close the app.
 *
 * `BackHandler.exitApp()` only invokes Android's default back-press handler,
 * which on many devices/launchers (and with `launchMode="singleTask"`) simply
 * backgrounds the task, i.e. it looks like the app was minimized. To truly exit
 * the app we call [android.app.Activity.finishAndRemoveTask] which finishes the
 * activity and removes the task from the recent apps screen, and afterwards
 * kill the process so the app is fully shut down.
 */
class AppExitModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  @ReactMethod
  fun exitApp() {
    val activity = reactApplicationContext.currentActivity ?: return
    activity.finishAndRemoveTask()
    Process.killProcess(Process.myPid())
  }

  companion object {
    const val NAME = "AppExit"
  }
}