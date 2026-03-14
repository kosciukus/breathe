import 'dart:async';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vibration/vibration.dart';

import 'presets.dart';

const int _preStartSeconds = 3;
const String _lastPresetKey = 'breathe.wear.lastPresetId';
const String _customInhaleKey  = 'breathe.wear.custom.inhale';
const String _customHoldInKey  = 'breathe.wear.custom.holdIn';
const String _customExhaleKey  = 'breathe.wear.custom.exhale';
const String _customHoldOutKey = 'breathe.wear.custom.holdOut';
const String _customMinutesKey = 'breathe.wear.custom.minutes';

class BreathingEngine extends ChangeNotifier {
  BreathPhase phase = BreathPhase.inhale;
  double phaseProgress = 0; // 0.0 – 1.0
  double phaseRemainingSeconds = 0;
  int sessionRemainingSeconds = 0;
  bool isRunning = false;
  int? countdownSeconds; // non-null during pre-start
  WearPreset selectedPreset = builtInPresets.first;
  WearPreset lastCustomPreset = WearPreset(
    id: 'custom', label: 'Custom 4-0-4-0',
    inhale: 4, holdIn: 0, exhale: 4, holdOut: 0, minutes: 5,
  );

  Timer? _ticker;
  DateTime _phaseEndTime = DateTime.now();
  DateTime? _sessionEndTime;
  double _phaseDuration = 0;
  bool _stopAfterCycle = false;

  AudioPlayer? _inhalePlayer;
  AudioPlayer? _holdPlayer;
  AudioPlayer? _exhalePlayer;
  bool _audioPrepared = false;

  BreathingEngine() {
    _restoreLastPreset();
  }

  void selectPreset(WearPreset preset) {
    selectedPreset = preset;
    if (preset.id == 'custom') {
      lastCustomPreset = preset;
      SharedPreferences.getInstance().then((p) {
        p.setString(_lastPresetKey, preset.id);
        p.setInt(_customInhaleKey,  preset.inhale);
        p.setInt(_customHoldInKey,  preset.holdIn);
        p.setInt(_customExhaleKey,  preset.exhale);
        p.setInt(_customHoldOutKey, preset.holdOut);
        p.setInt(_customMinutesKey, preset.minutes);
      });
    } else {
      SharedPreferences.getInstance()
          .then((p) => p.setString(_lastPresetKey, preset.id));
    }
    notifyListeners();
  }

  void start() {
    if (isRunning) return;
    isRunning = true;
    countdownSeconds = _preStartSeconds;
    _stopAfterCycle = false;
    notifyListeners();

    var remaining = _preStartSeconds;
    _ticker = Timer.periodic(const Duration(seconds: 1), (t) {
      remaining--;
      if (remaining > 0) {
        countdownSeconds = remaining;
        notifyListeners();
      } else {
        t.cancel();
        countdownSeconds = null;
        _beginSession();
      }
    });
  }

  void stop() {
    _ticker?.cancel();
    _ticker = null;
    isRunning = false;
    countdownSeconds = null;
    _stopAfterCycle = false;
    _sessionEndTime = null;
    phase = BreathPhase.inhale;
    phaseProgress = 0;
    phaseRemainingSeconds = 0;
    sessionRemainingSeconds = 0;
    notifyListeners();
  }

  void _beginSession() {
    final preset = selectedPreset;
    _sessionEndTime =
        DateTime.now().add(Duration(minutes: preset.minutes));
    sessionRemainingSeconds = preset.minutes * 60;
    _prepareAudio();
    _beginPhase(BreathPhase.inhale);

    _ticker = Timer.periodic(const Duration(milliseconds: 100), (_) => _tick());
  }

  void _beginPhase(BreathPhase newPhase) {
    phase = newPhase;
    _phaseDuration = selectedPreset.durationFor(newPhase).toDouble();
    _phaseEndTime =
        DateTime.now().add(Duration(milliseconds: (_phaseDuration * 1000).round()));
    phaseRemainingSeconds = _phaseDuration;
    phaseProgress = 0;
    _playCue(newPhase);
    notifyListeners();
  }

  void _tick() {
    final now = DateTime.now();

    // Session countdown
    final sessionEnd = _sessionEndTime;
    if (sessionEnd != null) {
      final remaining = sessionEnd.difference(now).inSeconds;
      if (remaining <= 0) {
        _sessionEndTime = null;
        sessionRemainingSeconds = 0;
        _stopAfterCycle = true;
      } else {
        sessionRemainingSeconds = remaining;
      }
    }

    // Phase progress
    final phaseRemaining =
        _phaseEndTime.difference(now).inMilliseconds / 1000.0;
    if (phaseRemaining > 0) {
      phaseRemainingSeconds = phaseRemaining;
      phaseProgress = _phaseDuration > 0
          ? ((_phaseDuration - phaseRemaining) / _phaseDuration).clamp(0.0, 1.0)
          : 1.0;
      notifyListeners();
    } else {
      _advancePhase(spillMs: (-phaseRemaining * 1000).round());
    }
  }

