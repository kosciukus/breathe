import 'presets.dart';

/// Maps lowercase voice aliases to built-in preset IDs.
const Map<String, String> presetAliases = {
  // box_4_4_4_4
  'box': 'box_4_4_4_4',
  'box breathing': 'box_4_4_4_4',
  'box 4 4 4 4': 'box_4_4_4_4',
  'box 4-4-4-4': 'box_4_4_4_4',
  'square': 'box_4_4_4_4',
  'square breathing': 'box_4_4_4_4',
  // relax_4_7_8
  'relax': 'relax_4_7_8',
  'relax 4 7 8': 'relax_4_7_8',
  'relax 4-7-8': 'relax_4_7_8',
  '4 7 8': 'relax_4_7_8',
  '4-7-8': 'relax_4_7_8',
  'relaxing': 'relax_4_7_8',
  // coherent_5_5
  'coherent': 'coherent_5_5',
  'coherent breathing': 'coherent_5_5',
  // resonant_6_6
  'resonant': 'resonant_6_6',
  'resonant breathing': 'resonant_6_6',
  // equal_4_4
  'equal': 'equal_4_4',
  'equal breathing': 'equal_4_4',
  // pursed_2_4
  'pursed lip': 'pursed_2_4',
  'pursed': 'pursed_2_4',
  'pursed lip breathing': 'pursed_2_4',
  'pursed-lip': 'pursed_2_4',
  // extended_4_6
  'extended exhale 4 6': 'extended_4_6',
  'extended exhale 4-6': 'extended_4_6',
  // extended_4_8
  'extended exhale': 'extended_4_8',
  'extended exhale 4 8': 'extended_4_8',
  'extended exhale 4-8': 'extended_4_8',
  'extended': 'extended_4_8',
  // triangle_3_3_3
  'triangle': 'triangle_3_3_3',
  'triangle breathing': 'triangle_3_3_3',
  '3 3 3': 'triangle_3_3_3',
  // calm_4_4_6_2
  'calm': 'calm_4_4_6_2',
  'calm breathing': 'calm_4_4_6_2',
};

/// Resolves a voice query string to a preset ID.
///
/// Tries exact ID match first, then alias lookup, then substring match.
/// Returns null if no match found.
String? resolvePresetFromVoice(String query, List<WearPreset> presets) {
  final normalized = query.trim().toLowerCase();
  if (normalized.isEmpty) return null;

  // 1. Exact preset ID match.
  for (final preset in presets) {
    if (preset.id == normalized) return preset.id;
  }

  // 2. Exact alias lookup.
  final aliasMatch = presetAliases[normalized];
  if (aliasMatch != null) return aliasMatch;

  // 3. Substring: check if any alias is contained in the query.
  for (final entry in presetAliases.entries) {
    if (normalized.contains(entry.key)) return entry.value;
  }

  return null;
}
