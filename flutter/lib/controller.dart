import 'dart:async';
import 'dart:convert';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vibration/vibration.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

import 'cycle_transition.dart';
import 'models.dart';
import 'presets.dart';

class BreathingController extends ChangeNotifier {
  static const Duration _tickInterval = Duration(milliseconds: 100);
  static const Duration _minTickInterval = Duration(milliseconds: 16);

  static const String _darkModeKey = 'breathe_flutter.theme.dark_mode';
  static const String _soundKey = 'breathe_flutter.preferences.sound_enabled';
  static const String _vibrationKey =
      'breathe_flutter.preferences.vibration_enabled';
  static const String _languageKey = 'breathe_flutter.language';
  static const String _customPresetsKey = 'breathe_flutter.presets.custom';
  static const String _favoritePresetsKey = 'breathe_flutter.presets.favorite';
  static const String _hiddenPresetsKey = 'breathe_flutter.presets.hidden';
  static const String _lastPresetKey = 'breathe_flutter.presets.last';

  final AudioPlayer _audioPlayer = AudioPlayer();

  SharedPreferences? _prefs;
  Timer? _ticker;
  DateTime? _preStartEndsAt;
  DateTime? _phaseEndsAt;
  DateTime? _sessionEndsAt;
  bool _stopAfterCycle = false;

  bool isReady = false;
  bool soundEnabled = true;
  bool vibrationEnabled = true;
  bool darkModeEnabled = false;
  AppLanguage language = detectDefaultLanguage();

  PhaseDurations draft = defaultDraft;
  PhaseDurations active = defaultDraft;
  int repeatMinutes = defaultRepeatMinutes;
  BreathingPhase phase = BreathingPhase.inhale;
  int remainingMs = defaultDraft.inhale * 1000;
  int? preStartRemainingMs;
  int? sessionRemainingMs = defaultRepeatMinutes * 60 * 1000;
  bool isRunning = false;

  List<BreathingPreset> _customPresets = <BreathingPreset>[];
  final Set<String> _favoritePresetIds = <String>{};
  final Set<String> _hiddenPresetIds = <String>{};

  Future<void> initialize() async {
    _prefs = await SharedPreferences.getInstance();
    final prefs = _prefs!;

    darkModeEnabled = prefs.getBool(_darkModeKey) ?? false;
    soundEnabled = prefs.getBool(_soundKey) ?? true;
    vibrationEnabled = prefs.getBool(_vibrationKey) ?? true;
    language = resolveLanguageCode(
      prefs.getString(_languageKey),
      fallback: detectDefaultLanguage(),
    );

    _favoritePresetIds
      ..clear()
      ..addAll(prefs.getStringList(_favoritePresetsKey) ?? const <String>[]);
    _hiddenPresetIds
      ..clear()
      ..addAll(prefs.getStringList(_hiddenPresetsKey) ?? const <String>[]);

    final rawCustomPresets = prefs.getString(_customPresetsKey);
    if (rawCustomPresets != null && rawCustomPresets.isNotEmpty) {
      try {
        final decoded = jsonDecode(rawCustomPresets);
        if (decoded is List) {
          _customPresets = decoded
              .whereType<Map>()
              .map((dynamic item) => Map<String, dynamic>.from(item as Map))
              .map(BreathingPreset.fromJson)
              .where((preset) => preset.id.isNotEmpty)
              .toList();
        }
      } catch (_) {
        _customPresets = <BreathingPreset>[];
      }
    }

    final lastPresetId = prefs.getString(_lastPresetKey);
    final initialPreset = _presetById(lastPresetId) ?? presets.firstOrNull;
    if (initialPreset != null) {
      draft = initialPreset.durations;
      active = initialPreset.durations;
      repeatMinutes = initialPreset.repeatMinutes;
    } else {
      draft = defaultDraft;
      active = defaultDraft;
      repeatMinutes = defaultRepeatMinutes;
    }

    phase = BreathingPhase.inhale;
    remainingMs = active.inhale * 1000;
    sessionRemainingMs = repeatMinutes > 0 ? repeatMinutes * 60 * 1000 : null;
    isReady = true;
    notifyListeners();
  }

  List<BreathingPreset> get presets {
    final visibleBuiltIns = builtInPresets
        .where((preset) => !_hiddenPresetIds.contains(preset.id))
        .toList();
    return <BreathingPreset>[...visibleBuiltIns, ..._customPresets];
  }

  List<BreathingPreset> get favoritePresets {
    return presets.where((preset) => isFavorite(preset.id)).toList();
  }

