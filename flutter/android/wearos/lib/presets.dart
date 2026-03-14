class WearPreset {
  const WearPreset({
    required this.id,
    required this.label,
    required this.inhale,
    required this.holdIn,
    required this.exhale,
    required this.holdOut,
    required this.minutes,
  });

  final String id;
  final String label;
  final int inhale;
  final int holdIn;
  final int exhale;
  final int holdOut;
  final int minutes;

  String get sequence => '$inhale-$holdIn-$exhale-$holdOut';

  int durationFor(BreathPhase phase) => switch (phase) {
        BreathPhase.inhale => inhale,
        BreathPhase.holdIn => holdIn,
        BreathPhase.exhale => exhale,
        BreathPhase.holdOut => holdOut,
      };

  int get totalCycleSeconds => inhale + holdIn + exhale + holdOut;
}

enum BreathPhase {
  inhale,
  holdIn,
  exhale,
  holdOut;

  BreathPhase get next => switch (this) {
        BreathPhase.inhale => BreathPhase.holdIn,
        BreathPhase.holdIn => BreathPhase.exhale,
        BreathPhase.exhale => BreathPhase.holdOut,
        BreathPhase.holdOut => BreathPhase.inhale,
      };

  String get label => switch (this) {
        BreathPhase.inhale => 'Inhale',
        BreathPhase.holdIn => 'Hold',
        BreathPhase.exhale => 'Exhale',
        BreathPhase.holdOut => 'Hold',
      };
}

const List<WearPreset> builtInPresets = [
  WearPreset(id: 'box_4_4_4_4',    label: 'Box 4-4-4-4',          inhale: 4, holdIn: 4, exhale: 4, holdOut: 4, minutes: 8),
  WearPreset(id: 'relax_4_7_8',    label: 'Relax 4-7-8',          inhale: 4, holdIn: 7, exhale: 8, holdOut: 0, minutes: 6),
  WearPreset(id: 'coherent_5_5',   label: 'Coherent 5-5',         inhale: 5, holdIn: 0, exhale: 5, holdOut: 0, minutes: 5),
  WearPreset(id: 'resonant_6_6',   label: 'Resonant 6-6',         inhale: 6, holdIn: 0, exhale: 6, holdOut: 0, minutes: 5),
  WearPreset(id: 'equal_4_4',      label: 'Equal 4-4',            inhale: 4, holdIn: 0, exhale: 4, holdOut: 0, minutes: 5),
  WearPreset(id: 'pursed_2_4',     label: 'Pursed-lip 2-4',       inhale: 2, holdIn: 0, exhale: 4, holdOut: 0, minutes: 5),
  WearPreset(id: 'extended_4_6',   label: 'Extended exhale 4-6',  inhale: 4, holdIn: 0, exhale: 6, holdOut: 0, minutes: 5),
  WearPreset(id: 'extended_4_8',   label: 'Extended exhale 4-8',  inhale: 4, holdIn: 0, exhale: 8, holdOut: 0, minutes: 5),
  WearPreset(id: 'triangle_3_3_3', label: 'Triangle 3-3-3',       inhale: 3, holdIn: 3, exhale: 3, holdOut: 0, minutes: 4),
  WearPreset(id: 'calm_4_4_6_2',   label: 'Calm 4-4-6-2',         inhale: 4, holdIn: 4, exhale: 6, holdOut: 2, minutes: 5),
];
