import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      app: {
        eyebrow: "BREATHWORK",
        title: "Breathing Coach",
        subtitle: "Set a rhythm that feels calm and steady.",
      },
      phase: {
        inhale: "INHALE",
        hold: "HOLD",
        exhale: "EXHALE",
      },
      action: {
        start: "Start",
        pause: "Pause",
        reset: "Reset",
      },
      section: {
        presets: "Presets",
        preferences: "Preferences",
        settings: "Settings",
      },
      label: {
        phaseSound: "Phase sound",
        vibration: "Vibration",
        repeatFor: "Repeat for",
        inhale: "Inhale",
        hold1: "Pause after inhale",
        exhale: "Exhale",
        hold2: "Pause after exhale",
      },
      presets: {
        calm_4_6: "Calm 4-6",
        box_4_4_4_4: "Box 4-4-4-4",
        relax_4_7_8: "Relax 4-7-8",
        focus_5_5: "Focus 5-5",
      },
      unit: {
        minuteShort: "min",
        secondShort: "s",
      },
    },
  },
  es: {
    translation: {
      app: {
        eyebrow: "RESPIRACION",
        title: "Coach de respiracion",
        subtitle: "Define un ritmo que se sienta tranquilo y estable.",
      },
      phase: {
        inhale: "INHALA",
        hold: "RETEN",
        exhale: "EXHALA",
      },
      action: {
        start: "Iniciar",
        pause: "Pausar",
        reset: "Reiniciar",
      },
      section: {
        presets: "Preajustes",
        preferences: "Preferencias",
        settings: "Ajustes",
      },
      label: {
        phaseSound: "Sonido de fase",
        vibration: "Vibracion",
        repeatFor: "Repetir durante",
        inhale: "Inhala",
        hold1: "Pausa despues de inhalar",
        exhale: "Exhala",
        hold2: "Pausa despues de exhalar",
      },
      presets: {
        calm_4_6: "Calma 4-6",
        box_4_4_4_4: "Caja 4-4-4-4",
        relax_4_7_8: "Relajacion 4-7-8",
        focus_5_5: "Enfoque 5-5",
      },
      unit: {
        minuteShort: "min",
        secondShort: "s",
      },
    },
  },
  fr: {
    translation: {
      app: {
        eyebrow: "RESPIRATION",
        title: "Coach de respiration",
        subtitle: "Definissez un rythme calme et stable.",
      },
      phase: {
        inhale: "INSPIRER",
        hold: "RETENIR",
        exhale: "EXPIRER",
      },
      action: {
        start: "Demarrer",
        pause: "Pause",
        reset: "Reinitialiser",
      },
      section: {
        presets: "Presets",
        preferences: "Preferences",
        settings: "Parametres",
      },
      label: {
        phaseSound: "Son de phase",
        vibration: "Vibration",
        repeatFor: "Repeter pendant",
        inhale: "Inspirer",
        hold1: "Pause apres inspiration",
        exhale: "Expirer",
        hold2: "Pause apres expiration",
      },
      presets: {
        calm_4_6: "Calme 4-6",
        box_4_4_4_4: "Carre 4-4-4-4",
        relax_4_7_8: "Relax 4-7-8",
        focus_5_5: "Focus 5-5",
      },
      unit: {
        minuteShort: "min",
        secondShort: "s",
      },
    },
  },
  pl: {
    translation: {
      app: {
        eyebrow: "ODDECH",
        title: "Trener oddechu",
        subtitle: "Ustaw spokojny i rowny rytm.",
      },
      phase: {
        inhale: "WDECH",
        hold: "WSTRZYMAJ",
        exhale: "WYDECH",
      },
      action: {
        start: "Start",
        pause: "Pauza",
        reset: "Reset",
      },
      section: {
        presets: "Presety",
        preferences: "Preferencje",
        settings: "Ustawienia",
      },
      label: {
        phaseSound: "Dzwiek fazy",
        vibration: "Wibracje",
        repeatFor: "Powtarzaj przez",
        inhale: "Wdech",
        hold1: "Pauza po wdechu",
        exhale: "Wydech",
        hold2: "Pauza po wydechu",
      },
      presets: {
        calm_4_6: "Spokoj 4-6",
        box_4_4_4_4: "Kwadrat 4-4-4-4",
        relax_4_7_8: "Relaks 4-7-8",
        focus_5_5: "Skupienie 5-5",
      },
      unit: {
        minuteShort: "min",
        secondShort: "s",
      },
    },
  },
} as const;

const locale = Localization.locale || "en";
const language = locale.split("-")[0];
const supported = ["en", "es", "fr", "pl"];

i18n.use(initReactI18next).init({
  resources,
  lng: supported.includes(language) ? language : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