  void _advancePhase({required int spillMs}) {
    var next = phase.next;

    // Skip zero-duration phases
    var guard = 4;
    while (selectedPreset.durationFor(next) == 0 && guard-- > 0) {
      next = next.next;
    }

    if (next == BreathPhase.inhale && _stopAfterCycle) {
      stop();
      return;
    }
    if (selectedPreset.totalCycleSeconds == 0) {
      stop();
      return;
    }

    phase = next;
    _phaseDuration = selectedPreset.durationFor(next).toDouble();
    final spillSeconds = spillMs / 1000.0;
    final remaining = (_phaseDuration - spillSeconds).clamp(0.0, _phaseDuration);
    _phaseEndTime =
        DateTime.now().add(Duration(milliseconds: (remaining * 1000).round()));
    phaseRemainingSeconds = remaining;
    phaseProgress = _phaseDuration > 0
        ? (spillSeconds / _phaseDuration).clamp(0.0, 1.0)
        : 0.0;
    _playCue(next);
    notifyListeners();
  }

  void _playCue(BreathPhase p) {
    // Sound
    final player = switch (p) {
      BreathPhase.inhale => _inhalePlayer,
      BreathPhase.holdIn => _holdPlayer,
      BreathPhase.exhale => _exhalePlayer,
      BreathPhase.holdOut => _holdPlayer,
    };
    if (player != null) {
      player.stop().then((_) => player.resume());
    }

    // Vibration
    switch (p) {
      case BreathPhase.inhale:
        Vibration.vibrate(duration: 120, amplitude: 200);
      case BreathPhase.exhale:
        Vibration.vibrate(duration: 80, amplitude: 128);
      case BreathPhase.holdIn:
      case BreathPhase.holdOut:
        Vibration.vibrate(duration: 40, amplitude: 80);
    }
  }

  Future<void> _prepareAudio() async {
    if (_audioPrepared) return;
    _audioPrepared = true;

    _inhalePlayer = AudioPlayer();
    _holdPlayer = AudioPlayer();
    _exhalePlayer = AudioPlayer();

    for (final entry in {
      _inhalePlayer!: 'assets/sounds/phase-inhale.mp3',
      _holdPlayer!: 'assets/sounds/phase-hold.mp3',
      _exhalePlayer!: 'assets/sounds/phase-exhale.mp3',
    }.entries) {
      try {
        await entry.key.setPlayerMode(PlayerMode.lowLatency);
        await entry.key.setReleaseMode(ReleaseMode.stop);
        await entry.key.setSource(AssetSource(entry.value.replaceFirst('assets/', '')));
      } catch (_) {
        // Ignore preparation failures; play will still be attempted
      }
    }
  }

  Future<void> _restoreLastPreset() async {
    final prefs = await SharedPreferences.getInstance();

    // Restore last custom values (even if custom wasn't the last used preset)
    final customInhale  = prefs.getInt(_customInhaleKey);
    if (customInhale != null) {
      final hi  = prefs.getInt(_customHoldInKey)  ?? lastCustomPreset.holdIn;
      final e   = prefs.getInt(_customExhaleKey)  ?? lastCustomPreset.exhale;
      final ho  = prefs.getInt(_customHoldOutKey) ?? lastCustomPreset.holdOut;
      lastCustomPreset = WearPreset(
        id: 'custom', label: 'Custom $customInhale-$hi-$e-$ho',
        inhale:  customInhale,
        holdIn:  hi,
        exhale:  e,
        holdOut: ho,
        minutes: prefs.getInt(_customMinutesKey) ?? lastCustomPreset.minutes,
      );
    }

    final id = prefs.getString(_lastPresetKey);
    if (id == 'custom') {
      selectedPreset = lastCustomPreset;
    } else if (id != null) {
      final match = builtInPresets.where((p) => p.id == id).firstOrNull;
      if (match != null) selectedPreset = match;
    }
    notifyListeners();
  }

  @override
  void dispose() {
    _ticker?.cancel();
    _inhalePlayer?.dispose();
    _holdPlayer?.dispose();
    _exhalePlayer?.dispose();
    super.dispose();
  }
}
