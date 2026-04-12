import AVFoundation
import CarPlay
import Flutter
import MediaPlayer
import UIKit

class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate, CPInterfaceControllerDelegate {
    private var interfaceController: CPInterfaceController?
    private var methodChannel: FlutterMethodChannel?
    private var presets: [[String: Any]] = []
    private var activePresetId: String?
    private var isRunning = false
    private var retryTimer: Timer?

    /// A native AVAudioPlayer that loops silence during breathing sessions.
    /// While it is playing, audioplayers' AVAudioSession.setActive(false) throws
    /// an error (cannot deactivate while audio is playing), keeping the session
    /// alive so MPNowPlayingInfoCenter updates reach CarPlay.
    private var silencePlayer: AVAudioPlayer?

    // Authoritative Now Playing state. We own MPNowPlayingInfoCenter while a
    // CarPlay session is active and re-write it on a timer so audio_service's
    // async writes cannot clobber us, and so the timeline advances between
    // (infrequent) Dart updates.
    private var nowPlayingTimer: Timer?
    private var lastElapsedSeconds: Double = 0
    private var lastElapsedTimestamp: Date?
    private var currentDurationSeconds: Double = 0
    private var currentPresetLabel: String = "Breathing"

    // MARK: - CPTemplateApplicationSceneDelegate

