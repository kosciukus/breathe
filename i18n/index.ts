import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
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
        savePreset: "Save preset",
        presetSaved: "Preset saved",
        presetRemoved: "Preset removed",
        resetData: "Reset app data",
        resetDataTitle: "Reset app data?",
        resetDataMessage: "This will remove saved presets, favorites, and language.",
        resetDataDone: "App data cleared",
        deletePresetTitle: "Delete preset?",
        deletePresetMessage: "Are you sure you want to delete {{name}}?",
        cancel: "Cancel",
        delete: "Delete",
      },
      section: {
        home: "Home",
        presets: "Presets",
        preferences: "Preferences",
        language: "Language",
        settings: "Settings",
        favorites: "Favorites",
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
        customPreset: "Custom",
      },
      presets: {
        box_4_4_4_4: "Box 4-4-4-4",
        relax_4_7_8: "Relax 4-7-8",
        coherent_5_5: "Coherent 5-5",
        resonant_6_6: "Resonant 6-6",
        equal_4_4: "Equal 4-4",
        pursed_2_4: "Pursed-lip 2-4",
        extended_4_6: "Extended exhale 4-6",
        extended_4_8: "Extended exhale 4-8",
        triangle_3_3_3: "Triangle 3-3-3",
        calm_4_4_6_2: "Calm 4-4-6-2",
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
        savePreset: "Guardar preajuste",
        presetSaved: "Preajuste guardado",
        presetRemoved: "Preajuste eliminado",
        resetData: "Restablecer datos",
        resetDataTitle: "¿Restablecer datos?",
        resetDataMessage: "Esto eliminará preajustes guardados, favoritos y el idioma.",
        resetDataDone: "Datos eliminados",
        deletePresetTitle: "¿Eliminar preajuste?",
        deletePresetMessage: "¿Seguro que deseas eliminar {{name}}?",
        cancel: "Cancelar",
        delete: "Eliminar",
      },
      section: {
        home: "Inicio",
        presets: "Preajustes",
        preferences: "Preferencias",
        language: "Idioma",
        settings: "Ajustes",
        favorites: "Favoritos",
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
        customPreset: "Personalizado",
      },
      presets: {
        box_4_4_4_4: "Caja 4-4-4-4",
        relax_4_7_8: "Relajación 4-7-8",
        coherent_5_5: "Coherente 5-5",
        resonant_6_6: "Resonante 6-6",
        equal_4_4: "Igual 4-4",
        pursed_2_4: "Labios fruncidos 2-4",
        extended_4_6: "Exhalación extendida 4-6",
        extended_4_8: "Exhalación extendida 4-8",
        triangle_3_3_3: "Triángulo 3-3-3",
        calm_4_4_6_2: "Calma 4-4-6-2",
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
        savePreset: "Enregistrer un préréglage",
        presetSaved: "Préréglage enregistré",
        presetRemoved: "Préréglage supprimé",
        resetData: "Réinitialiser les données",
        resetDataTitle: "Réinitialiser les données ?",
        resetDataMessage: "Cela supprimera les préréglages, favoris et la langue.",
        resetDataDone: "Données effacées",
        deletePresetTitle: "Supprimer le préréglage ?",
        deletePresetMessage: "Voulez-vous supprimer {{name}} ?",
        cancel: "Annuler",
        delete: "Supprimer",
      },
      section: {
        home: "Accueil",
        presets: "Préréglages",
        preferences: "Préférences",
        language: "Langue",
        settings: "Paramètres",
        favorites: "Favoris",
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
        customPreset: "Personnalisé",
      },
      presets: {
        box_4_4_4_4: "Carré 4-4-4-4",
        relax_4_7_8: "Relaxation 4-7-8",
        coherent_5_5: "Cohérente 5-5",
        resonant_6_6: "Résonante 6-6",
        equal_4_4: "Égale 4-4",
        pursed_2_4: "Lèvres pincées 2-4",
        extended_4_6: "Expiration prolongée 4-6",
        extended_4_8: "Expiration prolongée 4-8",
        triangle_3_3_3: "Triangle 3-3-3",
        calm_4_4_6_2: "Calme 4-4-6-2",
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
        savePreset: "Zapisz preset",
        presetSaved: "Preset zapisany",
        presetRemoved: "Preset usunięty",
        resetData: "Wyczyść dane",
        resetDataTitle: "Wyczyścić dane?",
        resetDataMessage: "To usunie presety, ulubione i język.",
        resetDataDone: "Dane usunięte",
        deletePresetTitle: "Usunąć preset?",
        deletePresetMessage: "Czy na pewno usunąć {{name}}?",
        cancel: "Anuluj",
        delete: "Usuń",
      },
      section: {
        home: "Start",
        presets: "Presety",
        preferences: "Preferencje",
        language: "Język",
        settings: "Ustawienia",
        favorites: "Ulubione",
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
        customPreset: "Własny",
      },
      presets: {
        box_4_4_4_4: "Kwadrat 4-4-4-4",
        relax_4_7_8: "Relaks 4-7-8",
        coherent_5_5: "Spójny 5-5",
        resonant_6_6: "Rezonans 6-6",
        equal_4_4: "Równy 4-4",
        pursed_2_4: "Usta zaciśnięte 2-4",
        extended_4_6: "Wydłużony wydech 4-6",
        extended_4_8: "Wydłużony wydech 4-8",
        triangle_3_3_3: "Trójkąt 3-3-3",
        calm_4_4_6_2: "Spokój 4-4-6-2",
      },
      unit: {
        minuteShort: "min",
        secondShort: "s",
      },
    },
  },
} as const;

const locale = Localization.getLocales()[0]?.languageTag ?? "en";
const language = locale.split("-")[0];

export type AppLanguage = keyof typeof resources;
const supported: AppLanguage[] = ["en", "es", "fr", "pl"];
const isSupportedLanguage = (value: string): value is AppLanguage =>
  supported.includes(value as AppLanguage);
const LANGUAGE_KEY = "breathe.language";
export const languageOptions = (Object.keys(resources) as AppLanguage[]).map((code) => ({
  code,
  label: resources[code].translation.language.name,
}));

i18n.use(initReactI18next).init({
  resources,
  lng: isSupportedLanguage(language) ? language : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

const loadSavedLanguage = async () => {
  try {
    const saved = await SecureStore.getItemAsync(LANGUAGE_KEY);
    if (saved && supported.includes(saved as AppLanguage) && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  } catch {
    // Ignore storage errors and fall back to device locale.
  }
};

loadSavedLanguage();

export const persistLanguage = async (code: AppLanguage) => {
  try {
    await SecureStore.setItemAsync(LANGUAGE_KEY, code);
  } catch {
    // Ignore storage errors; language will still update in memory.
  }
};

export default i18n;
