import SwiftUI

struct SessionView: View {
    @EnvironmentObject var engine: BreathingEngine
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            if let countdown = engine.countdownSeconds {
                countdownView(countdown)
            } else if engine.isRunning {
                activeView
            } else {
                readyView
            }
        }
        .navigationBarBackButtonHidden(engine.isRunning || engine.countdownSeconds != nil)
        .onDisappear {
            engine.stop()
        }
    }

    // MARK: - Sub-views

    private var readyView: some View {
        VStack(spacing: 10) {
            Text(engine.selectedPreset.label)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(.white.opacity(0.8))
                .multilineTextAlignment(.center)
            Text("\(engine.selectedPreset.minutes) min")
                .font(.system(size: 11))
                .foregroundColor(.white.opacity(0.4))
            Button("Start") {
                engine.start()
            }
            .buttonStyle(.borderedProminent)
            .tint(.blue)
        }
    }

    private func countdownView(_ n: Int) -> some View {
        VStack(spacing: 6) {
            Text("Get ready")
                .font(.system(size: 12))
                .foregroundColor(.white.opacity(0.5))
            Text("\(n)")
                .font(.system(size: 48, weight: .thin, design: .rounded))
                .foregroundColor(.white)
        }
    }

    private var activeView: some View {
        VStack(spacing: 6) {
            // Ring + phase info
            ZStack {
                Circle()
                    .stroke(Color.white.opacity(0.12), lineWidth: 5)
                Circle()
                    .trim(from: 0, to: engine.phaseProgress)
                    .stroke(
                        phaseColor,
                        style: StrokeStyle(lineWidth: 5, lineCap: .round)
                    )
                    .rotationEffect(.degrees(-90))
                    .animation(.linear(duration: 0.1), value: engine.phaseProgress)

                VStack(spacing: 1) {
                    Text(engine.phase.label)
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundColor(.white)
                    Text(String(format: "%.0fs", engine.phaseRemainingSeconds))
                        .font(.system(size: 11, design: .monospaced))
                        .foregroundColor(.white.opacity(0.55))
                }
            }
            .frame(width: 100, height: 100)

            // Session remaining
            if engine.sessionRemainingSeconds > 0 {
                Text(formatTime(engine.sessionRemainingSeconds))
                    .font(.system(size: 10))
                    .foregroundColor(.white.opacity(0.35))
            }

            // Stop button
            Button("Stop") {
                engine.stop()
                dismiss()
            }
            .font(.system(size: 11))
            .foregroundColor(.red.opacity(0.7))
            .buttonStyle(.plain)
        }
    }

    // MARK: - Helpers

    private var phaseColor: Color {
        switch engine.phase {
        case .inhale:  return .blue
        case .holdIn:  return Color(red: 0.2, green: 0.8, blue: 0.9)
        case .exhale:  return .teal
        case .holdOut: return .green
        }
    }

    private func formatTime(_ seconds: Int) -> String {
        String(format: "%d:%02d", seconds / 60, seconds % 60)
    }
}
