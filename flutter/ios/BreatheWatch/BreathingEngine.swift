import AVFoundation
import Combine
import Foundation

enum BreathPhase: String, CaseIterable {
    case inhale, holdIn, exhale, holdOut

    var label: String {
        switch self {
        case .inhale:  return "Inhale"
        case .holdIn:  return "Hold"
        case .exhale:  return "Exhale"
        case .holdOut: return "Hold"
        }
    }

    var next: BreathPhase {
        switch self {
        case .inhale:  return .holdIn
        case .holdIn:  return .exhale
        case .exhale:  return .holdOut
        case .holdOut: return .inhale
        }
    }
}

private let preStartSeconds = 3
private let lastPresetKey      = "breathe.watch.lastPresetId"
private let customInhaleKey    = "breathe.watch.custom.inhale"
private let customHoldInKey    = "breathe.watch.custom.holdIn"
private let customExhaleKey    = "breathe.watch.custom.exhale"
private let customHoldOutKey   = "breathe.watch.custom.holdOut"
private let customMinutesKey   = "breathe.watch.custom.minutes"

class BreathingEngine: ObservableObject {
    // Published state for the UI
    @Published var phase: BreathPhase = .inhale
    @Published var phaseProgress: Double = 0        // 0.0 – 1.0
    @Published var phaseRemainingSeconds: Double = 0
    @Published var sessionRemainingSeconds: Int = 0
    @Published var isRunning: Bool = false
    @Published var countdownSeconds: Int? = nil     // non-nil during pre-start
    @Published var selectedPreset: WatchPreset = builtInPresets[0]
    @Published var lastCustomPreset: WatchPreset = WatchPreset(
        id: "custom", label: "Custom 4-0-4-0",
        inhale: 4, holdIn: 0, exhale: 4, holdOut: 0, minutes: 5
    )
    /// Set by Siri intent to trigger preset selection + navigation + auto-start.
    @Published var siriTriggeredPresetId: String? = nil

    private let healthService = HealthService()
    private var sessionStartedAt: Date?

    private var timer: Timer?
    private var phaseEndTime: Date = .distantPast
    private var sessionEndTime: Date?
    private var stopAfterCycle: Bool = false
    private var phaseDuration: Double = 0           // seconds (double for progress)

    private var inhalePlayer: AVAudioPlayer?
    private var holdPlayer: AVAudioPlayer?
    private var exhalePlayer: AVAudioPlayer?

    // MARK: - Public API

    init() {
        restoreLastPreset()
        healthService.initialize()
    }

    func select(_ preset: WatchPreset) {
        selectedPreset = preset
        UserDefaults.standard.set(preset.id, forKey: lastPresetKey)
        if preset.id == "custom" {
            lastCustomPreset = preset
            let d = UserDefaults.standard
            d.set(preset.inhale,  forKey: customInhaleKey)
            d.set(preset.holdIn,  forKey: customHoldInKey)
            d.set(preset.exhale,  forKey: customExhaleKey)
            d.set(preset.holdOut, forKey: customHoldOutKey)
            d.set(preset.minutes, forKey: customMinutesKey)
        }
    }