  BreathingPreset? get selectedPreset {
    for (final preset in presets) {
      if (preset.matches(draft, repeatMinutes)) {
        return preset;
      }
    }
    return null;
  }

  bool get isPreparing => preStartRemainingMs != null;

  int? get preStartRemainingSeconds {
    final remaining = preStartRemainingMs;
    if (remaining == null) return null;
    final seconds = (remaining / 1000).ceil();
    return seconds < 1 ? 1 : seconds;
  }

  int get totalActiveSeconds => active.totalSeconds;

  double get progress {
    if (isPreparing) return 0;
    final phaseDurationMs = active.durationFor(phase) * 1000;
    if (phaseDurationMs <= 0) return 1;
    final elapsed = phaseDurationMs - remainingMs;
    final clamped = elapsed.clamp(0, phaseDurationMs);
    return clamped / phaseDurationMs;
  }

  bool isFavorite(String presetId) => _favoritePresetIds.contains(presetId);

  Future<void> setSoundEnabled(bool value) async {
    soundEnabled = value;
    notifyListeners();
    final prefs = _prefs;
    if (prefs != null) {
      await prefs.setBool(_soundKey, value);
    }
  }

  Future<void> setVibrationEnabled(bool value) async {
    vibrationEnabled = value;
    notifyListeners();
    final prefs = _prefs;
    if (prefs != null) {
      await prefs.setBool(_vibrationKey, value);
    }
  }

  Future<void> setDarkModeEnabled(bool value) async {
    darkModeEnabled = value;
    notifyListeners();
    final prefs = _prefs;
    if (prefs != null) {
      await prefs.setBool(_darkModeKey, value);
    }
  }

  Future<void> setLanguage(AppLanguage value) async {
    language = value;
    notifyListeners();
    final prefs = _prefs;
    if (prefs != null) {
      await prefs.setString(_languageKey, value.code);
    }
  }

  void setRepeatMinutes(double value) {
    repeatMinutes = clampWhole(value, min: 0, max: 30);
    if (!isRunning) {
      _syncIdleState();
    }
    notifyListeners();
  }

  void setPhaseDuration(BreathingPhase targetPhase, double value) {
    final nextValue = clampWhole(value, min: 0, max: 20);
    switch (targetPhase) {
      case BreathingPhase.inhale:
        draft = draft.copyWith(inhale: nextValue);
        break;
      case BreathingPhase.holdIn:
        draft = draft.copyWith(holdIn: nextValue);
        break;
      case BreathingPhase.exhale:
        draft = draft.copyWith(exhale: nextValue);
        break;
      case BreathingPhase.holdOut:
        draft = draft.copyWith(holdOut: nextValue);
        break;
    }

    if (!isRunning) {
      _syncIdleState();
    }
    notifyListeners();
  }

  Future<void> applyPreset(String presetId) async {
    final preset = _presetById(presetId);
    if (preset == null) return;

    draft = preset.durations;
    repeatMinutes = preset.repeatMinutes;

    if (!isRunning) {
      _syncIdleState();
    }

    notifyListeners();
    final prefs = _prefs;
    if (prefs != null) {
      await prefs.setString(_lastPresetKey, preset.id);
    }
  }

  Future<void> toggleFavoriteForCurrent() async {
    final matched = selectedPreset;
    if (matched != null) {
      await toggleFavorite(matched.id);
      return;
    }

    await saveCurrentPreset(markFavorite: true);
  }

  Future<void> toggleFavorite(String presetId) async {
    if (_favoritePresetIds.contains(presetId)) {
      _favoritePresetIds.remove(presetId);
    } else {
      _favoritePresetIds.add(presetId);
    }

    notifyListeners();
    await _persistFavorites();
  }

  Future<bool> saveCurrentPreset({bool markFavorite = false}) async {
    for (final preset in _customPresets) {
      if (preset.matches(draft, repeatMinutes)) {
        if (markFavorite) {
          _favoritePresetIds.add(preset.id);
          await _persistFavorites();
          notifyListeners();
        }
        return false;
      }
    }

    final id = 'custom_${DateTime.now().millisecondsSinceEpoch}';
    final preset = BreathingPreset(
      id: id,
      label: 'Custom ${draft.sequence} ($repeatMinutes min)',
      durations: draft,
      repeatMinutes: repeatMinutes,
      route: BreathingRoute.nose,
      isCustom: true,
      about: 'A custom breathing rhythm saved from your current settings.',
      bestFor: 'Whenever this timing feels comfortable and useful.',
      tip: 'Adjust one phase at a time and keep the pattern easy to sustain.',
      caution: 'Stop if the rhythm feels strained or uncomfortable.',
    );

    _customPresets = <BreathingPreset>[..._customPresets, preset];
    if (markFavorite) {
      _favoritePresetIds.add(preset.id);
    }

    notifyListeners();
    await _persistCustomPresets();
    await _persistFavorites();
    final prefs = _prefs;
    if (prefs != null) {
      await prefs.setString(_lastPresetKey, preset.id);
    }
    return true;
  }

