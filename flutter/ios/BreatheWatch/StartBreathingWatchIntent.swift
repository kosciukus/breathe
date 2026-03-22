import AppIntents
import Foundation

@available(watchOS 9.0, *)
struct WatchBreathingPresetEntity: AppEntity {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Breathing Preset")
    static var defaultQuery = WatchBreathingPresetQuery()

    var id: String
    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(label)")
    }

    let label: String
}

@available(watchOS 9.0, *)
struct WatchBreathingPresetQuery: EntityQuery {
    func entities(for identifiers: [String]) async throws -> [WatchBreathingPresetEntity] {
        allWatchPresets.filter { identifiers.contains($0.id) }
    }

    func suggestedEntities() async throws -> [WatchBreathingPresetEntity] {
        allWatchPresets
    }
}

@available(watchOS 9.0, *)
private let allWatchPresets: [WatchBreathingPresetEntity] = [
    WatchBreathingPresetEntity(id: "box_4_4_4_4", label: String(localized: "Box 4-4-4-4")),
    WatchBreathingPresetEntity(id: "relax_4_7_8", label: String(localized: "Relax 4-7-8")),
    WatchBreathingPresetEntity(id: "coherent_5_5", label: String(localized: "Coherent 5.5-5.5")),
    WatchBreathingPresetEntity(id: "resonant_6_6", label: String(localized: "Resonant 6-6")),
    WatchBreathingPresetEntity(id: "equal_4_4", label: String(localized: "Equal 4-4")),
    WatchBreathingPresetEntity(id: "pursed_2_4", label: String(localized: "Pursed-lip 2-4")),
    WatchBreathingPresetEntity(id: "extended_4_6", label: String(localized: "Extended exhale 4-6")),
    WatchBreathingPresetEntity(id: "extended_4_8", label: String(localized: "Extended exhale 4-8")),
    WatchBreathingPresetEntity(id: "triangle_3_3_3", label: String(localized: "Triangle 3-3-3")),
    WatchBreathingPresetEntity(id: "calm_4_4_6_2", label: String(localized: "Calm 4-4-6-2")),
]

extension Notification.Name {
    static let startBreathingFromSiri = Notification.Name("startBreathingFromSiri")
}

@available(watchOS 9.0, *)
struct StartBreathingWatchIntent: AppIntent {
    static var title: LocalizedStringResource = "Start Breathing Session"
    static var description = IntentDescription(
        "Start a breathing session on your watch."
    )
    static var openAppWhenRun = true

    static var parameterSummary: some ParameterSummary {
        Summary("Start \(\.$preset)")
    }

    @Parameter(title: "Preset")
    var preset: WatchBreathingPresetEntity?

    func perform() async throws -> some IntentResult {
        let presetId = preset?.id ?? "box_4_4_4_4"
        NotificationCenter.default.post(
            name: .startBreathingFromSiri,
            object: nil,
            userInfo: ["presetId": presetId]
        )
        return .result()
    }
}
