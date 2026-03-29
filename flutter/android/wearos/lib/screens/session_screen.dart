import 'dart:math';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../engine.dart';
import '../presets.dart';

class SessionScreen extends StatelessWidget {
  const SessionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final engine = context.watch<BreathingEngine>();

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: engine.countdownSeconds != null
            ? _CountdownView(seconds: engine.countdownSeconds!)
            : engine.isRunning
                ? _ActiveView(engine: engine)
                : _ReadyView(engine: engine),
      ),
    );
  }
}

// ── Ready (tap to start) ──────────────────────────────────────────────────────

class _ReadyView extends StatelessWidget {
  const _ReadyView({required this.engine});
  final BreathingEngine engine;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            engine.selectedPreset.label,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${engine.selectedPreset.minutes} min',
            style: TextStyle(color: Colors.white.withValues(alpha: 0.4), fontSize: 11),
          ),
          const SizedBox(height: 16),
          GestureDetector(
            onTap: engine.start,
            child: Container(
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
    );
  }
}

// ── Pre-start countdown ───────────────────────────────────────────────────────

class _CountdownView extends StatelessWidget {
  const _CountdownView({required this.seconds});
  final int seconds;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'Get ready',
            style: TextStyle(color: Colors.white.withValues(alpha: 0.5), fontSize: 12),
          ),
          const SizedBox(height: 8),
          Text(
            '$seconds',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 52,
              fontWeight: FontWeight.w100,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Active session ────────────────────────────────────────────────────────────

class _ActiveView extends StatelessWidget {
  const _ActiveView({required this.engine});
  final BreathingEngine engine;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Progress ring
          SizedBox(
            width: 120,
            height: 120,
            child: CustomPaint(
              painter: _RingPainter(
                progress: engine.phaseProgress,
                color: _phaseColor(engine.phase),
              ),
              child: Center(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        engine.phase.label,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${engine.phaseRemainingSeconds.ceil()}s',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.55),
                          fontSize: 12,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          // Session time remaining
          if (engine.sessionRemainingSeconds > 0)
            Text(
              _formatTime(engine.sessionRemainingSeconds),
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.35),
                fontSize: 11,
              ),
            ),
          const SizedBox(height: 8),
          // Stop button
          GestureDetector(
            onTap: () {
              engine.stop();
              Navigator.pop(context);
            },
            child: Text(
              'Stop',
              style: TextStyle(color: Colors.red.withValues(alpha: 0.7), fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  Color _phaseColor(BreathPhase phase) => switch (phase) {
        BreathPhase.inhale => Colors.blue,
        BreathPhase.holdIn => const Color(0xFF33CCEE),
        BreathPhase.exhale => Colors.teal,
        BreathPhase.holdOut => Colors.green,
      };

  String _formatTime(int seconds) =>
      '${seconds ~/ 60}:${(seconds % 60).toString().padLeft(2, '0')}';
}

// ── Ring painter ──────────────────────────────────────────────────────────────

class _RingPainter extends CustomPainter {
  const _RingPainter({required this.progress, required this.color});
  final double progress;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 6;
    final strokeWidth = 5.0;

    // Background ring
    canvas.drawCircle(
      center,
      radius,
      Paint()
        ..color = Colors.white.withValues(alpha: 0.12)
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth,
    );

    // Progress arc
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      2 * pi * progress,
      false,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round,
    );
  }

  @override
  bool shouldRepaint(_RingPainter old) =>
      old.progress != progress || old.color != color;
}
