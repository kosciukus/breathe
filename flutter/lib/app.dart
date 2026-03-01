import 'package:flutter/material.dart';

import 'app_strings.dart';
import 'controller.dart';
import 'models.dart';
import 'screens.dart';
import 'theme.dart';

class BreatheApp extends StatefulWidget {
  const BreatheApp({super.key});

  @override
  State<BreatheApp> createState() => _BreatheAppState();
}

class _BreatheAppState extends State<BreatheApp> {
  late final BreathingController _controller;
  late bool _darkMode;
  late AppLanguage _language;

  @override
  void initState() {
    super.initState();
    _controller = BreathingController();
    _darkMode = _controller.darkModeEnabled;
    _language = _controller.language;
    _controller.addListener(_handleControllerChange);
    _controller.initialize();
  }

  void _handleControllerChange() {
    if (_darkMode == _controller.darkModeEnabled &&
        _language == _controller.language) {
      return;
    }

    setState(() {
      _darkMode = _controller.darkModeEnabled;
      _language = _controller.language;
    });
  }

  @override
  void dispose() {
    _controller.removeListener(_handleControllerChange);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final strings = AppStrings(_language);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: strings.appTitle,
      theme: buildBreatheTheme(darkMode: false),
      darkTheme: buildBreatheTheme(darkMode: true),
      themeMode: _darkMode ? ThemeMode.dark : ThemeMode.light,
      home: _HomeShell(controller: _controller),
    );
  }
}

class _HomeShell extends StatefulWidget {
  const _HomeShell({
    required this.controller,
  });

  final BreathingController controller;

  @override
  State<_HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<_HomeShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.controller,
      builder: (context, _) {
        final strings = AppStrings(widget.controller.language);

        return Scaffold(
          body: SafeArea(
            child: widget.controller.isReady
                ? _pageForIndex(_index)
                : const Center(child: CircularProgressIndicator()),
          ),
          bottomNavigationBar: NavigationBar(
            selectedIndex: _index,
            onDestinationSelected: (index) {
              setState(() {
                _index = index;
              });
            },
            destinations: <NavigationDestination>[
              NavigationDestination(
                icon: const Icon(Icons.home_outlined),
                selectedIcon: const Icon(Icons.home_rounded),
                label: strings.homeTab,
              ),
              NavigationDestination(
                icon: const Icon(Icons.spa_outlined),
                selectedIcon: const Icon(Icons.spa_rounded),
                label: strings.presetsTab,
              ),
              NavigationDestination(
                icon: const Icon(Icons.tune_outlined),
                selectedIcon: const Icon(Icons.tune_rounded),
                label: strings.preferencesTab,
              ),
              NavigationDestination(
                icon: const Icon(Icons.language_outlined),
                selectedIcon: const Icon(Icons.language_rounded),
                label: strings.languageTab,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _pageForIndex(int index) {
    switch (index) {
      case 0:
        return HomeScreen(controller: widget.controller);
      case 1:
        return PresetsScreen(controller: widget.controller);
      case 2:
        return PreferencesScreen(controller: widget.controller);
      case 3:
        return LanguageScreen(controller: widget.controller);
      default:
        return HomeScreen(controller: widget.controller);
    }
  }
}
