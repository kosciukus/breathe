import { useEffect } from "react";
import { useRouter } from "expo-router";

import { useBreathing } from "@/features/breathing";

export default function PreferencesTab() {
  const router = useRouter();
  const { setPreferencesOpen, setPresetsOpen, setLanguageOpen } = useBreathing();

  useEffect(() => {
    setPreferencesOpen(true);
    setPresetsOpen(false);
    setLanguageOpen(false);
    router.replace("/");
  }, [router, setLanguageOpen, setPreferencesOpen, setPresetsOpen]);

  return null;
}
