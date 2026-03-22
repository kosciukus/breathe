import SwiftUI

struct PresetListView: View {
    @EnvironmentObject var engine: BreathingEngine
    @State private var navigateToSession = false
    @State private var navigateToCustom  = false

    var body: some View {
        NavigationStack {
            List {
                Button {
                    navigateToCustom = true
                } label: {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Custom \(engine.lastCustomPreset.sequence)")
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(.white)
                        Text("\(engine.lastCustomPreset.minutes) min")
                            .font(.system(size: 10))
                            .foregroundColor(.white.opacity(0.5))
                    }
                    .padding(.vertical, 2)
                }
                .listRowBackground(
                    engine.selectedPreset.id == "custom"
                        ? Color.purple.opacity(0.25)
                        : Color.clear
                )

                ForEach(builtInPresets) { preset in
                    Button {
                        engine.select(preset)
                        navigateToSession = true
                    } label: {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(preset.label)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(.white)
                            Text("\(preset.minutes) min · \(preset.sequence)")
                                .font(.system(size: 10))
                                .foregroundColor(.white.opacity(0.5))
                        }
                        .padding(.vertical, 2)
                    }
                    .listRowBackground(
                        engine.selectedPreset.id == preset.id
                            ? Color.blue.opacity(0.25)
                            : Color.clear
                    )
                }
            }
            .navigationTitle("Mindful Breathe")
            .navigationDestination(isPresented: $navigateToSession) {
                SessionView()
                    .environmentObject(engine)
            }
            .navigationDestination(isPresented: $navigateToCustom) {
                CustomTimerView()
                    .environmentObject(engine)
            }
            .onChange(of: engine.siriTriggeredPresetId) { presetId in
                guard let presetId = presetId,
                      let preset = builtInPresets.first(where: { $0.id == presetId })
                else { return }
                engine.select(preset)
                navigateToSession = true
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    engine.start()
                    engine.siriTriggeredPresetId = nil
                }
            }
        }
    }
}