  Future<bool> removeSelectedPreset() async {
    final matched = selectedPreset;
    if (matched == null) return false;

    if (matched.isCustom) {
      _customPresets = _customPresets
          .where((preset) => preset.id != matched.id)
          .toList();
      _favoritePresetIds.remove(matched.id);
      notifyListeners();
      await _persistCustomPresets();
      await _persistFavorites();
      return true;
    }

    _hiddenPresetIds.add(matched.id);
    _favoritePresetIds.remove(matched.id);
    notifyListeners();
    await _persistHiddenPresets();
    await _persistFavorites();
    return true;
  }

  Future<void> startOrResetSession() async {
    if (isRunning) {
      await reset();
      return;
    }

    active = draft;
    phase = BreathingPhase.inhale;
    remainingMs = active.inhale * 1000;
    preStartRemainingMs = preStartCountdownSeconds * 1000;
    _preStartEndsAt =
        DateTime.now().add(const Duration(seconds: preStartCountdownSeconds));
    _phaseEndsAt = DateTime.now().add(Duration(milliseconds: remainingMs));
    sessionRemainingMs = repeatMinutes > 0 ? repeatMinutes * 60 * 1000 : null;
    _sessionEndsAt = null;
    _stopAfterCycle = false;
    isRunning = true;

    await WakelockPlus.enable();
    _startTicker();
    notifyListeners();
  }

  Future<void> reset() async {
    _stopTicker();
    await _stopPhaseCue();
    await WakelockPlus.disable();

    isRunning = false;
    _stopAfterCycle = false;
    _preStartEndsAt = null;
    _phaseEndsAt = null;
    _sessionEndsAt = null;
    preStartRemainingMs = null;
    _syncIdleState();
    notifyListeners();
  }

  Future<void> resetAppData() async {
    final prefs = _prefs;

    await reset();

    _customPresets = <BreathingPreset>[];
    _favoritePresetIds.clear();
    _hiddenPresetIds.clear();

    soundEnabled = true;
    vibrationEnabled = true;
    darkModeEnabled = false;
    language = detectDefaultLanguage();

    final fallbackPreset = builtInPresets.first;
    draft = fallbackPreset.durations;
    active = fallbackPreset.durations;
    repeatMinutes = fallbackPreset.repeatMinutes;
    _syncIdleState();

    notifyListeners();

    if (prefs != null) {
      await prefs.remove(_darkModeKey);
      await prefs.remove(_soundKey);
      await prefs.remove(_vibrationKey);
      await prefs.remove(_languageKey);
      await prefs.remove(_customPresetsKey);
      await prefs.remove(_favoritePresetsKey);
      await prefs.remove(_hiddenPresetsKey);
      await prefs.remove(_lastPresetKey);
    }
  }

  void _syncIdleState() {
    active = draft;
    phase = BreathingPhase.inhale;
    remainingMs = active.inhale * 1000;
    sessionRemainingMs = repeatMinutes > 0 ? repeatMinutes * 60 * 1000 : null;
  }

  void _startTicker() {
    _scheduleNextTick();
  }

  void _scheduleNextTick([int? remainingMs]) {
    if (!isRunning) return;

    _stopTicker();

    var nextDelay = _tickInterval;
    if (remainingMs != null) {
      if (remainingMs <= 0) {
        nextDelay = _minTickInterval;
      } else if (remainingMs < _tickInterval.inMilliseconds) {
        nextDelay = Duration(
          milliseconds: remainingMs < _minTickInterval.inMilliseconds
              ? _minTickInterval.inMilliseconds
              : remainingMs,
        );
      }
    }

    _ticker = Timer(nextDelay, () {
      unawaited(_tick());
    });
  }

  void _stopTicker() {
    _ticker?.cancel();
    _ticker = null;
  }

