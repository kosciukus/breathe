import Foundation

struct WatchPreset: Identifiable {
    let id: String
    let label: String
    let inhale: Double
    let holdIn: Double
    let exhale: Double
    let holdOut: Double
    let minutes: Int

    var sequence: String {
        func fmt(_ d: Double) -> String {
            d.truncatingRemainder(dividingBy: 1) == 0 ? String(Int(d)) : String(d)
        }
        return "\(fmt(inhale))-\(fmt(holdIn))-\(fmt(exhale))-\(fmt(holdOut))"
    }

    func duration(for phase: BreathPhase) -> Double {
        switch phase {
        case .inhale:  return inhale
        case .holdIn:  return holdIn
        case .exhale:  return exhale
        case .holdOut: return holdOut
        }
    }

    var totalCycleSeconds: Double { inhale + holdIn + exhale + holdOut }
}

let builtInPresets: [WatchPreset] = [
    WatchPreset(id: "box_4_4_4_4",     label: "Box 4-4-4-4",            inhale: 4, holdIn: 4, exhale: 4, holdOut: 4, minutes: 8),
    WatchPreset(id: "relax_4_7_8",     label: "Relax 4-7-8",            inhale: 4, holdIn: 7, exhale: 8, holdOut: 0, minutes: 6),
    WatchPreset(id: "coherent_5_5",    label: "Coherent 5.5-5.5",       inhale: 5.5, holdIn: 0, exhale: 5.5, holdOut: 0, minutes: 5),
    WatchPreset(id: "resonant_6_6",    label: "Resonant 6-6",           inhale: 6, holdIn: 0, exhale: 6, holdOut: 0, minutes: 5),
    WatchPreset(id: "equal_4_4",       label: "Equal 4-4",              inhale: 4, holdIn: 0, exhale: 4, holdOut: 0, minutes: 5),
    WatchPreset(id: "pursed_2_4",      label: "Pursed-lip 2-4",         inhale: 2, holdIn: 0, exhale: 4, holdOut: 0, minutes: 5),
    WatchPreset(id: "extended_4_6",    label: "Extended exhale 4-6",    inhale: 4, holdIn: 0, exhale: 6, holdOut: 0, minutes: 5),
    WatchPreset(id: "extended_4_8",    label: "Extended exhale 4-8",    inhale: 4, holdIn: 0, exhale: 8, holdOut: 0, minutes: 5),
    WatchPreset(id: "triangle_3_3_3",  label: "Triangle 3-3-3",         inhale: 3, holdIn: 3, exhale: 3, holdOut: 0, minutes: 4),
    WatchPreset(id: "calm_4_4_6_2",    label: "Calm 4-4-6-2",           inhale: 4, holdIn: 4, exhale: 6, holdOut: 2, minutes: 5),
]
