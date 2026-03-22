import AppIntents

@available(watchOS 9.0, *)
struct BreatheWatchShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: StartBreathingWatchIntent(),
            phrases: [
                // Core patterns with preset parameter
                "Start \(\.$preset) with \(.applicationName)",
                "Start \(\.$preset) in \(.applicationName)",
                "\(.applicationName) start \(\.$preset)",
                "Do \(\.$preset) with \(.applicationName)",

                // Without preset (defaults to box)
                "Start breathing with \(.applicationName)",
                "Start a breathing session with \(.applicationName)",
                "Breathe with \(.applicationName)",
                "Open \(.applicationName)",

                // Popular presets as explicit phrases
                "Box breathing with \(.applicationName)",
                "Relax breathing with \(.applicationName)",
                "Calm breathing with \(.applicationName)",
            ],
            shortTitle: "Start Breathing",
            systemImageName: "wind"
        )
    }
}
