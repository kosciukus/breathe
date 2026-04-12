import 'dart:async';
import 'dart:io';

import 'package:audio_service/audio_service.dart';

import 'controller.dart';
import 'models.dart';

const String kBrowseAllPresetsId = 'all_presets';
const String kBrowseFavoritesId = 'favorites';

const String _albumName = 'Mindful Breathe';

/// Bridges [BreathingController] to the system media session so that
/// CarPlay (Now Playing) and Android Auto (Media Browser) can drive
/// breathing sessions without the phone screen.
class BreathingAudioHandler extends BaseAudioHandler {
  BreathingAudioHandler(this._controller) {
    _controller.addListener(_onControllerChanged);
    _syncPlaybackState();
  }

  final BreathingController _controller;
  String? _activePresetId;
  Timer? _positionTimer;

  // ---------------------------------------------------------------------------
  // Media browser tree (Android Auto + CarPlay list)
  // ---------------------------------------------------------------------------

  @override
  Future<List<MediaItem>> getChildren(String parentMediaId,
      [Map<String, dynamic>? options]) async {
    switch (parentMediaId) {
      case AudioService.browsableRootId:
        return <MediaItem>[
          const MediaItem(
            id: kBrowseAllPresetsId,
            title: 'All Presets',
            playable: false,
          ),
          const MediaItem(
            id: kBrowseFavoritesId,
            title: 'Favorites',
            playable: false,
          ),
        ];

      case kBrowseAllPresetsId:
        return _controller.presets.map(presetToMediaItem).toList();

      case kBrowseFavoritesId:
        final favorites = _controller.favoritePresets;
        if (favorites.isEmpty) {
          return _controller.presets.map(presetToMediaItem).toList();
        }
        return favorites.map(presetToMediaItem).toList();

      default:
        return <MediaItem>[];
    }
  }

  // ---------------------------------------------------------------------------
  // Playback controls
  // ---------------------------------------------------------------------------

  @override
  Future<void> playMediaItem(MediaItem mediaItem,
      {bool skipCountdown = false}) async {
    await _controller.applyPreset(mediaItem.id);
    _activePresetId = mediaItem.id;
    this.mediaItem.add(mediaItem);
    if (!_controller.isRunning) {
      await _controller.startOrResetSession(skipCountdown: skipCountdown);
    }
    _startPositionUpdates();
    _syncPlaybackState();
  }

  @override
  Future<void> play() async {
    if (_controller.isRunning) return;

    if (_activePresetId == null) {
      final preset = _controller.selectedPreset ?? _controller.presets.first;
      _activePresetId = preset.id;
      mediaItem.add(presetToMediaItem(preset));
    }

    await _controller.startOrResetSession();
    _startPositionUpdates();
    _syncPlaybackState();
  }

  @override
  Future<void> stop() async {
    if (_controller.isRunning) {
      await _controller.reset();
    }
    _stopPositionUpdates();
    _syncPlaybackState();
  }

  @override
  Future<void> pause() async {
    await stop();
  }

  // ---------------------------------------------------------------------------
  // Internal
  // ---------------------------------------------------------------------------

  void _onControllerChanged() {
    _syncPlaybackState();

    // Session ended externally (timer ran out or user stopped from phone UI).
    if (!_controller.isRunning && _positionTimer != null) {
      _stopPositionUpdates();
    }
  }

  void _syncPlaybackState() {
    final isRunning = _controller.isRunning;
    final isPreparing = _controller.isPreparing;

    playbackState.add(PlaybackState(
      controls: <MediaControl>[
        if (isRunning) MediaControl.pause else MediaControl.play,
      ],
      systemActions: const <MediaAction>{
        MediaAction.play,
        MediaAction.pause,
        MediaAction.stop,
      },
      processingState: isPreparing
          ? AudioProcessingState.buffering
          : isRunning
              ? AudioProcessingState.ready
              : AudioProcessingState.idle,
      playing: isRunning,
      speed: isRunning ? 1.0 : 0.0,
      updatePosition: _currentPosition,
    ));
  }

  Duration get _currentPosition {
    if (!_controller.isRunning) return Duration.zero;
    final totalMs = _controller.repeatMinutes * 60 * 1000;
    final remainingMs = _controller.sessionRemainingMs ?? 0;
    final elapsedMs = totalMs - remainingMs;
    return Duration(milliseconds: elapsedMs.clamp(0, totalMs));
  }

  void _startPositionUpdates() {
    _stopPositionUpdates();
    _positionTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_controller.isRunning) {
        playbackState.add(playbackState.value.copyWith(
          updatePosition: _currentPosition,
        ));
      }
    });
  }

  void _stopPositionUpdates() {
    _positionTimer?.cancel();
    _positionTimer = null;
  }

  MediaItem presetToMediaItem(BreathingPreset preset) {
    return MediaItem(
      id: preset.id,
      title: preset.label,
      album: Platform.isIOS ? null : _albumName,
      // On iOS, CarPlay owns the subtitle via CPListItem.detailText; setting
      // artist here causes audio_service to write it to MPNowPlayingInfoCenter
      // where it shows as a flashing subtitle on the Now Playing screen.
      artist: Platform.isIOS
          ? null
          : '${preset.durations.sequence} \u2022 ${preset.repeatMinutes} min',
      duration: Duration(minutes: preset.repeatMinutes),
      playable: true,
    );
  }

  void dispose() {
    _controller.removeListener(_onControllerChanged);
    _stopPositionUpdates();
  }
}
