import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
  en: {
    translation: {
      app: {
        eyebrow: "BREATHWORK",
        title: "Mindful Breathe",
        subtitle: "Set a rhythm that feels calm and steady.",
      },
      language: {
        title: "Language",
        subtitle: "Choose the language of the app.",
        name: "English",
        current: "Current",
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
        home: "Home",
        presets: "Presets",
        preferences: "Preferences",
        language: "Language",
        settings: "Settings",
      },
      label: {
        remaining: "Remaining",
        state: "State:",
        phaseSound: "Phase sound",
        vibration: "Vibration",
        repeatFor: "Duration",
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
        eyebrow: "RESPIRACIÓN",
        title: "Respiración consciente",
        subtitle: "Define un ritmo que se sienta tranquilo y estable.",
      },
      language: {
        title: "Idioma",
        subtitle: "Elige el idioma de la aplicación.",
        name: "Español",
        current: "Actual",
      },
      phase: {
        inhale: "INHALA",
        hold: "RETÉN",
        exhale: "EXHALA",
      },
      action: {
        start: "Iniciar",
        pause: "Pausar",
        reset: "Reiniciar",
      },
      section: {
        home: "Inicio",
        presets: "Preajustes",
        preferences: "Preferencias",
        language: "Idioma",
        settings: "Ajustes",
      },
      label: {
        remaining: "Restante",
        state: "Estado:",
        phaseSound: "Sonido de fase",
        vibration: "Vibración",
        repeatFor: "Duración",
        inhale: "Inhala",
        hold1: "Pausa después de inhalar",
        exhale: "Exhala",
        hold2: "Pausa después de exhalar",
      },
      presets: {
        calm_4_6: "Calma 4-6",
        box_4_4_4_4: "Caja 4-4-4-4",
        relax_4_7_8: "Relajación 4-7-8",
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
        title: "Respiration consciente",
        subtitle: "Définissez un rythme calme et régulier.",
      },
      language: {
        title: "Langue",
        subtitle: "Choisissez la langue de l’application.",
        name: "Français",
        current: "Actuelle",
      },
      phase: {
        inhale: "INSPIRER",
        hold: "RETENIR",
        exhale: "EXPIRER",
      },
      action: {
        start: "Démarrer",
        pause: "Pause",
        reset: "Réinitialiser",
      },
      section: {
        home: "Accueil",
        presets: "Préréglages",
        preferences: "Préférences",
        language: "Langue",
        settings: "Paramètres",
      },
      label: {
        remaining: "Restant",
        state: "État:",
        phaseSound: "Son de phase",
        vibration: "Vibration",
        repeatFor: "Durée",
        inhale: "Inspiration",
        hold1: "Pause après l'inspiration",
        exhale: "Expiration",
        hold2: "Pause après l'expiration",
      },
      presets: {
        calm_4_6: "Calme 4-6",
        box_4_4_4_4: "Carré 4-4-4-4",
        relax_4_7_8: "Relaxation 4-7-8",
        focus_5_5: "Concentration 5-5",
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
        title: "Świadomy oddech",
        subtitle: "Ustaw spokojny i równy rytm.",
      },
      language: {
        title: "Język",
        subtitle: "Wybierz język aplikacji.",
        name: "Polski",
        current: "Bieżący",
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
        home: "Start",
        presets: "Presety",
        preferences: "Preferencje",
        language: "Język",
        settings: "Ustawienia",
      },
      label: {
        remaining: "Pozostało",
        state: "Stan:",
        phaseSound: "Dźwięk fazy",
        vibration: "Wibracje",
        repeatFor: "Czas trwania",
        inhale: "Wdech",
        hold1: "Pauza po wdechu",
        exhale: "Wydech",
        hold2: "Pauza po wydechu",
      },
      presets: {
        calm_4_6: "Spokój 4-6",
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

export type AppLanguage = keyof typeof resources;
export const languageOptions = (Object.keys(resources) as AppLanguage[]).map((code) => ({
  code,
  label: resources[code].translation.language.name,
}));

i18n.use(initReactI18next).init({
  resources,
  lng: supported.includes(language) ? language : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
