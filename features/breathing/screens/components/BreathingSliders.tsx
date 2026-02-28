import React from "react";
import { Animated, View } from "react-native";
import { useTranslation } from "react-i18next";

import DurationSliderRow from "../../components/DurationSliderRow";
import { DurationsSec, SliderItem } from "../../lib/types";
import { useBreathingTheme } from "../../hooks/useBreathingTheme";

type BreathingSlidersProps = {
  rowAnims: Animated.Value[];
  sliderItems: SliderItem[];
  draft: DurationsSec;
  repeatMinutes: number;
  onSliderDragStart: () => void;
  onSliderDragEnd: () => void;
  onSetRepeatMinutes: (minutes: number) => void;
  onSetDraftField: (key: keyof DurationsSec, value: number) => void;
};

export default function BreathingSliders({
  rowAnims,
  sliderItems,
  draft,
  repeatMinutes,
  onSliderDragStart,
  onSliderDragEnd,
  onSetRepeatMinutes,
  onSetDraftField,
}: BreathingSlidersProps) {
  const { t } = useTranslation();
  const { styles } = useBreathingTheme();

  return (
    <View style={[styles.presetSection, styles.homeControls]}>
      <Animated.View
        style={{
          opacity: rowAnims[0],
          transform: [
            {
              translateY: rowAnims[0].interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        }}
      >
        <DurationSliderRow
          label={t("label.repeatFor")}
          value={repeatMinutes}
          onChange={onSetRepeatMinutes}
          onInteractionStart={onSliderDragStart}
          onInteractionEnd={onSliderDragEnd}
          onSlidingStart={onSliderDragStart}
          onSlidingComplete={onSliderDragEnd}
          min={0}
          max={30}
          unitLabel={` ${t("unit.minuteShort")}`}
        />
      </Animated.View>

      {sliderItems.map((item, index) => (
        <Animated.View
          key={item.key}
          style={{
            opacity: rowAnims[index + 1],
            transform: [
              {
                translateY: rowAnims[index + 1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          }}
        >
          <DurationSliderRow
            label={t(item.labelKey)}
            value={draft[item.key]}
            onChange={(value) => onSetDraftField(item.key, value)}
            onInteractionStart={onSliderDragStart}
            onInteractionEnd={onSliderDragEnd}
            onSlidingStart={onSliderDragStart}
            onSlidingComplete={onSliderDragEnd}
            min={item.min}
            max={item.max}
            unitLabel={` ${t("unit.secondShort")}`}
          />
        </Animated.View>
      ))}
    </View>
  );
}