  Future<void> _tick() async {
    if (!isRunning) return;

    final now = DateTime.now();

    if (_preStartEndsAt != null) {
      final nextRemaining = _preStartEndsAt!.difference(now).inMilliseconds;
      if (nextRemaining > 0) {
        preStartRemainingMs = nextRemaining;
        notifyListeners();
        _scheduleNextTick(nextRemaining);
        return;
      }

      _preStartEndsAt = null;
      preStartRemainingMs = null;
      active = draft;
      phase = BreathingPhase.inhale;
      remainingMs = active.inhale * 1000;
      _phaseEndsAt = now.add(Duration(milliseconds: remainingMs));
      sessionRemainingMs = repeatMinutes > 0 ? repeatMinutes * 60 * 1000 : null;
      _sessionEndsAt = sessionRemainingMs == null
          ? null
          : now.add(Duration(milliseconds: sessionRemainingMs!));
      notifyListeners();
      unawaited(_playPhaseCue(phase));

      if (remainingMs > 0) {
        _scheduleNextTick(remainingMs);
        return;
      }
    }

    if (_sessionEndsAt != null) {
      final nextSession = _sessionEndsAt!.difference(now).inMilliseconds;
      if (nextSession <= 0) {
        sessionRemainingMs = 0;
        _sessionEndsAt = null;
        _stopAfterCycle = true;
      } else {
        sessionRemainingMs = nextSession;
      }
    }

    _phaseEndsAt ??= now.add(Duration(milliseconds: remainingMs));

    final nextPhaseRemaining = _phaseEndsAt!.difference(now).inMilliseconds;
    if (nextPhaseRemaining > 0) {
      remainingMs = nextPhaseRemaining;
      notifyListeners();
      _scheduleNextTick(nextPhaseRemaining);
      return;
    }

    active = draft;
    final cycleMs = active.totalSeconds * 1000;
    if (cycleMs <= 0) {
      await reset();
      return;
    }
    final transition = resolveCycleTransition(
      currentPhase: phase,
      durations: active,
      spillMs: -nextPhaseRemaining,
      stopAfterCycle: _stopAfterCycle,
    );
    switch (transition) {
      case StopCycleTransition():
        await reset();
        return;
      case ContinueCycleTransition():
        phase = transition.phase;
        remainingMs = transition.remainingMs;
        _phaseEndsAt = now.add(Duration(milliseconds: remainingMs));
        notifyListeners();
        unawaited(_playPhaseCue(phase));
        _scheduleNextTick(remainingMs);
        return;
    }
  }

  BreathingPreset? _presetById(String? presetId) {
    if (presetId == null || presetId.isEmpty) return null;
    for (final preset in presets) {
      if (preset.id == presetId) {
        return preset;
      }
    }
    return null;
  }

  Future<void> _persistCustomPresets() async {
    final prefs = _prefs;
    if (prefs == null) return;

    final payload = jsonEncode(
      _customPresets.map((preset) => preset.toJson()).toList(),
    );
    await prefs.setString(_customPresetsKey, payload);
  }

  Future<void> _persistFavorites() async {
    final prefs = _prefs;
    if (prefs == null) return;
    await prefs.setStringList(
      _favoritePresetsKey,
      _favoritePresetIds.toList(),
    );
  }

  Future<void> _persistHiddenPresets() async {
    final prefs = _prefs;
    if (prefs == null) return;
    await prefs.setStringList(
      _hiddenPresetsKey,
      _hiddenPresetIds.toList(),
    );
  }

  Future<void> _playPhaseCue(BreathingPhase currentPhase) async {
    if (soundEnabled) {
      final assetPath = switch (currentPhase) {
        BreathingPhase.inhale => 'sounds/phase-inhale.mp3',
        BreathingPhase.holdIn => 'sounds/phase-hold.mp3',
        BreathingPhase.exhale => 'sounds/phase-exhale.mp3',
        BreathingPhase.holdOut => 'sounds/phase-hold.mp3',
      };

      try {
        await _audioPlayer.stop();
        await _audioPlayer.play(AssetSource(assetPath));
      } catch (_) {
        // Ignore playback failures and keep the timer running.
      }
    }

    if (vibrationEnabled) {
      try {
        final hasVibrator = await Vibration.hasVibrator();
        if (hasVibrator) {
          Vibration.vibrate(duration: 120);
        }
      } catch (_) {
        // Ignore haptic failures.
      }
    }
  }

  Future<void> _stopPhaseCue() async {
    try {
      await _audioPlayer.stop();
    } catch (_) {
      // Ignore stop failures.
    }
  }

  @override
  void dispose() {
    _stopTicker();
    unawaited(_stopPhaseCue());
    unawaited(WakelockPlus.disable());
    unawaited(_audioPlayer.dispose());
    super.dispose();
  }
}

extension<E> on List<E> {
  E? get firstOrNull => isEmpty ? null : first;
}
