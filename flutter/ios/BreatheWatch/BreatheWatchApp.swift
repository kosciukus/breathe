import SwiftUI

@main
struct BreatheWatchApp: App {
    @StateObject private var engine = BreathingEngine()

    var body: some Scene {
        WindowGroup {
            PresetListView()
                .environmentObject(engine)
                .onReceive(NotificationCenter.default.publisher(for: .startBreathingFromSiri)) { notification in
                    guard let presetId = notification.userInfo?["presetId"] as? String else { return }
                    engine.siriTriggeredPresetId = presetId
                }
        }
    }
}
