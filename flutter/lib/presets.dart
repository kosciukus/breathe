import 'models.dart';

const List<BreathingPreset> builtInPresets = <BreathingPreset>[
  BreathingPreset(
    id: 'box_4_4_4_4',
    label: 'Box 4-4-4-4',
    durations: PhaseDurations(inhale: 4, holdIn: 4, exhale: 4, holdOut: 4),
    repeatMinutes: 8,
    route: BreathingRoute.nose,
    isCustom: false,
    about:
        'Equal phases make a predictable rhythm that helps settle racing thoughts.',
    bestFor: 'Stress reset, transitions between tasks, and concentration.',
    tip: 'Keep each phase gentle instead of forcing a deep inhale.',
    caution: 'Shorten the holds if they feel tense.',
  ),
  BreathingPreset(
    id: 'relax_4_7_8',
    label: 'Relax 4-7-8',
    durations: PhaseDurations(inhale: 4, holdIn: 7, exhale: 8, holdOut: 0),
    repeatMinutes: 6,
    route: BreathingRoute.noseMouth,
    isCustom: false,
    about:
        'Long exhale with a long hold can reduce arousal and support winding down.',
    bestFor: 'Evening relaxation and pre-sleep decompression.',
    tip: 'Use a soft inhale to avoid over-breathing before the hold.',
    caution: 'Skip or reduce the hold if you are new to breathwork.',
  ),
  BreathingPreset(
    id: 'coherent_5_5',
    label: 'Coherent 5-5',
    durations: PhaseDurations(inhale: 5, holdIn: 0, exhale: 5, holdOut: 0),
    repeatMinutes: 5,
    route: BreathingRoute.nose,
    isCustom: false,
    about:
        'Balanced inhale and exhale around 6 breaths per minute supports calm regulation.',
    bestFor: 'Daily baseline practice and emotional steadiness.',
    tip: 'Breathe through the nose and keep the breath smooth.',
    caution: 'If it feels too slow, try 4-4 first.',
  ),
  BreathingPreset(
    id: 'resonant_6_6',
    label: 'Resonant 6-6',
    durations: PhaseDurations(inhale: 6, holdIn: 0, exhale: 6, holdOut: 0),
    repeatMinutes: 5,
    route: BreathingRoute.nose,
    isCustom: false,
    about: 'A slower balanced pattern encourages deep, unhurried breathing.',
    bestFor: 'Longer calming sessions and nervous-system downshift.',
    tip: 'Stay relaxed in shoulders and jaw to avoid strain.',
    caution: 'Drop to 5-5 if you feel air hunger.',
  ),
  BreathingPreset(
    id: 'equal_4_4',
    label: 'Equal 4-4',
    durations: PhaseDurations(inhale: 4, holdIn: 0, exhale: 4, holdOut: 0),
    repeatMinutes: 5,
    route: BreathingRoute.nose,
    isCustom: false,
    about:
        'Simple equal timing gives a neutral, accessible rhythm for most users.',
    bestFor: 'Quick reset breaks and beginner practice.',
    tip: 'Use this as a warm-up before longer exhale presets.',
    caution: 'Keep volume light; bigger is not better.',
  ),
  BreathingPreset(
    id: 'pursed_2_4',
    label: 'Pursed-lip 2-4',
    durations: PhaseDurations(inhale: 2, holdIn: 0, exhale: 4, holdOut: 0),
    repeatMinutes: 5,
    route: BreathingRoute.nosePursed,
    isCustom: false,
    about:
        'Short inhale and longer exhale encourage slower out-breath pacing.',
    bestFor: 'After light activity and calming breathlessness feelings.',
    tip: 'Exhale as if gently blowing through a straw.',
    caution: 'Do not force the exhale; keep it easy.',
  ),
  BreathingPreset(
    id: 'extended_4_6',
    label: 'Extended exhale 4-6',
    durations: PhaseDurations(inhale: 4, holdIn: 0, exhale: 6, holdOut: 0),
    repeatMinutes: 5,
    route: BreathingRoute.nose,
    isCustom: false,
    about:
        'A modestly longer exhale helps reduce tension without long holds.',
    bestFor: 'Midday stress management and focused work blocks.',
    tip: 'Count evenly through the exhale instead of dumping air early.',
    caution: 'If you get tense, switch back to equal breathing.',
  ),
  BreathingPreset(
    id: 'extended_4_8',
    label: 'Extended exhale 4-8',
    durations: PhaseDurations(inhale: 4, holdIn: 0, exhale: 8, holdOut: 0),
    repeatMinutes: 5,
    route: BreathingRoute.noseMouth,
    isCustom: false,
    about: 'A much longer exhale can be deeply soothing when done gently.',
    bestFor: 'Evening wind-down and post-stress recovery.',
    tip: 'Keep the inhale small so the 8-second exhale stays comfortable.',
    caution: 'Use a shorter exhale if you feel short of breath.',
  ),
  BreathingPreset(
    id: 'triangle_3_3_3',
    label: 'Triangle 3-3-3',
    durations: PhaseDurations(inhale: 3, holdIn: 3, exhale: 3, holdOut: 0),
    repeatMinutes: 4,
    route: BreathingRoute.nose,
    isCustom: false,
    about:
        'Three equal phases with one hold add structure while staying brief.',
    bestFor: 'Grounding and quick pre-meeting focus.',
    tip: 'Let the hold feel quiet, not effortful.',
    caution: 'Remove the hold if it increases anxiety.',
  ),
  BreathingPreset(
    id: 'calm_4_4_6_2',
    label: 'Calm 4-4-6-2',
    durations: PhaseDurations(inhale: 4, holdIn: 4, exhale: 6, holdOut: 2),
    repeatMinutes: 5,
    route: BreathingRoute.nose,
    isCustom: false,
    about:
        'This four-phase pattern blends control and release with a longer exhale.',
    bestFor: 'Users who like structured rhythms with moderate challenge.',
    tip: 'Think: smooth in, settle, longer out, soft pause.',
    caution: 'Lower hold times first if the cycle feels demanding.',
  ),
];

const PhaseDurations defaultDraft = PhaseDurations(
  inhale: 4,
  holdIn: 0,
  exhale: 6,
  holdOut: 0,
);

const int defaultRepeatMinutes = 5;
const int preStartCountdownSeconds = 3;

