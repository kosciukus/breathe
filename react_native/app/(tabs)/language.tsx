import { useEffect } from "react";
import { useRouter } from "expo-router";

import { useBreathing } from "@/features/breathing";

export default function LanguageTab() {
  const router = useRouter();
  const { setLanguageOpen, setPresetsOpen, setPreferencesOpen } =
    useBreathing();

  useEffect(() => {
    setLanguageOpen(true);
    setPresetsOpen(false);
    setPreferencesOpen(false);
    router.replace("/");
  }, [router, setLanguageOpen, setPresetsOpen, setPreferencesOpen]);

  return null;
}
