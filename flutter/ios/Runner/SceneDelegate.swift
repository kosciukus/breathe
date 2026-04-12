import Flutter
import UIKit

class SceneDelegate: FlutterSceneDelegate {

    override func scene(
        _ scene: UIScene,
        openURLContexts URLContexts: Set<UIOpenURLContext>
    ) {
        // Do NOT call super — FlutterSceneDelegate forwards the URL to
        // Flutter's built-in navigation which logs "Failed to handle route
        // information in Flutter". The app uses a MethodChannel instead.
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
        for context in URLContexts {
            appDelegate.application(
                UIApplication.shared,
                open: context.url,
                options: [:]
            )
        }
    }
}
