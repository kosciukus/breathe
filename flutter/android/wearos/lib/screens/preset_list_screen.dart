import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../engine.dart';
import '../presets.dart';
import 'custom_timer_screen.dart';
import 'session_screen.dart';

class PresetListScreen extends StatelessWidget {
  const PresetListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final engine = context.watch<BreathingEngine>();

    return Scaffold(
      backgroundColor: Colors.black,
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 8),
        itemCount: builtInPresets.length + 1, // +1 for Custom tile
        itemBuilder: (context, i) {
          if (i == 0) {
            return _CustomTile(
              isSelected: engine.selectedPreset.id == 'custom',
              lastCustomPreset: engine.lastCustomPreset,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ChangeNotifierProvider.value(
                    value: engine,
                    child: CustomTimerScreen(initialPreset: engine.lastCustomPreset),
                  ),
                ),
              ),
            );
          }
          final preset = builtInPresets[i - 1];
          final isSelected = engine.selectedPreset.id == preset.id;
          return _PresetTile(
            preset: preset,
            isSelected: isSelected,
            onTap: () {
              engine.selectPreset(preset);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ChangeNotifierProvider.value(
                    value: engine,
                    child: const SessionScreen(),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class _PresetTile extends StatelessWidget {
  const _PresetTile({
    required this.preset,
    required this.isSelected,
    required this.onTap,
  });

  final WearPreset preset;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? Colors.blue.withValues(alpha: 0.25)
              : Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              preset.label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              '${preset.minutes} min · ${preset.sequence}',
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.5),
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CustomTile extends StatelessWidget {
  const _CustomTile({
    required this.isSelected,
    required this.lastCustomPreset,
    required this.onTap,
  });

  final bool isSelected;
  final WearPreset lastCustomPreset;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? Colors.purple.withValues(alpha: 0.25)
              : Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.1),
            width: 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Custom ${lastCustomPreset.sequence}',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              '${lastCustomPreset.minutes} min',
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.5),
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
