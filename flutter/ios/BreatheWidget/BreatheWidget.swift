import WidgetKit
import SwiftUI

struct PresetEntry: TimelineEntry {
    let date: Date
    let presets: [WidgetPreset]
}

struct WidgetPreset: Identifiable {
    let id: String
    let label: String
    let durations: String
    let deepLink: URL

    static let defaults: [WidgetPreset] = [
        WidgetPreset(
            id: "box_4_4_4_4",
            label: "Box 4-4-4-4",
            durations: "4-4-4-4",
            deepLink: URL(string: "breathe://start?preset=box_4_4_4_4&autostart=true")!
        ),
        WidgetPreset(
            id: "relax_4_7_8",
            label: "Relax 4-7-8",
            durations: "4-7-8-0",
            deepLink: URL(string: "breathe://start?preset=relax_4_7_8&autostart=true")!
        ),
        WidgetPreset(
            id: "coherent_5_5",
            label: "Coherent 5.5-5.5",
            durations: "5.5-0-5.5-0",
            deepLink: URL(string: "breathe://start?preset=coherent_5_5&autostart=true")!
        ),
        WidgetPreset(
            id: "equal_4_4",
            label: "Equal 4-4",
            durations: "4-0-4-0",
            deepLink: URL(string: "breathe://start?preset=equal_4_4&autostart=true")!
        ),
        WidgetPreset(
            id: "resonant_6_6",
            label: "Resonant 6-6",
            durations: "6-0-6-0",
            deepLink: URL(string: "breathe://start?preset=resonant_6_6&autostart=true")!
        ),
        WidgetPreset(
            id: "pursed_2_4",
            label: "Pursed-lip 2-4",
            durations: "2-0-4-0",
            deepLink: URL(string: "breathe://start?preset=pursed_2_4&autostart=true")!
        ),
        WidgetPreset(
            id: "extended_4_6",
            label: "Extended 4-6",
            durations: "4-0-6-0",
            deepLink: URL(string: "breathe://start?preset=extended_4_6&autostart=true")!
        ),
        WidgetPreset(
            id: "extended_4_8",
            label: "Extended 4-8",
            durations: "4-0-8-0",
            deepLink: URL(string: "breathe://start?preset=extended_4_8&autostart=true")!
        ),
        WidgetPreset(
            id: "triangle_3_3_3",
            label: "Triangle 3-3-3",
            durations: "3-3-3-0",
            deepLink: URL(string: "breathe://start?preset=triangle_3_3_3&autostart=true")!
        ),
        WidgetPreset(
            id: "calm_4_4_6_2",
            label: "Calm 4-4-6-2",
            durations: "4-4-6-2",
            deepLink: URL(string: "breathe://start?preset=calm_4_4_6_2&autostart=true")!
        ),
    ]
}

struct BreatheProvider: TimelineProvider {
    private static let appGroupId = "group.it.arcsoftware.breathe"

    func placeholder(in context: Context) -> PresetEntry {
        PresetEntry(date: Date(), presets: WidgetPreset.defaults)
    }

    func getSnapshot(in context: Context, completion: @escaping (PresetEntry) -> Void) {
        // Widget gallery preview — always show polished defaults
        if context.isPreview {
            completion(PresetEntry(date: Date(), presets: WidgetPreset.defaults))
            return
        }
        completion(PresetEntry(date: Date(), presets: loadPresets()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PresetEntry>) -> Void) {
        let entry = PresetEntry(date: Date(), presets: loadPresets())
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }

    private func loadPresets() -> [WidgetPreset] {
        guard let userDefaults = UserDefaults(suiteName: Self.appGroupId),
              let jsonString = userDefaults.string(forKey: "presets"),
              let data = jsonString.data(using: .utf8),
              let array = try? JSONSerialization.jsonObject(with: data) as? [[String: String]]
        else {
            return WidgetPreset.defaults
        }

        return array.compactMap { dict in
            guard let id = dict["id"],
                  let label = dict["label"],
                  let durations = dict["durations"],
                  let deepLinkStr = dict["deepLink"],
                  let deepLink = URL(string: deepLinkStr)
            else { return nil }
            return WidgetPreset(id: id, label: label, durations: durations, deepLink: deepLink)
        }
    }
}

// MARK: - Shared styling

private let gradientTop = Color(red: 0.14, green: 0.30, blue: 0.38)
private let gradientBottom = Color(red: 0.07, green: 0.16, blue: 0.22)

private struct PresetButton: View {
    let preset: WidgetPreset
    let fontSize: Font

    init(_ preset: WidgetPreset, fontSize: Font = .caption2) {
        self.preset = preset
        self.fontSize = fontSize
    }

    var body: some View {
        Link(destination: preset.deepLink) {
            Text(preset.label)
                .font(fontSize)
                .fontWeight(.medium)
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
                .lineLimit(2)
                .padding(.vertical, 10)
                .padding(.horizontal, 4)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color.white.opacity(0.15))
                .clipShape(RoundedRectangle(cornerRadius: 10))
        }
    }
}

private struct WidgetHeader: View {
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: "wind")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.white)

            Text("Mindful Breathe")
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(.white)
        }
    }
}

private struct GradientBackground: View {
    var body: some View {
        LinearGradient(
            colors: [gradientTop, gradientBottom],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

// MARK: - Small widget (2 presets: Box + Coherent)

private struct SmallWidgetView: View {
    let presets: [WidgetPreset]

    private var displayPresets: [WidgetPreset] {
        let boxPreset = presets.first { $0.id == "box_4_4_4_4" }
        let coherentPreset = presets.first { $0.id == "coherent_5_5" }
        return [boxPreset, coherentPreset].compactMap { $0 }.prefix(2).map { $0 }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            WidgetHeader()

            VStack(spacing: 6) {
                ForEach(displayPresets) { preset in
                    PresetButton(preset)
                }
            }
        }
        .padding(12)
        .containerBackground(for: .widget) { GradientBackground() }
    }
}

// MARK: - Medium widget (4 presets in a row)

private struct MediumWidgetView: View {
    let presets: [WidgetPreset]

    private var displayPresets: [WidgetPreset] {
        Array(presets.prefix(4))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            WidgetHeader()

            HStack(spacing: 6) {
                ForEach(displayPresets) { preset in
                    PresetButton(preset)
                }
            }
        }
        .padding(14)
        .containerBackground(for: .widget) { GradientBackground() }
    }
}

// MARK: - Large widget (grid of presets)

private struct LargeWidgetView: View {
    let presets: [WidgetPreset]

    private let columns = [
        GridItem(.flexible(), spacing: 6),
        GridItem(.flexible(), spacing: 6),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            WidgetHeader()

            LazyVGrid(columns: columns, spacing: 6) {
                ForEach(presets) { preset in
                    PresetButton(preset, fontSize: .caption)
                }
            }
        }
        .padding(14)
        .containerBackground(for: .widget) { GradientBackground() }
    }
}

// MARK: - Entry view router

struct BreatheWidgetEntryView: View {
    var entry: BreatheProvider.Entry

    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(presets: entry.presets)
        case .systemLarge:
            LargeWidgetView(presets: entry.presets)
        default:
            MediumWidgetView(presets: entry.presets)
        }
    }
}

@main
struct BreatheWidget: Widget {
    let kind = "BreatheWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: BreatheProvider()) { entry in
            BreatheWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Mindful Breathe")
        .description("Quick-start a breathing session from your home screen.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
