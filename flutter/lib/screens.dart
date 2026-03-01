import 'package:flutter/material.dart';

import 'app_strings.dart';
import 'controller.dart';
import 'models.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({
    super.key,
    required this.controller,
  });

  final BreathingController controller;

  @override
  Widget build(BuildContext context) {
    final strings = AppStrings(controller.language);
    final theme = Theme.of(context);
    final selectedPreset = controller.selectedPreset;
    final favoritePresets = controller.favoritePresets;
    final isFavorite = selectedPreset != null && controller.isFavorite(selectedPreset.id);

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: theme.brightness == Brightness.dark
              ? <Color>[
                  const Color(0xFF0C1417),
                  const Color(0xFF10242A),
                  const Color(0xFF173940),
                ]
              : <Color>[
                  const Color(0xFFF7F3EA),
                  const Color(0xFFEDE8DC),
                  const Color(0xFFD8E8E1),
                ],
        ),
      ),
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
        children: <Widget>[
          _ScreenHeader(
            title: strings.appTitle,
            subtitle: strings.appSubtitle,
          ),
          const SizedBox(height: 12),
          if (favoritePresets.isNotEmpty) ...<Widget>[
            Text(
              strings.favoriteSectionTitle,
              style: theme.textTheme.titleMedium,
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 40,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: favoritePresets.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final preset = favoritePresets[index];
                  return ChoiceChip(
                    label: Text(strings.presetLabelFor(preset.id, preset.label)),
                    selected: selectedPreset?.id == preset.id,
                    onSelected: (_) {
                      controller.applyPreset(preset.id);
                    },
                  );
                },
              ),
            ),
            const SizedBox(height: 20),
          ],
          _SectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          SizedBox(
                            height: 32,
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: FittedBox(
                                fit: BoxFit.scaleDown,
                                alignment: Alignment.centerLeft,
                                child: Text(
                                  selectedPreset != null
                                      ? strings.presetLabelFor(
                                          selectedPreset.id,
                                          selectedPreset.label,
                                        )
                                      : '${strings.customPresetLabel} ${controller.draft.sequence}',
                                  maxLines: 1,
                                  softWrap: false,
                                  style: theme.textTheme.titleLarge,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        IconButton(
                          tooltip: strings.favoriteAction,
                          onPressed: () {
                            controller.toggleFavoriteForCurrent();
                          },
                          icon: Icon(
                            isFavorite ? Icons.favorite : Icons.favorite_border,
                            color: isFavorite
                                ? theme.colorScheme.secondary
                                : theme.colorScheme.primary,
                          ),
                        ),
                        IconButton(
                          tooltip: selectedPreset != null
                              ? strings.removePresetAction
                              : strings.savePresetAction,
                          onPressed: () async {
                            final messenger = ScaffoldMessenger.maybeOf(context);
                            final changed = selectedPreset != null
                                ? await controller.removeSelectedPreset()
                                : await controller.saveCurrentPreset();
                            if (!context.mounted || !changed) return;
                            messenger?.hideCurrentSnackBar();
                            messenger?.showSnackBar(
                              SnackBar(
                                content: Text(
                                  selectedPreset != null
                                      ? strings.presetRemoved
                                      : strings.presetSaved,
                                ),
                              ),
                            );
                          },
                          icon: Icon(
                            selectedPreset != null
                                ? Icons.delete_outline
                                : Icons.save_outlined,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  controller.isPreparing
                      ? strings.startingInLabel
                      : strings.remainingLabel,
                  style: theme.textTheme.labelLarge,
                ),
                const SizedBox(height: 8),
                Text(
                  controller.isPreparing
                      ? '${controller.preStartRemainingSeconds ?? 0}'
                      : strings.timerText(controller.sessionRemainingMs),
                  style: theme.textTheme.displaySmall,
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: <Widget>[
                    Text(
                      strings.stateLabel,
                      style: theme.textTheme.bodyMedium,
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        controller.isPreparing
                            ? strings.getReadyLabel
                            : strings.phaseLabel(controller.phase),
                        style: theme.textTheme.labelLarge?.copyWith(
                          color: theme.colorScheme.primary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ClipRRect(
                  borderRadius: BorderRadius.circular(999),
                  child: LinearProgressIndicator(
                    value: controller.isPreparing ? 0 : controller.progress,
                    minHeight: 10,
                  ),
                ),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: controller.totalActiveSeconds <= 0
                        ? null
                        : () {
                            controller.startOrResetSession();
                          },
                    child: Text(
                      controller.isRunning
                          ? strings.resetAction
                          : strings.startAction,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          _SectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                _DurationSlider(
                  label: strings.repeatForLabel,
                  value: controller.repeatMinutes.toDouble(),
                  min: 0,
                  max: 30,
                  suffix: strings.minuteShort,
                  onChanged: controller.setRepeatMinutes,
                ),
                _DurationSlider(
                  label: strings.inhaleLabel,
                  value: controller.draft.inhale.toDouble(),
                  min: 0,
                  max: 20,
                  suffix: strings.secondShort,
                  onChanged: (value) {
                    controller.setPhaseDuration(BreathingPhase.inhale, value);
                  },
                ),
                _DurationSlider(
                  label: strings.holdInLabel,
                  value: controller.draft.holdIn.toDouble(),
                  min: 0,
                  max: 20,
                  suffix: strings.secondShort,
                  onChanged: (value) {
                    controller.setPhaseDuration(BreathingPhase.holdIn, value);
                  },
                ),
                _DurationSlider(
                  label: strings.exhaleLabel,
                  value: controller.draft.exhale.toDouble(),
                  min: 0,
                  max: 20,
                  suffix: strings.secondShort,
                  onChanged: (value) {
                    controller.setPhaseDuration(BreathingPhase.exhale, value);
                  },
                ),
                _DurationSlider(
                  label: strings.holdOutLabel,
                  value: controller.draft.holdOut.toDouble(),
                  min: 0,
                  max: 20,
                  suffix: strings.secondShort,
                  bottomPadding: 0,
                  onChanged: (value) {
                    controller.setPhaseDuration(BreathingPhase.holdOut, value);
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class PresetsScreen extends StatelessWidget {
  const PresetsScreen({
    super.key,
    required this.controller,
  });

  final BreathingController controller;

  @override
  Widget build(BuildContext context) {
    final strings = AppStrings(controller.language);
    final theme = Theme.of(context);
    final selectedPreset = controller.selectedPreset;
    final otherPresets = controller.presets
        .where((preset) => !controller.isFavorite(preset.id))
        .toList();

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
      children: <Widget>[
        _ScreenHeader(
          title: strings.presetsTab,
          subtitle: 'Built-in patterns plus the rhythms you save yourself.',
        ),
        if (controller.favoritePresets.isNotEmpty) ...<Widget>[
          const SizedBox(height: 20),
          Text(
            strings.favoriteSectionTitle,
            style: theme.textTheme.titleMedium,
          ),
          const SizedBox(height: 10),
          _PresetWrap(
            controller: controller,
            strings: strings,
            presets: controller.favoritePresets,
          ),
        ],
        const SizedBox(height: 20),
        Text(
          strings.presetsTab,
          style: theme.textTheme.titleMedium,
        ),
        const SizedBox(height: 10),
        _PresetWrap(
          controller: controller,
          strings: strings,
          presets: otherPresets,
        ),
        if (selectedPreset != null && !selectedPreset.isCustom) ...<Widget>[
          const SizedBox(height: 24),
          Text(
            strings.aboutPresetTitle,
            style: theme.textTheme.titleMedium,
          ),
          const SizedBox(height: 10),
          _SectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  strings.presetLabelFor(
                    selectedPreset.id,
                    selectedPreset.label,
                  ),
                  style: theme.textTheme.titleLarge,
                ),
                const SizedBox(height: 8),
                _GuideLine(
                  title: strings.sequenceLabel,
                  body: selectedPreset.durations.sequence,
                ),
                _GuideLine(
                  title: strings.bestForLabel,
                  body: strings.presetBestFor(
                    selectedPreset.id,
                    selectedPreset.bestFor,
                  ),
                ),
                _GuideLine(
                  title: strings.tipLabel,
                  body: strings.presetTip(
                    selectedPreset.id,
                    selectedPreset.tip,
                  ),
                ),
                _GuideLine(
                  title: strings.routeLabel,
                  body: strings.routeInstruction(selectedPreset.route),
                ),
                _GuideLine(
                  title: strings.cautionLabel,
                  body: strings.presetCaution(
                    selectedPreset.id,
                    selectedPreset.caution,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  strings.presetAbout(
                    selectedPreset.id,
                    selectedPreset.about,
                  ),
                  style: theme.textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}

class PreferencesScreen extends StatelessWidget {
  const PreferencesScreen({
    super.key,
    required this.controller,
  });

  final BreathingController controller;

  @override
  Widget build(BuildContext context) {
    final strings = AppStrings(controller.language);
    final theme = Theme.of(context);

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
      children: <Widget>[
        _ScreenHeader(
          title: strings.preferencesTab,
          subtitle: 'Tune cues, theme, and saved app state.',
        ),
        const SizedBox(height: 20),
        _SectionCard(
          child: Column(
            children: <Widget>[
              SwitchListTile.adaptive(
                contentPadding: EdgeInsets.zero,
                title: Text(strings.phaseSoundLabel),
                value: controller.soundEnabled,
                onChanged: (value) {
                  controller.setSoundEnabled(value);
                },
              ),
              const Divider(height: 20),
              SwitchListTile.adaptive(
                contentPadding: EdgeInsets.zero,
                title: Text(strings.vibrationLabel),
                value: controller.vibrationEnabled,
                onChanged: (value) {
                  controller.setVibrationEnabled(value);
                },
              ),
              const Divider(height: 20),
              SwitchListTile.adaptive(
                contentPadding: EdgeInsets.zero,
                title: Text(strings.darkModeLabel),
                value: controller.darkModeEnabled,
                onChanged: (value) {
                  controller.setDarkModeEnabled(value);
                },
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () async {
                    final confirmed = await showDialog<bool>(
                      context: context,
                      builder: (context) {
                        return AlertDialog(
                          title: Text(strings.resetDataTitle),
                          content: Text(strings.resetDataMessage),
                          actions: <Widget>[
                            TextButton(
                              onPressed: () {
                                Navigator.of(context).pop(false);
                              },
                              child: Text(strings.cancelAction),
                            ),
                            FilledButton(
                              onPressed: () {
                                Navigator.of(context).pop(true);
                              },
                              child: Text(strings.confirmAction),
                            ),
                          ],
                        );
                      },
                    );

                    if (confirmed != true || !context.mounted) return;
                    await controller.resetAppData();
                    if (!context.mounted) return;

                    final messenger = ScaffoldMessenger.maybeOf(context);
                    messenger?.hideCurrentSnackBar();
                    messenger?.showSnackBar(
                      SnackBar(content: Text(strings.appDataCleared)),
                    );
                  },
                  icon: Icon(
                    Icons.restart_alt_rounded,
                    color: theme.colorScheme.error,
                  ),
                  label: Text(
                    strings.resetDataAction,
                    style: TextStyle(color: theme.colorScheme.error),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class LanguageScreen extends StatelessWidget {
  const LanguageScreen({
    super.key,
    required this.controller,
  });

  final BreathingController controller;

  @override
  Widget build(BuildContext context) {
    final strings = AppStrings(controller.language);

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
      children: <Widget>[
        _ScreenHeader(
          title: strings.languageTab,
          subtitle: 'Pick the app language preference and keep it saved.',
        ),
        const SizedBox(height: 20),
        _SectionCard(
          child: Column(
            children: AppLanguage.values.map((language) {
              final selected = controller.language == language;
              return Column(
                children: <Widget>[
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    onTap: () {
                      controller.setLanguage(language);
                    },
                    title: Text(strings.languageName(language)),
                    subtitle: Text(
                      selected ? strings.currentLabel : language.code.toUpperCase(),
                    ),
                    trailing: selected
                        ? const Icon(Icons.check_circle_outline)
                        : null,
                  ),
                  if (language != AppLanguage.values.last)
                    const Divider(height: 4),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}

class _ScreenHeader extends StatelessWidget {
  const _ScreenHeader({
    required this.title,
    required this.subtitle,
  });

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          title,
          style: theme.textTheme.headlineSmall,
        ),
        const SizedBox(height: 6),
        Text(
          subtitle,
          style: theme.textTheme.bodyLarge?.copyWith(
            color: theme.textTheme.bodyLarge?.color?.withValues(alpha: 0.78),
          ),
        ),
      ],
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.child,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      decoration: BoxDecoration(
        color: theme.brightness == Brightness.dark
            ? const Color(0xFF172228)
            : Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: theme.brightness == Brightness.dark
              ? const Color(0xFF23333B)
              : const Color(0xFFE6DED1),
        ),
        boxShadow: theme.brightness == Brightness.dark
            ? null
            : <BoxShadow>[
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: child,
      ),
    );
  }
}

class _PresetWrap extends StatelessWidget {
  const _PresetWrap({
    required this.controller,
    required this.strings,
    required this.presets,
  });

  final BreathingController controller;
  final AppStrings strings;
  final List<BreathingPreset> presets;

  @override
  Widget build(BuildContext context) {
    final selectedId = controller.selectedPreset?.id;

    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: presets.map((preset) {
        return ChoiceChip(
          label: Text(strings.presetLabelFor(preset.id, preset.label)),
          selected: selectedId == preset.id,
          onSelected: (_) {
            controller.applyPreset(preset.id);
          },
        );
      }).toList(),
    );
  }
}

class _GuideLine extends StatelessWidget {
  const _GuideLine({
    required this.title,
    required this.body,
  });

  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: RichText(
        text: TextSpan(
          style: theme.textTheme.bodyMedium,
          children: <InlineSpan>[
            TextSpan(
              text: '$title ',
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            TextSpan(text: body),
          ],
        ),
      ),
    );
  }
}

class _DurationSlider extends StatelessWidget {
  const _DurationSlider({
    required this.label,
    required this.value,
    required this.min,
    required this.max,
    required this.suffix,
    required this.onChanged,
    this.bottomPadding = 14,
  });

  final String label;
  final double value;
  final double min;
  final double max;
  final String suffix;
  final ValueChanged<double> onChanged;
  final double bottomPadding;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.only(bottom: bottomPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Flexible(
                child: Text(
                  label,
                  style: theme.textTheme.titleSmall,
                ),
              ),
              Text(
                '${value.round()} $suffix',
                style: theme.textTheme.labelLarge?.copyWith(
                  color: theme.colorScheme.primary,
                ),
              ),
            ],
          ),
          Slider(
            value: value.clamp(min, max).toDouble(),
            min: min,
            max: max,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}
