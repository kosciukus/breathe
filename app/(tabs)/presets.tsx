import { useEffect } from "react";
import { useRouter } from "expo-router";

import { useBreathing } from "@/features/breathing";

export default function PresetsTab() {
  const router = useRouter();
  const { setPresetsOpen, setPreferencesOpen, setLanguageOpen } = useBreathing();

  useEffect(() => {
    setPresetsOpen(true);
    setPreferencesOpen(false);
    setLanguageOpen(false);
    router.replace("/");
  }, [router, setLanguageOpen, setPreferencesOpen, setPresetsOpen]);

  return null;
}
