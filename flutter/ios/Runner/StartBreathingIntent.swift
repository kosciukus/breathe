import AppIntents
import UIKit

@available(iOS 16.0, *)
struct BreathingPresetEntity: AppEntity {
    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Breathing Preset")
    static var defaultQuery = BreathingPresetQuery()

    var id: String
    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(label)")
    }

    let label: String
}

@available(iOS 16.0, *)
struct BreathingPresetQuery: EntityQuery {
    func entities(for identifiers: [String]) async throws -> [BreathingPresetEntity] {
        allPresets.filter { identifiers.contains($0.id) }
    }

    func suggestedEntities() async throws -> [BreathingPresetEntity] {
        allPresets
    }
}

@available(iOS 16.0, *)
private let allPresets: [BreathingPresetEntity] = [
    BreathingPresetEntity(id: "box_4_4_4_4", label: String(localized: "Box 4-4-4-4")),
    BreathingPresetEntity(id: "relax_4_7_8", label: String(localized: "Relax 4-7-8")),
    BreathingPresetEntity(id: "coherent_5_5", label: String(localized: "Coherent 5.5-5.5")),
    BreathingPresetEntity(id: "resonant_6_6", label: String(localized: "Resonant 6-6")),
    BreathingPresetEntity(id: "equal_4_4", label: String(localized: "Equal 4-4")),
    BreathingPresetEntity(id: "pursed_2_4", label: String(localized: "Pursed-lip 2-4")),
    BreathingPresetEntity(id: "extended_4_6", label: String(localized: "Extended exhale 4-6")),
    BreathingPresetEntity(id: "extended_4_8", label: String(localized: "Extended exhale 4-8")),
    BreathingPresetEntity(id: "triangle_3_3_3", label: String(localized: "Triangle 3-3-3")),
    BreathingPresetEntity(id: "calm_4_4_6_2", label: String(localized: "Calm 4-4-6-2")),
]

@available(iOS 16.0, *)
struct StartBreathingIntent: AppIntent {
    static var title: LocalizedStringResource = "Start Breathing Session"
    static var description = IntentDescription(
        "Start a guided breathing session with a specific preset."
    )
    static var openAppWhenRun = true

    static var parameterSummary: some ParameterSummary {
        Summary("Start \(\.$preset)")
    }

    @Parameter(title: "Preset")
    var preset: BreathingPresetEntity?

    func perform() async throws -> some IntentResult {
        let presetId = preset?.id ?? "box_4_4_4_4"
        let urlString = "breathe://start?preset=\(presetId)&autostart=true"
        if let url = URL(string: urlString) {
            await UIApplication.shared.open(url)
        }
        return .result()
    }
}