    func templateApplicationScene(
        _ templateApplicationScene: CPTemplateApplicationScene,
        didConnect interfaceController: CPInterfaceController
    ) {
        NSLog("[CarPlay] didConnect called")
        self.interfaceController = interfaceController
        interfaceController.delegate = self

        // Activate audio session so MPNowPlayingInfoCenter updates
        // (set by audio_service) are respected by the system / CarPlay.
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
        try? AVAudioSession.sharedInstance().setActive(true)

        // Show fallback immediately so CarPlay has a root template.
        showFallbackTemplate()

        if setupMethodChannel() {
            NSLog("[CarPlay] MethodChannel ready immediately")
            requestPresets()
        } else {
            NSLog("[CarPlay] Flutter not ready, starting retry timer")
            retryTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] timer in
                guard let self = self else { timer.invalidate(); return }
                if self.setupMethodChannel() {
                    NSLog("[CarPlay] MethodChannel ready after retry")
                    timer.invalidate()
                    self.retryTimer = nil
                    self.requestPresets()
                }
            }
        }

        activatePhoneApp()
    }

    func templateApplicationScene(
        _ templateApplicationScene: CPTemplateApplicationScene,
        didDisconnectInterfaceController interfaceController: CPInterfaceController
    ) {
        stopSilencePlayer()
        stopNowPlayingTimer()
        MPNowPlayingInfoCenter.default().playbackState = .stopped
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
        self.interfaceController = nil
        methodChannel = nil
        retryTimer?.invalidate()
        retryTimer = nil
    }

    // MARK: - Flutter communication

    @discardableResult
    private func setupMethodChannel() -> Bool {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
              let messenger = appDelegate.flutterMessenger else { return false }

        methodChannel = FlutterMethodChannel(
            name: "it.arcsoftware.breathe/carplay",
            binaryMessenger: messenger
        )

        methodChannel?.setMethodCallHandler { [weak self] call, result in
            switch call.method {
            case "updatePresets":
                if let args = call.arguments as? [[String: Any]] {
                    self?.presets = args
                    self?.rebuildRootTemplate()
                }
                result(nil)
            case "updatePlaybackState":
                if let args = call.arguments as? [String: Any] {
                    self?.isRunning = args["isRunning"] as? Bool ?? false
                    self?.activePresetId = args["presetId"] as? String
                    self?.updateNowPlaying(args)
                }
                result(nil)
            default:
                result(FlutterMethodNotImplemented)
            }
        }

        return true
    }

    private func requestPresets() {
        methodChannel?.invokeMethod("getPresets", arguments: nil) {
            [weak self] result in
            if let presets = result as? [[String: Any]] {
                self?.presets = presets
                self?.rebuildRootTemplate()
            } else {
                self?.showFallbackTemplate()
            }
        }
    }

    // MARK: - CarPlay templates

    private func rebuildRootTemplate() {
        let listItems = presets.map { preset -> CPListItem in
            let id = preset["id"] as? String ?? ""
            let label = preset["label"] as? String ?? "Preset"
            let sequence = preset["sequence"] as? String ?? ""
            let minutes = preset["repeatMinutes"] as? Int ?? 5
            let detail = "\(sequence) \u{2022} \(minutes) min"

            let item = CPListItem(text: label, detailText: detail)
            item.handler = { [weak self] _, completion in
                self?.startPreset(id: id)
                completion()
            }
            return item
        }

        let section = CPListSection(items: listItems)
        let listTemplate = CPListTemplate(
            title: "Mindful Breathe",
            sections: [section]
        )

        interfaceController?.setRootTemplate(listTemplate, animated: true,
                                             completion: nil)
    }

    private func showFallbackTemplate() {
        let item = CPListItem(
            text: "Open Mindful Breathe on your phone",
            detailText: "Presets will appear here"
        )
        let section = CPListSection(items: [item])
        let template = CPListTemplate(title: "Mindful Breathe", sections: [section])
        interfaceController?.setRootTemplate(template, animated: false,
                                             completion: nil)
    }

    private func showNowPlaying(presetLabel: String) {
        let template = CPNowPlayingTemplate.shared
        template.isUpNextButtonEnabled = false
        template.isAlbumArtistButtonEnabled = false

        // When the user taps "Back" on the Now Playing screen, stop the session.
        interfaceController?.pushTemplate(template, animated: true,
                                          completion: nil)
    }

    private func updateNowPlaying(_ state: [String: Any]) {
        let running = state["isRunning"] as? Bool ?? false

        if !running {
            stopNowPlayingTimer()
            MPNowPlayingInfoCenter.default().playbackState = .stopped
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
            return
        }

        lastElapsedSeconds = state["elapsedSeconds"] as? Double ?? 0
        currentDurationSeconds = state["durationSeconds"] as? Double ?? 0
        currentPresetLabel = state["presetLabel"] as? String ?? "Breathing"
        lastElapsedTimestamp = Date()

        // audioplayers deactivates AVAudioSession after each short breathing cue.
        // Re-activate it so playback-rate updates reach CarPlay.
        try? AVAudioSession.sharedInstance().setActive(true)

        configureRemoteCommands()
        writeNowPlayingInfo()
        MPNowPlayingInfoCenter.default().playbackState = .playing
        startNowPlayingTimer()
    }

    private var remoteCommandsConfigured = false

    private func configureRemoteCommands() {
        // CPNowPlayingTemplate's play/pause button is only interactive when
        // the corresponding MPRemoteCommand is enabled AND has a target.
        // audio_service may not configure these for a "silent" handler, so
        // we do it ourselves. This is also what convinces CarPlay to show
        // the pause button instead of play.
        let center = MPRemoteCommandCenter.shared()
        center.playCommand.isEnabled = true
        center.pauseCommand.isEnabled = true
        center.stopCommand.isEnabled = true
        center.togglePlayPauseCommand.isEnabled = true

        guard !remoteCommandsConfigured else { return }
        remoteCommandsConfigured = true

        center.pauseCommand.addTarget { [weak self] _ in
            self?.methodChannel?.invokeMethod("stopSession", arguments: nil)
            return .success
        }
        center.stopCommand.addTarget { [weak self] _ in
            self?.methodChannel?.invokeMethod("stopSession", arguments: nil)
            return .success
        }
        center.togglePlayPauseCommand.addTarget { [weak self] _ in
            self?.methodChannel?.invokeMethod("stopSession", arguments: nil)
            return .success
        }
        center.playCommand.addTarget { _ in
            // No-op: a CarPlay session is always started from the list.
            return .success
        }
    }

    private func writeNowPlayingInfo() {
        let extrapolated: Double
        if let ts = lastElapsedTimestamp {
            extrapolated = min(
                lastElapsedSeconds + Date().timeIntervalSince(ts),
                currentDurationSeconds
            )
        } else {
            extrapolated = lastElapsedSeconds
        }

        MPNowPlayingInfoCenter.default().nowPlayingInfo = [
            MPMediaItemPropertyTitle: currentPresetLabel,
            MPMediaItemPropertyArtist: "",
            MPMediaItemPropertyAlbumTitle: "",
            MPMediaItemPropertyPlaybackDuration: currentDurationSeconds,
            MPNowPlayingInfoPropertyElapsedPlaybackTime: extrapolated,
            MPNowPlayingInfoPropertyPlaybackRate: 1.0,
            MPNowPlayingInfoPropertyDefaultPlaybackRate: 1.0,
        ]
    }

    private func startNowPlayingTimer() {
        guard nowPlayingTimer == nil else { return }
        // Fire on the main run loop so it continues ticking while CarPlay UI
        // is foregrounded. 0.5s is frequent enough to win any race with
        // audio_service's async writes and to keep the timeline smooth.
        let timer = Timer(timeInterval: 0.5, repeats: true) { [weak self] _ in
            self?.writeNowPlayingInfo()
        }
        RunLoop.main.add(timer, forMode: .common)
        nowPlayingTimer = timer
    }

    private func stopNowPlayingTimer() {
        nowPlayingTimer?.invalidate()
        nowPlayingTimer = nil
        lastElapsedTimestamp = nil
    }

    // MARK: - CPInterfaceControllerDelegate

    func templateWillDisappear(_ aTemplate: CPTemplate, animated: Bool) {
        if aTemplate is CPNowPlayingTemplate {
            // User tapped "Back" from the Now Playing screen — stop session.
            stopSilencePlayer()
            stopNowPlayingTimer()
            MPNowPlayingInfoCenter.default().playbackState = .stopped
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
            methodChannel?.invokeMethod("stopSession", arguments: nil)
        }
    }

    // MARK: - Phone app activation

    private func activatePhoneApp() {
        let session = UIApplication.shared.openSessions.first { session in
            session.configuration.role == .windowApplication
        }
        UIApplication.shared.requestSceneSessionActivation(
            session,
            userActivity: nil,
            options: nil,
            errorHandler: nil
        )
    }

    // MARK: - Silence player (keeps AVAudioSession alive)

    private func startSilencePlayer() {
        guard silencePlayer == nil else { return }

        // Generate a minimal 1-second silent WAV in memory.
        let sampleRate: UInt32 = 8000
        let numSamples: UInt32 = 8000
        let dataSize: UInt32 = numSamples
        let fileSize: UInt32 = 36 + dataSize

        var wav = Data()
        wav.append(contentsOf: [0x52, 0x49, 0x46, 0x46]) // "RIFF"
        wav.append(contentsOf: withUnsafeBytes(of: fileSize.littleEndian) { Array($0) })
        wav.append(contentsOf: [0x57, 0x41, 0x56, 0x45]) // "WAVE"
        wav.append(contentsOf: [0x66, 0x6D, 0x74, 0x20]) // "fmt "
        wav.append(contentsOf: withUnsafeBytes(of: UInt32(16).littleEndian) { Array($0) })
        wav.append(contentsOf: withUnsafeBytes(of: UInt16(1).littleEndian) { Array($0) })  // PCM
        wav.append(contentsOf: withUnsafeBytes(of: UInt16(1).littleEndian) { Array($0) })  // mono
        wav.append(contentsOf: withUnsafeBytes(of: sampleRate.littleEndian) { Array($0) }) // sample rate
        wav.append(contentsOf: withUnsafeBytes(of: sampleRate.littleEndian) { Array($0) }) // byte rate
        wav.append(contentsOf: withUnsafeBytes(of: UInt16(1).littleEndian) { Array($0) })  // block align
        wav.append(contentsOf: withUnsafeBytes(of: UInt16(8).littleEndian) { Array($0) })  // bits/sample
        wav.append(contentsOf: [0x64, 0x61, 0x74, 0x61]) // "data"
        wav.append(contentsOf: withUnsafeBytes(of: dataSize.littleEndian) { Array($0) })
        wav.append(Data(repeating: 128, count: Int(numSamples))) // silence (unsigned 8-bit)

        do {
            let player = try AVAudioPlayer(data: wav)
            player.numberOfLoops = -1  // loop forever
            player.volume = 0
            player.play()
            silencePlayer = player
            NSLog("[CarPlay] Silence player started")
        } catch {
            NSLog("[CarPlay] Failed to start silence player: \(error)")
        }
    }

    private func stopSilencePlayer() {
        silencePlayer?.stop()
        silencePlayer = nil
    }

    // MARK: - Actions

    private func startPreset(id: String) {
        activePresetId = id

        let label = presets.first { ($0["id"] as? String) == id }?["label"]
            as? String ?? "Breathing"

        // Activate session and start silent audio BEFORE Flutter starts the
        // breathing session.  The silent player keeps AVAudioSession alive —
        // audioplayers' setActive(false) will throw (cannot deactivate while
        // audio is playing) and the session stays active, so all
        // MPNowPlayingInfoCenter writes from audio_service reach CarPlay.
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
        try? AVAudioSession.sharedInstance().setActive(true)
        startSilencePlayer()

        methodChannel?.invokeMethod("startPreset", arguments: id) { [weak self] _ in
            self?.showNowPlaying(presetLabel: label)
        }
    }
}
