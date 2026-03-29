package it.arcsoftware.breathe_wearos

import android.content.Intent
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private val CHANNEL = "it.arcsoftware.breathe/deeplink"
    private val SESSION_CHANNEL = "it.arcsoftware.breathe/session"
    private var deepLinkChannel: MethodChannel? = null
    private var pendingDeepLink: String? = null

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        deepLinkChannel = MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
        deepLinkChannel?.setMethodCallHandler { call, result ->
            if (call.method == "getInitialLink") {
                result.success(pendingDeepLink)
                pendingDeepLink = null
            } else {
                result.notImplemented()
            }
        }

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, SESSION_CHANNEL)
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "startSession" -> {
                        val label = call.argument<String>("label") ?: "Breathing"
                        startService(
                            Intent(this, BreathingService::class.java).apply {
                                action = BreathingService.ACTION_START
                                putExtra(BreathingService.EXTRA_PRESET_LABEL, label)
                            }
                        )
                        result.success(null)
                    }
                    "stopSession" -> {
                        startService(
                            Intent(this, BreathingService::class.java).apply {
                                action = BreathingService.ACTION_STOP
                            }
                        )
                        result.success(null)
                    }
                    else -> result.notImplemented()
                }
            }

        // Handle cold-start intent.
        intent?.data?.toString()?.let { uri ->
            if (uri.startsWith("breathe://")) {
                pendingDeepLink = uri
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        intent.data?.toString()?.let { uri ->
            if (uri.startsWith("breathe://")) {
                deepLinkChannel?.invokeMethod("onDeepLink", uri)
                    ?: run { pendingDeepLink = uri }
            }
        }
    }
}
