import AppIntents
import Foundation

extension Notification.Name {
    static let startBreathingFromSiri = Notification.Name("startBreathingFromSiri")
}

struct StartBreathingWatchIntent: AppIntent {
    static var title: LocalizedStringResource = "Start Breathing Session"
    static var description = IntentDescription(
        "Start a breathing session on your watch."
    )
    static var openAppWhenRun = true

    @Parameter(title: "Preset ID")
    var presetId: String

    init() {
        presetId = "box_4_4_4_4"
    }

    init(presetId: String) {
        self.presetId = presetId
    }

    static var parameterSummary: some ParameterSummary {
        Summary("Start breathing session \(\.$presetId)")
    }

    func perform() async throws -> some IntentResult {
        NotificationCenter.default.post(
            name: .startBreathingFromSiri,
            object: nil,
            userInfo: ["presetId": presetId]
        )
        return .result()
    }
}
