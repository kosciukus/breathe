import AppIntents

struct BreatheWatchShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: StartBreathingWatchIntent(presetId: "box_4_4_4_4"),
            phrases: [
                "Box breathing with \(.applicationName)",
                "Start box breathing with \(.applicationName)",
                "Square breathing with \(.applicationName)",
            ],
            shortTitle: "Box Breathing",
            systemImageName: "wind"
        )

        AppShortcut(
            intent: StartBreathingWatchIntent(presetId: "relax_4_7_8"),
            phrases: [
                "Relax breathing with \(.applicationName)",
                "Start relax breathing with \(.applicationName)",
                "4 7 8 breathing with \(.applicationName)",
            ],
            shortTitle: "Relax Breathing",
            systemImageName: "wind"
        )

        AppShortcut(
            intent: StartBreathingWatchIntent(presetId: "coherent_5_5"),
            phrases: [
                "Coherent breathing with \(.applicationName)",
                "Start coherent breathing with \(.applicationName)",
            ],
            shortTitle: "Coherent Breathing",
            systemImageName: "wind"
        )

        AppShortcut(
            intent: StartBreathingWatchIntent(presetId: "calm_4_4_6_2"),
            phrases: [
                "Calm breathing with \(.applicationName)",
                "Start calm breathing with \(.applicationName)",
            ],
            shortTitle: "Calm Breathing",
            systemImageName: "wind"
        )

        AppShortcut(
            intent: StartBreathingWatchIntent(presetId: "triangle_3_3_3"),
            phrases: [
                "Triangle breathing with \(.applicationName)",
                "Start triangle breathing with \(.applicationName)",
            ],
            shortTitle: "Triangle Breathing",
            systemImageName: "wind"
        )

        AppShortcut(
            intent: StartBreathingWatchIntent(presetId: "resonant_6_6"),
            phrases: [
                "Resonant breathing with \(.applicationName)",
                "Start resonant breathing with \(.applicationName)",
            ],
            shortTitle: "Resonant Breathing",
            systemImageName: "wind"
        )

        AppShortcut(
            intent: StartBreathingWatchIntent(presetId: "equal_4_4"),
            phrases: [
                "Equal breathing with \(.applicationName)",
                "Start equal breathing with \(.applicationName)",
            ],
            shortTitle: "Equal Breathing",
            systemImageName: "wind"
        )

        AppShortcut(
            intent: StartBreathingWatchIntent(presetId: "extended_4_8"),
            phrases: [
                "Extended exhale with \(.applicationName)",
                "Start extended exhale with \(.applicationName)",
            ],
            shortTitle: "Extended Exhale",
            systemImageName: "wind"
        )

        AppShortcut(
            intent: StartBreathingWatchIntent(presetId: "pursed_2_4"),
            phrases: [
                "Pursed lip breathing with \(.applicationName)",
                "Start pursed lip breathing with \(.applicationName)",
            ],
            shortTitle: "Pursed Lip Breathing",
            systemImageName: "wind"
        )

        AppShortcut(
            intent: StartBreathingWatchIntent(),
            phrases: [
                "Start breathing with \(.applicationName)",
                "Breathe with \(.applicationName)",
                "Open \(.applicationName)",
            ],
            shortTitle: "Start Breathing",
            systemImageName: "wind"
        )
    }
}
