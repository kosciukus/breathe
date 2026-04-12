import CarPlay
import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
    /// TODO(CarPlay): Flip to `true` once Apple grants the CarPlay Audio
    /// entitlement. You must also restore the entitlement in
    /// Runner.entitlements AND the CPTemplateApplicationSceneSessionRoleApplication
    /// entry in Runner/Info.plist. Gated here so builds keep working on a
    /// developer account without the entitlement.
    private static let carPlayEnabled = false

    private var deepLinkChannel: FlutterMethodChannel?
    private var pendingDeepLink: String?
    /// Preset ID received from Siri before the method channel was ready.
    private var pendingSiriPresetId: String?
    /// Shared binary messenger — available as soon as the Flutter engine starts,
    /// even before the phone UI scene is created. Used by CarPlaySceneDelegate
    /// when CarPlay is enabled.
    private(set) var flutterMessenger: FlutterBinaryMessenger?

    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        NSLog("[Breathe] didFinishLaunchingWithOptions called")

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleSiriBreathingNotification(_:)),
            name: .startBreathingFromSiri,
            object: nil
        )

        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    @objc private func handleSiriBreathingNotification(_ notification: Notification) {
        guard let presetId = notification.userInfo?["presetId"] as? String else { return }
        NSLog("[Breathe] Siri triggered preset: \(presetId)")

        let urlString = "breathe://start?preset=\(presetId)&autostart=true"
        if let channel = deepLinkChannel {
            channel.invokeMethod("onDeepLink", arguments: urlString)
        } else {
            pendingSiriPresetId = presetId
        }
    }

    override func application(
        _ application: UIApplication,
        configurationForConnecting connectingSceneSession: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
        NSLog("[Breathe] configurationForConnecting role: \(connectingSceneSession.role.rawValue)")
        // TODO(CarPlay): Gate removed once Apple grants the carplay-audio
        // entitlement. See `carPlayEnabled` above for the full restore steps.
        if Self.carPlayEnabled,
           connectingSceneSession.role.rawValue == "CPTemplateApplicationSceneSessionRoleApplication" {
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
                // Prefer Siri-triggered preset over a raw deep link.
                if let presetId = self?.pendingSiriPresetId {
                    self?.pendingSiriPresetId = nil
                    result("breathe://start?preset=\(presetId)&autostart=true")
                } else {
                    result(self?.pendingDeepLink)
                    self?.pendingDeepLink = nil
                }
            } else {
                result(FlutterMethodNotImplemented)
            }
        }

        // Flush pending Siri preset if Dart handler is already listening.
        if let presetId = pendingSiriPresetId {
            pendingSiriPresetId = nil
            deepLinkChannel?.invokeMethod(
                "onDeepLink",
                arguments: "breathe://start?preset=\(presetId)&autostart=true"
            )
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
