import 'dart:async';

import 'package:flutter/material.dart';
import 'package:quick_actions/quick_actions.dart';

import 'app_strings.dart';
import 'controller.dart';
import 'deep_link_service.dart';
import 'models.dart';
import 'screens.dart';
import 'theme.dart';

const List<ShortcutItem> _breatheShortcutItems = <ShortcutItem>[
  ShortcutItem(type: 'box_4_4_4_4', localizedTitle: 'Box Breathing'),
  ShortcutItem(type: 'coherent_5_5', localizedTitle: 'Coherent (5-5)'),
  ShortcutItem(type: 'relax_4_7_8', localizedTitle: 'Relax (4-7-8)'),
];

class BreatheApp extends StatefulWidget {
  const BreatheApp({super.key, required this.controller});

  final BreathingController controller;

  @override
  State<BreatheApp> createState() => _BreatheAppState();
}

class _BreatheAppState extends State<BreatheApp> {
  BreathingController get _controller => widget.controller;
  late bool _darkMode;
  late AppLanguage _language;
  final DeepLinkService _deepLinkService = DeepLinkService();
  StreamSubscription<DeepLinkIntent>? _deepLinkSub;
  final QuickActions _quickActions = const QuickActions();
  bool _quickActionsInitialized = false;
  String? _pendingQuickActionType;

  @override
  void initState() {
    super.initState();
    _darkMode = _controller.darkModeEnabled;
    _language = _controller.language;
    _controller.addListener(_handleControllerChange);

    // Controller is already initialized — set up deep links immediately if ready.
    if (_controller.isReady) {
      _deepLinkService.initialize(_controller.presets);
      _deepLinkSub = _deepLinkService.intents.listen(_handleDeepLinkIntent);
    }

    _initializeQuickActions();
  }

  void _initializeQuickActions() {
    if (_quickActionsInitialized) return;
    _quickActionsInitialized = true;
    _quickActions.initialize(_handleQuickActionType);
    _quickActions.setShortcutItems(_breatheShortcutItems);
  }

  void _handleQuickActionType(String type) {
    if (!_controller.isReady) {
      _pendingQuickActionType = type;
      return;
    }
    _startPresetById(type);
  }

  void _startPresetById(String presetId) {
    _controller.applyPreset(presetId);
    if (!_controller.isRunning) {
      _controller.startOrResetSession();
    }
  }

  void _handleControllerChange() {
    // Initialize deep links once the controller is ready.
    if (_controller.isReady && _deepLinkSub == null) {
      _deepLinkService.initialize(_controller.presets);
      _deepLinkSub = _deepLinkService.intents.listen(_handleDeepLinkIntent);
    }

    if (_controller.isReady && _pendingQuickActionType != null) {
      final pending = _pendingQuickActionType!;
      _pendingQuickActionType = null;
      _startPresetById(pending);
    }

    if (_darkMode == _controller.darkModeEnabled &&
        _language == _controller.language) {
      return;
    }

    setState(() {
      _darkMode = _controller.darkModeEnabled;
      _language = _controller.language;
    });
  }

  void _handleDeepLinkIntent(DeepLinkIntent intent) {
    _controller.applyPreset(intent.presetId);
    if (intent.autoStart && !_controller.isRunning) {
      _controller.startOrResetSession();
    }
  }

  @override
  void dispose() {
    _deepLinkSub?.cancel();
    _deepLinkService.dispose();
    _controller.removeListener(_handleControllerChange);
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
  static const double _iosBottomNavigationInset = 14;
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
          bottomNavigationBar: _buildBottomNavigationBar(context, strings),
        );
      },
    );
  }

  Widget _buildBottomNavigationBar(BuildContext context, AppStrings strings) {
    final isIos = Theme.of(context).platform == TargetPlatform.iOS;
    if (isIos) {
      return _buildIosBottomNavigationBar(context, strings);
    }

    return NavigationBar(
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
    );
  }

  Widget _buildIosBottomNavigationBar(BuildContext context, AppStrings strings) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final navigationBarTheme = theme.navigationBarTheme;
    final mediaQuery = MediaQuery.of(context);
    final bottomInset = mediaQuery.padding.bottom;
    final effectiveBottomInset =
        bottomInset <= _iosBottomNavigationInset
            ? bottomInset
            : _iosBottomNavigationInset;
    final items = <({IconData icon, IconData selectedIcon, String label})>[
      (
        icon: Icons.home_outlined,
        selectedIcon: Icons.home_rounded,
        label: strings.homeTab,
      ),
      (
        icon: Icons.spa_outlined,
        selectedIcon: Icons.spa_rounded,
        label: strings.presetsTab,
      ),
      (
        icon: Icons.tune_outlined,
        selectedIcon: Icons.tune_rounded,
        label: strings.preferencesTab,
      ),
      (
        icon: Icons.language_outlined,
        selectedIcon: Icons.language_rounded,
        label: strings.languageTab,
      ),
    ];

    return Material(
      color: navigationBarTheme.backgroundColor ?? colorScheme.surface,
      elevation: navigationBarTheme.elevation ?? 3,
      shadowColor: navigationBarTheme.shadowColor,
      surfaceTintColor: navigationBarTheme.surfaceTintColor,
      child: Padding(
        padding: EdgeInsets.fromLTRB(10, 6, 10, effectiveBottomInset + 8),
        child: Row(
            children: [
              for (var index = 0; index < items.length; index++)
                Expanded(
                  child: _IosBottomNavigationItem(
                    icon: items[index].icon,
                    selectedIcon: items[index].selectedIcon,
                    label: items[index].label,
                    selected: index == _index,
                    indicatorColor:
                        navigationBarTheme.indicatorColor ??
                        colorScheme.primary.withValues(alpha: 0.16),
                    selectedColor: colorScheme.onSurface,
                    unselectedColor: colorScheme.onSurfaceVariant,
                    onTap: () {
                      setState(() {
                        _index = index;
                      });
                    },
                  ),
                ),
            ],
          ),
        ),
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

class _IosBottomNavigationItem extends StatelessWidget {
  const _IosBottomNavigationItem({
    required this.icon,
    required this.selectedIcon,
    required this.label,
    required this.selected,
    required this.indicatorColor,
    required this.selectedColor,
    required this.unselectedColor,
    required this.onTap,
  });

  final IconData icon;
  final IconData selectedIcon;
  final String label;
  final bool selected;
  final Color indicatorColor;
  final Color selectedColor;
  final Color unselectedColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final labelStyle = theme.textTheme.labelSmall?.copyWith(
      fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
      color: selected ? selectedColor : unselectedColor,
    );

    return Semantics(
      container: true,
      selected: selected,
      button: true,
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                curve: Curves.easeOutCubic,
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
                decoration: BoxDecoration(
                  color: selected ? indicatorColor : Colors.transparent,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(
                  selected ? selectedIcon : icon,
                  size: 24,
                  color: selected ? selectedColor : unselectedColor,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: labelStyle,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
