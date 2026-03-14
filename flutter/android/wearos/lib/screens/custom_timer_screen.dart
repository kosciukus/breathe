import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../engine.dart';
import '../presets.dart';
import 'session_screen.dart';

class CustomTimerScreen extends StatefulWidget {
  const CustomTimerScreen({super.key, required this.initialPreset});

  final WearPreset initialPreset;

  @override
  State<CustomTimerScreen> createState() => _CustomTimerScreenState();
}

class _CustomTimerScreenState extends State<CustomTimerScreen> {
  late int _inhale;
  late int _holdIn;
  late int _exhale;
  late int _holdOut;
  late int _minutes;

  @override
  void initState() {
    super.initState();
    _inhale  = widget.initialPreset.inhale;
    _holdIn  = widget.initialPreset.holdIn;
    _exhale  = widget.initialPreset.exhale;
    _holdOut = widget.initialPreset.holdOut;
    _minutes = widget.initialPreset.minutes;
  }

  @override
  Widget build(BuildContext context) {
    final engine = context.read<BreathingEngine>();

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
          child: Column(
            children: [
              const SizedBox(height: 4),
              const Text(
                'Custom',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              _PhaseRow(label: 'Inhale',  value: _inhale,  min: 1, max: 20, onChanged: (v) => setState(() => _inhale  = v)),
              _PhaseRow(label: 'Hold',    value: _holdIn,  min: 0, max: 20, onChanged: (v) => setState(() => _holdIn  = v)),
              _PhaseRow(label: 'Exhale',  value: _exhale,  min: 1, max: 20, onChanged: (v) => setState(() => _exhale  = v)),
              _PhaseRow(label: 'Hold',    value: _holdOut, min: 0, max: 20, onChanged: (v) => setState(() => _holdOut = v)),
              _PhaseRow(label: 'Minutes', value: _minutes, min: 1, max: 30, onChanged: (v) => setState(() => _minutes = v)),
              const SizedBox(height: 8),
              GestureDetector(
                onTap: () {
                  final preset = WearPreset(
                    id: 'custom',
                    label: 'Custom $_inhale-$_holdIn-$_exhale-$_holdOut',
                    inhale: _inhale,
                    holdIn: _holdIn,
                    exhale: _exhale,
                    holdOut: _holdOut,
                    minutes: _minutes,
                  );
                  engine.selectPreset(preset);
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ChangeNotifierProvider.value(
                        value: engine,
                        child: const SessionScreen(),
                      ),
                    ),
                  );
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    'Start',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PhaseRow extends StatelessWidget {
  const _PhaseRow({
    required this.label,
    required this.value,
    required this.min,
    required this.max,
    required this.onChanged,
  });

  final String label;
  final int value;
  final int min;
  final int max;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.7),
                fontSize: 12,
              ),
            ),
          ),
          _StepButton(
            icon: Icons.remove,
            onTap: value > min ? () => onChanged(value - 1) : null,
          ),
          SizedBox(
            width: 28,
            child: Text(
              '$value',
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          _StepButton(
            icon: Icons.add,
            onTap: value < max ? () => onChanged(value + 1) : null,
          ),
        ],
      ),
    );
  }
}

class _StepButton extends StatelessWidget {
  const _StepButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final enabled = onTap != null;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 28,
        height: 28,
        decoration: BoxDecoration(
          color: enabled
              ? Colors.white.withValues(alpha: 0.12)
              : Colors.transparent,
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          size: 14,
          color: enabled
              ? Colors.white
              : Colors.white.withValues(alpha: 0.2),
        ),
      ),
    );
  }
}
