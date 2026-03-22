import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
    private var deepLinkChannel: FlutterMethodChannel?
    private var pendingDeepLink: String?

    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
        GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)

        let messenger = engineBridge.pluginRegistry.registrar(
            forPlugin: "DeepLinkPlugin"
        )!.messenger()
        deepLinkChannel = FlutterMethodChannel(
            name: "it.arcsoftware.breathe/deeplink",
            binaryMessenger: messenger
        )

        deepLinkChannel?.setMethodCallHandler { [weak self] call, result in
            if call.method == "getInitialLink" {
                result(self?.pendingDeepLink)
                self?.pendingDeepLink = nil
            } else {
                result(FlutterMethodNotImplemented)
            }
        }

        // Flush any deep link that arrived before the engine was ready.
        if let pending = pendingDeepLink {
            deepLinkChannel?.invokeMethod("onDeepLink", arguments: pending)
            pendingDeepLink = nil
        }
    }

    override func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        let urlString = url.absoluteString
        if let channel = deepLinkChannel {
            channel.invokeMethod("onDeepLink", arguments: urlString)
        } else {
            pendingDeepLink = urlString
        }
        return super.application(app, open: url, options: options)
    }
}
