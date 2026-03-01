import 'dart:ui';

enum AppLanguage {
  en,
  es,
  fr,
  de,
  pt,
  ru,
  uk,
  hi,
  ja,
  pl,
}

enum BreathingPhase {
  inhale,
  holdIn,
  exhale,
  holdOut,
}

enum BreathingRoute {
  nose,
  noseMouth,
  nosePursed,
}

extension AppLanguageX on AppLanguage {
  String get code => name;
}

extension BreathingPhaseX on BreathingPhase {
  BreathingPhase get next {
    switch (this) {
      case BreathingPhase.inhale:
        return BreathingPhase.holdIn;
      case BreathingPhase.holdIn:
        return BreathingPhase.exhale;
      case BreathingPhase.exhale:
        return BreathingPhase.holdOut;
      case BreathingPhase.holdOut:
        return BreathingPhase.inhale;
    }
  }
}

int clampWhole(num value, {int min = 0, int max = 60}) {
  final rounded = value.round();
  if (rounded < min) return min;
  if (rounded > max) return max;
  return rounded;
}

int coerceInt(
  Object? value, {
  int min = 0,
  int max = 60,
  int fallback = 0,
}) {
  if (value is num) {
    return clampWhole(value, min: min, max: max);
  }

  if (value is String) {
    final parsed = num.tryParse(value);
    if (parsed != null) {
      return clampWhole(parsed, min: min, max: max);
    }
  }

  return fallback;
}

AppLanguage resolveLanguageCode(String? raw, {AppLanguage fallback = AppLanguage.en}) {
  if (raw == null || raw.isEmpty) return fallback;
  final normalized = raw.toLowerCase().split('-').first;
  for (final language in AppLanguage.values) {
    if (language.code == normalized) {
      return language;
    }
  }
  return fallback;
}

AppLanguage detectDefaultLanguage() {
  final code = PlatformDispatcher.instance.locale.languageCode;
  return resolveLanguageCode(code);
}

String formatClock(int milliseconds) {
  final clamped = milliseconds < 0 ? 0 : milliseconds;
  final totalSeconds = clamped ~/ 1000;
  final minutes = totalSeconds ~/ 60;
  final seconds = totalSeconds % 60;
  final minuteText = minutes.toString().padLeft(2, '0');
  final secondText = seconds.toString().padLeft(2, '0');
  return '$minuteText:$secondText';
}

class PhaseDurations {
  const PhaseDurations({
    required this.inhale,
    required this.holdIn,
    required this.exhale,
    required this.holdOut,
  });

  final int inhale;
  final int holdIn;
  final int exhale;
  final int holdOut;

  static const zero = PhaseDurations(
    inhale: 0,
    holdIn: 0,
    exhale: 0,
    holdOut: 0,
  );

  int durationFor(BreathingPhase phase) {
    switch (phase) {
      case BreathingPhase.inhale:
        return inhale;
      case BreathingPhase.holdIn:
        return holdIn;
      case BreathingPhase.exhale:
        return exhale;
      case BreathingPhase.holdOut:
        return holdOut;
    }
  }

  int get totalSeconds => inhale + holdIn + exhale + holdOut;

  String get sequence => '$inhale-$holdIn-$exhale-$holdOut';

  PhaseDurations copyWith({
    int? inhale,
    int? holdIn,
    int? exhale,
    int? holdOut,
  }) {
    return PhaseDurations(
      inhale: inhale ?? this.inhale,
      holdIn: holdIn ?? this.holdIn,
      exhale: exhale ?? this.exhale,
      holdOut: holdOut ?? this.holdOut,
    );
  }

  Map<String, Object> toJson() {
    return <String, Object>{
      'inhale': inhale,
      'holdIn': holdIn,
      'exhale': exhale,
      'holdOut': holdOut,
    };
  }

  factory PhaseDurations.fromJson(Map<String, dynamic> json) {
    return PhaseDurations(
      inhale: coerceInt(json['inhale'], max: 20),
      holdIn: coerceInt(json['holdIn'], max: 20),
      exhale: coerceInt(json['exhale'], max: 20),
      holdOut: coerceInt(json['holdOut'], max: 20),
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is PhaseDurations &&
        other.inhale == inhale &&
        other.holdIn == holdIn &&
        other.exhale == exhale &&
        other.holdOut == holdOut;
  }

  @override
  int get hashCode => Object.hash(inhale, holdIn, exhale, holdOut);
}

class BreathingPreset {
  const BreathingPreset({
    required this.id,
    required this.label,
    required this.durations,
    required this.repeatMinutes,
    required this.route,
    required this.isCustom,
    required this.about,
    required this.bestFor,
    required this.tip,
    required this.caution,
  });

  final String id;
  final String label;
  final PhaseDurations durations;
  final int repeatMinutes;
  final BreathingRoute route;
  final bool isCustom;
  final String about;
  final String bestFor;
  final String tip;
  final String caution;

  bool matches(PhaseDurations currentDurations, int currentRepeatMinutes) {
    return durations == currentDurations && repeatMinutes == currentRepeatMinutes;
  }

  Map<String, Object> toJson() {
    return <String, Object>{
      'id': id,
      'label': label,
      'durations': durations.toJson(),
      'repeatMinutes': repeatMinutes,
      'route': route.name,
      'isCustom': isCustom,
      'about': about,
      'bestFor': bestFor,
      'tip': tip,
      'caution': caution,
    };
  }

  factory BreathingPreset.fromJson(Map<String, dynamic> json) {
    final routeRaw = json['route'];
    final routeName = routeRaw is String ? routeRaw : BreathingRoute.nose.name;

    BreathingRoute route = BreathingRoute.nose;
    for (final candidate in BreathingRoute.values) {
      if (candidate.name == routeName) {
        route = candidate;
        break;
      }
    }

    final durationsRaw = json['durations'];
    final durationsMap = durationsRaw is Map<String, dynamic>
        ? durationsRaw
        : <String, dynamic>{};

    return BreathingPreset(
      id: json['id'] is String ? json['id'] as String : '',
      label: json['label'] is String ? json['label'] as String : 'Custom',
      durations: PhaseDurations.fromJson(durationsMap),
      repeatMinutes: coerceInt(json['repeatMinutes'], max: 30, fallback: 5),
      route: route,
      isCustom: json['isCustom'] is bool ? json['isCustom'] as bool : true,
      about: json['about'] is String ? json['about'] as String : '',
      bestFor: json['bestFor'] is String ? json['bestFor'] as String : '',
      tip: json['tip'] is String ? json['tip'] as String : '',
      caution: json['caution'] is String ? json['caution'] as String : '',
    );
  }
}

