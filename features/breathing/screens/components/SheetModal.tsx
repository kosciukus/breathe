import React, { PropsWithChildren } from "react";
import { Modal, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useBreathingTheme } from "../../hooks/useBreathingTheme";

type SheetModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export default function SheetModal({
  visible,
  onClose,
  children,
}: SheetModalProps) {
  const { styles } = useBreathingTheme();

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <Pressable style={styles.sheetBackdrop} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <SafeAreaView style={styles.sheetContent} edges={["bottom"]}>
            {children}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
