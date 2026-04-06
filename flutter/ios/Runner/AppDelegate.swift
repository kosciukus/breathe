import CarPlay
import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
    private var deepLinkChannel: FlutterMethodChannel?
    private var pendingDeepLink: String?
    /// Shared binary messenger — available as soon as the Flutter engine starts,
    /// even before the phone UI scene is created. Used by CarPlaySceneDelegate.
    private(set) var flutterMessenger: FlutterBinaryMessenger?

    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        NSLog("[Breathe] didFinishLaunchingWithOptions called")
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    override func application(
        _ application: UIApplication,
        configurationForConnecting connectingSceneSession: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
        NSLog("[Breathe] configurationForConnecting role: \(connectingSceneSession.role.rawValue)")
        if connectingSceneSession.role.rawValue == "CPTemplateApplicationSceneSessionRoleApplication" {
            let config = UISceneConfiguration(
                name: "CarPlay",
                sessionRole: connectingSceneSession.role
            )
            config.delegateClass = CarPlaySceneDelegate.self
            return config
        }
        // Return config by name — iOS reads the rest (delegate class, storyboard)
        // from Info.plist, preserving Flutter's implicit engine setup.
        return UISceneConfiguration(
            name: "flutter",
            sessionRole: connectingSceneSession.role
        )
    }

    func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
        NSLog("[Breathe] didInitializeImplicitFlutterEngine called")
        GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)

        let messenger = engineBridge.pluginRegistry.registrar(
            forPlugin: "DeepLinkPlugin"
        )!.messenger()
        flutterMessenger = messenger
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
