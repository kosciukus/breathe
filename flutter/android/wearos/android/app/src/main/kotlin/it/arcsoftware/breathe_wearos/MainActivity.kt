package it.arcsoftware.breathe_wearos

import android.content.Intent
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private val CHANNEL = "it.arcsoftware.breathe/deeplink"
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