    func start() {
        guard !isRunning else { return }
        isRunning = true
        stopAfterCycle = false
        countdownSeconds = preStartSeconds

        var remaining = preStartSeconds
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] t in
            remaining -= 1
            if remaining > 0 {
                self?.countdownSeconds = remaining
            } else {
                t.invalidate()
                self?.countdownSeconds = nil
                self?.beginSession()
            }
        }
    }

    func stop() {
        timer?.invalidate()
        timer = nil
        if let start = sessionStartedAt {
            healthService.logMindfulnessSession(startTime: start, endTime: Date())
        }
        isRunning = false
        countdownSeconds = nil
        stopAfterCycle = false
        sessionEndTime = nil
        sessionStartedAt = nil
        phase = .inhale
        phaseProgress = 0
        phaseRemainingSeconds = 0
        sessionRemainingSeconds = 0
    }

    // MARK: - Private

    private func makePlayer(resource: String) -> AVAudioPlayer? {
        guard let url = Bundle.main.url(forResource: resource, withExtension: "mp3") else { return nil }
        let player = try? AVAudioPlayer(contentsOf: url)
        player?.prepareToPlay()
        return player
    }

    private func prepareAudio() {
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
        try? AVAudioSession.sharedInstance().setActive(true)
        inhalePlayer = makePlayer(resource: "phase-inhale")
        holdPlayer   = makePlayer(resource: "phase-hold")
        exhalePlayer = makePlayer(resource: "phase-exhale")
    }

    private func beginSession() {
        let preset = selectedPreset
        let sessionDuration = Double(preset.minutes) * 60
        sessionStartedAt = Date()
        sessionEndTime = Date().addingTimeInterval(sessionDuration)
        sessionRemainingSeconds = preset.minutes * 60

        prepareAudio()
        beginPhase(.inhale)

        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            self?.tick()
        }
        RunLoop.current.add(timer!, forMode: .common)
    }

    private func beginPhase(_ newPhase: BreathPhase) {
        phase = newPhase
        phaseDuration = selectedPreset.duration(for: newPhase)
        phaseEndTime = Date().addingTimeInterval(phaseDuration)
        phaseRemainingSeconds = phaseDuration
        phaseProgress = 0
        playCue(for: newPhase)
    }

    private func tick() {
        let now = Date()

        // Update session countdown
        if let endTime = sessionEndTime {
            let remaining = endTime.timeIntervalSince(now)
            if remaining <= 0 {
                sessionEndTime = nil
                sessionRemainingSeconds = 0
                stopAfterCycle = true
            } else {
                sessionRemainingSeconds = Int(remaining.rounded(.up))
            }
        }

        // Update phase progress
        let phaseRemaining = phaseEndTime.timeIntervalSince(now)
        if phaseRemaining > 0 {
            phaseRemainingSeconds = phaseRemaining
            phaseProgress = phaseDuration > 0
                ? min((phaseDuration - phaseRemaining) / phaseDuration, 1.0)
                : 1.0
        } else {
            // Phase ended — advance
            advancePhase(spillMs: Int(-phaseRemaining * 1000))
        }
    }

    private func advancePhase(spillMs: Int) {
        let preset = selectedPreset
        var next = phase.next

        // Skip phases with zero duration
        var safetyLimit = 4
        while preset.duration(for: next) == 0 && safetyLimit > 0 {
            next = next.next
            safetyLimit -= 1
        }

        // If we've completed a full cycle and session is done, stop
        if next == .inhale && stopAfterCycle {
            stop()
            return
        }

        // If all phases have zero duration somehow, stop
        if preset.totalCycleSeconds == 0 {
            stop()
            return
        }

        phase = next
        phaseDuration = preset.duration(for: next)
        let spillSeconds = Double(spillMs) / 1000.0
        let remaining = max(phaseDuration - spillSeconds, 0)
        phaseEndTime = Date().addingTimeInterval(remaining)
        phaseRemainingSeconds = remaining
        phaseProgress = phaseDuration > 0
            ? min(spillSeconds / phaseDuration, 1.0)
            : 0.0
        playCue(for: next)
    }

    private func playCue(for phase: BreathPhase) {
        let player: AVAudioPlayer? = switch phase {
        case .inhale:            inhalePlayer
        case .holdIn:            holdPlayer
        case .exhale:            exhalePlayer
        case .holdOut:           holdPlayer
        }
        player?.currentTime = 0
        player?.play()
    }

    private func restoreLastPreset() {
        let d = UserDefaults.standard

        // Restore saved custom values (always, regardless of last preset)
        if d.object(forKey: customInhaleKey) != nil {
            let i  = d.double(forKey: customInhaleKey)
            let hi = d.double(forKey: customHoldInKey)
            let e  = d.double(forKey: customExhaleKey)
            let ho = d.double(forKey: customHoldOutKey)
            let tmp = WatchPreset(id: "custom", label: "", inhale: i, holdIn: hi, exhale: e, holdOut: ho, minutes: 1)
            lastCustomPreset = WatchPreset(
                id: "custom", label: "Custom \(tmp.sequence)",
                inhale:  i,
                holdIn:  hi,
                exhale:  e,
                holdOut: ho,
                minutes: max(1, d.integer(forKey: customMinutesKey))
            )
        }

        guard let savedId = d.string(forKey: lastPresetKey) else { return }
        if savedId == "custom" {
            selectedPreset = lastCustomPreset
        } else if let preset = builtInPresets.first(where: { $0.id == savedId }) {
            selectedPreset = preset
        }
    }
}
