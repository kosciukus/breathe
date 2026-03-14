import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'engine.dart';
import 'screens/preset_list_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => BreathingEngine(),
      child: const BreatheWearApp(),
    ),
  );
}

class BreatheWearApp extends StatelessWidget {
  const BreatheWearApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Breathe',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: const ColorScheme.dark(
          primary: Colors.blue,
          surface: Colors.black,
        ),
        scaffoldBackgroundColor: Colors.black,
      ),
      home: const PresetListScreen(),
    );
  }
}
