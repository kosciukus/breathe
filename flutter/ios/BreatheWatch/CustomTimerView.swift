import SwiftUI

struct CustomTimerView: View {
    @EnvironmentObject var engine: BreathingEngine
    @State private var inhale:  Double = 4
    @State private var holdIn:  Double = 0
    @State private var exhale:  Double = 4
    @State private var holdOut: Double = 0
    @State private var minutes: Int    = 5
    @State private var navigateToSession = false

    var body: some View {
        ScrollView {
            VStack(spacing: 4) {
                PhaseRow(label: "Inhale",  value: $inhale,  range: 1...20, step: 0.5)
                PhaseRow(label: "Hold",    value: $holdIn,  range: 0...20, step: 0.5)
                PhaseRow(label: "Exhale",  value: $exhale,  range: 1...20, step: 0.5)
                PhaseRow(label: "Hold",    value: $holdOut, range: 0...20, step: 0.5)
                IntPhaseRow(label: "Minutes", value: $minutes, range: 1...30)

                Button("Start") {
                    let preset = WatchPreset(
                        id: "custom",
                        label: "Custom \(inhale)-\(holdIn)-\(exhale)-\(holdOut)",
                        inhale: inhale,
                        holdIn: holdIn,
                        exhale: exhale,
                        holdOut: holdOut,
                        minutes: minutes
                    )
                    engine.select(preset)
                    navigateToSession = true
                }
                .modifier(ProminentBlueButton())
                .padding(.top, 4)
            }
            .padding(.vertical, 8)
        }
        .navigationTitle("Custom")
        .onAppear {
            inhale  = engine.lastCustomPreset.inhale
            holdIn  = engine.lastCustomPreset.holdIn
            exhale  = engine.lastCustomPreset.exhale
            holdOut = engine.lastCustomPreset.holdOut
            minutes = engine.lastCustomPreset.minutes
        }
        .navigationDestination(isPresented: $navigateToSession) {
            SessionView()
                .environmentObject(engine)
        }
    }
}

private struct ProminentBlueButton: ViewModifier {
    func body(content: Content) -> some View {
        if #available(iOS 15.0, watchOS 8.0, *) {
            content
                .buttonStyle(.borderedProminent)
                .tint(.blue)
        } else {
            content
                .foregroundColor(.white)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.blue)
                .cornerRadius(8)
        }
    }
}

private struct PhaseRow: View {
    let label: String
    @Binding var value: Double
    let range: ClosedRange<Double>
    var step: Double = 1

    private var displayValue: String {
        value.truncatingRemainder(dividingBy: 1) == 0 ? String(Int(value)) : String(value)
    }

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 12))
                .foregroundColor(.white.opacity(0.7))
                .frame(maxWidth: .infinity, alignment: .leading)
            Stepper(value: $value, in: range, step: step) {
                Text(displayValue)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(.white)
                    .frame(minWidth: 20, alignment: .trailing)
            }
        }
        .padding(.horizontal, 4)
    }
}

private struct IntPhaseRow: View {
    let label: String
    @Binding var value: Int
    let range: ClosedRange<Int>

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 12))
                .foregroundColor(.white.opacity(0.7))
                .frame(maxWidth: .infinity, alignment: .leading)
            Stepper(value: $value, in: range) {
                Text("\(value)")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(.white)
                    .frame(minWidth: 20, alignment: .trailing)
            }
        }
        .padding(.horizontal, 4)
    }
}
