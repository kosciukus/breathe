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
        resetDataMessage:
          "This will remove saved presets, favorites, and language.",
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
        aboutPreset: "About this preset",
      },
      label: {
        remaining: "Remaining",
        state: "State:",
        phaseSound: "Phase sound",
        vibration: "Vibration",
        darkMode: "Dark mode",
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
      presetGuide: {
        sequenceLabel: "Pattern:",
        bestForLabel: "Best for:",
        tipLabel: "Tip:",
        cautionLabel: "Caution:",
        routeLabel: "Breathing route:",
        route: {
          nose: "Inhale + exhale through the nose.",
          noseMouth: "Inhale through the nose, exhale through the mouth.",
          nosePursed: "Inhale through the nose, exhale through pursed lips.",
        },
        default: {
          about: "A steady breathing rhythm designed for comfort and focus.",
          bestFor: "Everyday calming sessions.",
          tip: "Start with 3-5 minutes and build up gradually.",
          caution: "Stop if you feel dizzy or uncomfortable.",
        },
        box_4_4_4_4: {
          about:
            "Equal phases make a predictable rhythm that helps settle racing thoughts.",
          bestFor:
            "Stress reset, transitions between tasks, and concentration.",
          tip: "Keep each phase gentle rather than forcing a deep inhale.",
          caution: "Shorten the holds if they feel tense.",
        },
        relax_4_7_8: {
          about:
            "Long exhale with a long hold can reduce arousal and support winding down.",
          bestFor: "Evening relaxation and pre-sleep decompression.",
          tip: "Use a soft inhale to avoid over-breathing before the hold.",
          caution: "Skip or reduce the hold if you are new to breathwork.",
        },
        coherent_5_5: {
          about:
            "Balanced inhale and exhale around 6 breaths per minute supports calm regulation.",
          bestFor: "Daily baseline practice and emotional steadiness.",
          tip: "Breathe through the nose and keep the breath smooth.",
          caution: "If it feels too slow, try 4-4 first.",
        },
        resonant_6_6: {
          about:
            "A slower balanced pattern encourages deep, unhurried breathing.",
          bestFor: "Longer calming sessions and nervous-system downshift.",
          tip: "Stay relaxed in shoulders and jaw to avoid strain.",
          caution: "Drop to 5-5 if you feel air hunger.",
        },
        equal_4_4: {
          about:
            "Simple equal timing gives a neutral, accessible rhythm for most users.",
          bestFor: "Quick reset breaks and beginner practice.",
          tip: "Use this as a warm-up before longer exhale presets.",
          caution: "Keep volume light; bigger is not better.",
        },
        pursed_2_4: {
          about:
            "Short inhale and longer exhale encourage slower out-breath pacing.",
          bestFor: "After light activity and calming breathlessness feelings.",
          tip: "Exhale as if gently blowing through a straw.",
          caution: "Do not force the exhale; keep it easy.",
        },
        extended_4_6: {
          about:
            "A modestly longer exhale helps reduce tension without long holds.",
          bestFor: "Midday stress management and focused work blocks.",
          tip: "Count evenly through the whole exhale instead of dumping air early.",
          caution: "If you get tense, switch back to equal breathing.",
        },
        extended_4_8: {
          about:
            "A much longer exhale can be deeply soothing when done gently.",
          bestFor: "Evening wind-down and post-stress recovery.",
          tip: "Keep inhale small so the 8-second exhale stays comfortable.",
          caution: "Use shorter exhale if you feel short of breath.",
        },
        triangle_3_3_3: {
          about:
            "Three equal phases with one hold add structure while staying brief.",
          bestFor: "Grounding and quick pre-meeting focus.",
          tip: "Let the hold feel quiet, not effortful.",
          caution: "Remove the hold if it increases anxiety.",
        },
        calm_4_4_6_2: {
          about:
            "Four-phase pattern blends control and release with a longer exhale.",
          bestFor: "Users who like structured rhythms with moderate challenge.",
          tip: "Think: smooth in, settle, longer out, soft pause.",
          caution: "Lower hold times first if the cycle feels demanding.",
        },
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
        resetDataMessage:
          "Esto eliminará preajustes guardados, favoritos y el idioma.",
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
        aboutPreset: "Sobre este preajuste",
      },
      label: {
        remaining: "Restante",
        state: "Estado:",
        phaseSound: "Sonido de fase",
        vibration: "Vibración",
        darkMode: "Modo oscuro",
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
      presetGuide: {
        sequenceLabel: "Patrón:",
        bestForLabel: "Ideal para:",
        tipLabel: "Consejo:",
        cautionLabel: "Precaución:",
        routeLabel: "Vía de respiración:",
        route: {
          nose: "Inhala y exhala por la nariz.",
          noseMouth: "Inhala por la nariz y exhala por la boca.",
          nosePursed: "Inhala por la nariz y exhala con labios fruncidos.",
        },
        default: {
          about:
            "Un ritmo respiratorio estable pensado para aportar calma y enfoque.",
          bestFor: "Sesiones cotidianas para relajarte.",
          tip: "Empieza con 3-5 minutos y aumenta poco a poco.",
          caution: "Detente si aparece mareo o molestia.",
        },
        box_4_4_4_4: {
          about: "Fases iguales crean un ritmo predecible que calma la mente.",
          bestFor:
            "Reinicios del estrés, transiciones entre tareas y concentración.",
          tip: "Mantén cada fase suave en lugar de forzar una inhalación profunda.",
          caution: "Acorta las pausas si generan tensión.",
        },
        relax_4_7_8: {
          about: "Exhalación y retención largas ayudan a bajar la activación.",
          bestFor: "Relajación nocturna y preparación para dormir.",
          tip: "Usa una inhalación suave para evitar hiperventilar antes de la pausa.",
          caution: "Omite o reduce la pausa si eres principiante.",
        },
        coherent_5_5: {
          about: "Inhalar y exhalar en 5-5 favorece una regulación tranquila.",
          bestFor: "Práctica diaria de base y estabilidad emocional.",
          tip: "Respira por la nariz y mantén el flujo uniforme.",
          caution: "Si te resulta lento, prueba primero 4-4.",
        },
        resonant_6_6: {
          about:
            "Un ritmo más lento promueve respiración profunda y sin prisa.",
          bestFor:
            "Sesiones largas de calma y regulación del sistema nervioso.",
          tip: "Relaja hombros y mandíbula para evitar tensión.",
          caution: "Vuelve a 5-5 si te falta el aire.",
        },
        equal_4_4: {
          about: "Patrón simple y accesible para empezar o reiniciar.",
          bestFor: "Pausas de reinicio rápidas y práctica inicial.",
          tip: "Úsalo como calentamiento antes de exhalaciones más largas.",
          caution:
            "Mantén un volumen respiratorio suave; más no siempre es mejor.",
        },
        pursed_2_4: {
          about:
            "Inhalación corta y exhalación larga facilitan soltar tensión.",
          bestFor:
            "Después de actividad ligera y para calmar sensación de falta de aire.",
          tip: "Exhala como si soplaras suavemente por una pajita.",
          caution: "No fuerces la exhalación; hazla fácil.",
        },
        extended_4_6: {
          about:
            "Exhalación moderadamente más larga reduce tensión sin pausas largas.",
          bestFor: "Gestión del estrés a mitad del día y bloques de enfoque.",
          tip: "Cuenta de forma constante durante toda la exhalación.",
          caution: "Si te tensas, vuelve a respiración igualada.",
        },
        extended_4_8: {
          about:
            "Exhalación muy larga puede ser profundamente calmante si es suave.",
          bestFor: "Desconexión por la noche y recuperación tras estrés.",
          tip: "Mantén la inhalación pequeña para sostener cómodo el 8.",
          caution: "Acorta la exhalación si notas falta de aire.",
        },
        triangle_3_3_3: {
          about:
            "Tres fases iguales con pausa breve aportan estructura rápida.",
          bestFor: "Enraizamiento y enfoque rápido antes de reuniones.",
          tip: "Haz que la pausa se sienta tranquila, no forzada.",
          caution: "Quita la pausa si aumenta la ansiedad.",
        },
        calm_4_4_6_2: {
          about: "Ritmo de cuatro fases que combina control y liberación.",
          bestFor:
            "Para quienes prefieren ritmos estructurados con reto moderado.",
          tip: "Piensa: entra suave, asienta, sale largo, pausa ligera.",
          caution: "Reduce primero las pausas si el ciclo se siente exigente.",
        },
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
        resetDataMessage:
          "Cela supprimera les préréglages, favoris et la langue.",
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
        aboutPreset: "À propos de ce préréglage",
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
      presetGuide: {
        sequenceLabel: "Rythme :",
        bestForLabel: "Idéal pour :",
        tipLabel: "Conseil :",
        cautionLabel: "Prudence :",
        routeLabel: "Voie respiratoire :",
        route: {
          nose: "Inspirez et expirez par le nez.",
          noseMouth: "Inspirez par le nez, expirez par la bouche.",
          nosePursed: "Inspirez par le nez, expirez lèvres pincées.",
        },
        default: {
          about:
            "Un rythme respiratoire stable conçu pour le calme et la concentration.",
          bestFor: "Les sessions quotidiennes de recentrage.",
          tip: "Commencez par 3-5 minutes puis augmentez progressivement.",
          caution: "Arrêtez en cas de vertige ou d'inconfort.",
        },
        box_4_4_4_4: {
          about:
            "Des phases égales créent un rythme prévisible qui apaise l'esprit.",
          bestFor:
            "Réduction du stress, transitions entre tâches et concentration.",
          tip: "Gardez chaque phase douce plutôt que de forcer une grande inspiration.",
          caution: "Raccourcissez les pauses si elles créent de la tension.",
        },
        relax_4_7_8: {
          about:
            "Une longue expiration avec rétention aide à ralentir le système.",
          bestFor: "Détente du soir et préparation au sommeil.",
          tip: "Inspirez doucement pour éviter l'hyperventilation avant la pause.",
          caution: "Supprimez ou réduisez la pause si vous débutez.",
        },
        coherent_5_5: {
          about: "Un rythme 5-5 équilibré favorise une régulation calme.",
          bestFor: "Pratique quotidienne de base et stabilité émotionnelle.",
          tip: "Respirez par le nez et gardez un souffle fluide.",
          caution: "Si c'est trop lent, commencez par 4-4.",
        },
        resonant_6_6: {
          about:
            "Un rythme plus lent encourage une respiration ample et détendue.",
          bestFor: "Séances longues d'apaisement et de régulation nerveuse.",
          tip: "Gardez les épaules et la mâchoire détendues pour éviter la tension.",
          caution: "Repassez à 5-5 si vous manquez d'air.",
        },
        equal_4_4: {
          about: "Un schéma simple et accessible pour débuter.",
          bestFor: "Pauses de réinitialisation rapides et pratique débutant.",
          tip: "Utilisez-le comme échauffement avant des expirations plus longues.",
          caution: "Restez en respiration légère ; plus fort n'est pas mieux.",
        },
        pursed_2_4: {
          about:
            "Inspiration courte, expiration longue pour relâcher la tension.",
          bestFor: "Après une activité légère et pour calmer l'essoufflement.",
          tip: "Expirez comme si vous souffliez doucement dans une paille.",
          caution: "Ne forcez pas l'expiration ; gardez-la facile.",
        },
        extended_4_6: {
          about:
            "Expiration allongée modérée pour apaiser sans longues pauses.",
          bestFor: "Gestion du stress en journée et blocs de concentration.",
          tip: "Comptez régulièrement sur toute l'expiration.",
          caution: "Si vous vous tendez, revenez à une respiration égale.",
        },
        extended_4_8: {
          about: "Expiration très longue, apaisante si elle reste douce.",
          bestFor: "Retour au calme le soir et récupération après stress.",
          tip: "Gardez une petite inspiration pour rendre l'expiration de 8 confortable.",
          caution: "Raccourcissez l'expiration en cas de gêne respiratoire.",
        },
        triangle_3_3_3: {
          about:
            "Trois temps égaux avec pause brève pour un recentrage rapide.",
          bestFor: "Ancrage et concentration rapide avant une réunion.",
          tip: "Laissez la pause être calme, sans effort.",
          caution: "Retirez la pause si elle augmente l'anxiété.",
        },
        calm_4_4_6_2: {
          about:
            "Un cycle à quatre phases qui mélange contrôle et relâchement.",
          bestFor:
            "Pour les personnes qui aiment les rythmes structurés avec défi modéré.",
          tip: "Pensez : entrée douce, stabiliser, sortie longue, pause légère.",
          caution: "Réduisez d'abord les pauses si le cycle semble exigeant.",
        },
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
        aboutPreset: "O tym presecie",
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
      presetGuide: {
        sequenceLabel: "Rytm:",
        bestForLabel: "Najlepsze na:",
        tipLabel: "Wskazówka:",
        cautionLabel: "Uwaga:",
        routeLabel: "Tor oddechu:",
        route: {
          nose: "Wdech i wydech przez nos.",
          noseMouth: "Wdech przez nos, wydech przez usta.",
          nosePursed: "Wdech przez nos, wydech przez lekko zaciśnięte usta.",
        },
        default: {
          about: "Stabilny rytm oddechu wspierający spokój i koncentrację.",
          bestFor: "Codzienne sesje wyciszenia.",
          tip: "Zacznij od 3-5 minut i stopniowo wydłużaj.",
          caution: "Przerwij, jeśli pojawią się zawroty głowy lub dyskomfort.",
        },
        box_4_4_4_4: {
          about: "Równe fazy tworzą przewidywalny rytm, który uspokaja myśli.",
          bestFor:
            "Szybki reset stresu, przejścia między zadaniami i koncentracja.",
          tip: "Utrzymuj każdą fazę łagodną zamiast wymuszać głęboki wdech.",
          caution: "Skróć pauzy, jeśli powodują napięcie.",
        },
        relax_4_7_8: {
          about: "Długi wydech i zatrzymanie pomagają obniżyć pobudzenie.",
          bestFor: "Wieczorne wyciszenie i przygotowanie do snu.",
          tip: "Rób delikatny wdech, aby nie hiperwentylować przed pauzą.",
          caution: "Pomiń lub skróć pauzę, jeśli dopiero zaczynasz.",
        },
        coherent_5_5: {
          about: "Równy rytm 5-5 wspiera spokojną regulację oddechu.",
          bestFor: "Codzienna praktyka bazowa i stabilizacja emocji.",
          tip: "Oddychaj nosem i utrzymuj płynny oddech.",
          caution: "Jeśli rytm jest zbyt wolny, zacznij od 4-4.",
        },
        resonant_6_6: {
          about: "Wolniejsze tempo sprzyja głębokiemu, spokojnemu oddechowi.",
          bestFor: "Dłuższe sesje uspokojenia i regulacji układu nerwowego.",
          tip: "Rozluźnij barki i szczękę, aby uniknąć napięcia.",
          caution: "Wróć do 5-5, jeśli brakuje Ci powietrza.",
        },
        equal_4_4: {
          about: "Prosty i dostępny wzorzec na start lub szybki reset.",
          bestFor: "Szybkie przerwy resetujące i praktyka dla początkujących.",
          tip: "Traktuj to jako rozgrzewkę przed dłuższym wydechem.",
          caution: "Oddychaj lekko; mocniej nie znaczy lepiej.",
        },
        pursed_2_4: {
          about: "Krótki wdech i dłuższy wydech pomagają rozluźnić napięcie.",
          bestFor: "Po lekkiej aktywności i przy uczuciu zadyszki.",
          tip: "Wydychaj jak przez słomkę, delikatnie i równo.",
          caution: "Nie wymuszaj wydechu; ma być swobodny.",
        },
        extended_4_6: {
          about: "Umiarkowanie wydłużony wydech uspokaja bez długich pauz.",
          bestFor: "Zarządzanie stresem w ciągu dnia i bloki skupienia.",
          tip: "Licz równo przez cały wydech.",
          caution: "Jeśli rośnie napięcie, wróć do równego oddechu.",
        },
        extended_4_8: {
          about: "Bardzo długi wydech może mocno wyciszać, jeśli jest łagodny.",
          bestFor: "Wieczorne wyciszenie i regeneracja po stresie.",
          tip: "Rób mały wdech, aby wydech 8 sekund był komfortowy.",
          caution: "Skróć wydech, jeśli pojawia się duszność.",
        },
        triangle_3_3_3: {
          about: "Trzy równe fazy z krótką pauzą dają szybkie uziemienie.",
          bestFor: "Uziemienie i szybkie skupienie przed spotkaniem.",
          tip: "Niech pauza będzie spokojna, bez wysiłku.",
          caution: "Usuń pauzę, jeśli nasila lęk.",
        },
        calm_4_4_6_2: {
          about: "Czterofazowy cykl łączy kontrolę i odpuszczenie.",
          bestFor:
            "Dla osób lubiących uporządkowane rytmy o umiarkowanej trudności.",
          tip: "Pomyśl: łagodny wdech, zatrzymanie, dłuższy wydech, miękka pauza.",
          caution: "Najpierw zmniejsz pauzy, jeśli cykl jest zbyt wymagający.",
        },
      },
      unit: {
        minuteShort: "min",
        secondShort: "s",
      },
    },
  },
  de: {
    translation: {
      app: {
        eyebrow: "ATEMUEBUNG",
        title: "Achtsames Atmen",
        subtitle: "Finde einen ruhigen und gleichmäßigen Rhythmus.",
      },
      language: {
        title: "Sprache",
        subtitle: "Wähle die Sprache der App.",
        name: "Deutsch",
        current: "Aktuell",
      },
      phase: {
        inhale: "EINATMEN",
        hold: "HALTEN",
        exhale: "AUSATMEN",
      },
      action: {
        start: "Start",
        pause: "Pause",
        reset: "Zurücksetzen",
        savePreset: "Preset speichern",
        presetSaved: "Preset gespeichert",
        presetRemoved: "Preset entfernt",
        resetData: "App-Daten zurücksetzen",
        resetDataTitle: "App-Daten zurücksetzen?",
        resetDataMessage:
          "Gespeicherte Presets, Favoriten und Sprache werden entfernt.",
        resetDataDone: "App-Daten gelöscht",
        deletePresetTitle: "Preset löschen?",
        deletePresetMessage: "Möchtest du {{name}} wirklich löschen?",
        cancel: "Abbrechen",
        delete: "Löschen",
      },
      section: {
        home: "Start",
        presets: "Presets",
        preferences: "Einstellungen",
        language: "Sprache",
        settings: "Optionen",
        favorites: "Favoriten",
        aboutPreset: "Über dieses Preset",
      },
      label: {
        remaining: "Verbleibend",
        state: "Status:",
        phaseSound: "Phasenklang",
        vibration: "Vibration",
        repeatFor: "Dauer",
        inhale: "Einatmen",
        hold1: "Pause nach dem Einatmen",
        exhale: "Ausatmen",
        hold2: "Pause nach dem Ausatmen",
        customPreset: "Benutzerdefiniert",
      },
      presets: {
        box_4_4_4_4: "Box 4-4-4-4",
        relax_4_7_8: "Entspannung 4-7-8",
        coherent_5_5: "Kohärent 5-5",
        resonant_6_6: "Resonanz 6-6",
        equal_4_4: "Gleichmäßig 4-4",
        pursed_2_4: "Lippenbremse 2-4",
        extended_4_6: "Verlängertes Ausatmen 4-6",
        extended_4_8: "Verlängertes Ausatmen 4-8",
        triangle_3_3_3: "Dreieck 3-3-3",
        calm_4_4_6_2: "Ruhe 4-4-6-2",
      },
      presetGuide: {
        sequenceLabel: "Muster:",
        bestForLabel: "Geeignet für:",
        tipLabel: "Tipp:",
        cautionLabel: "Hinweis:",
        routeLabel: "Atemweg:",
        route: {
          nose: "Ein- und Ausatmen durch die Nase.",
          noseMouth: "Durch die Nase einatmen, durch den Mund ausatmen.",
          nosePursed: "Durch die Nase einatmen, mit Lippenbremse ausatmen.",
        },
        default: {
          about: "Ein ruhiger Atemrhythmus für mehr Gelassenheit und Fokus.",
          bestFor: "Kurze tägliche Beruhigungsphasen.",
          tip: "Starte mit 3-5 Minuten und steigere langsam.",
          caution: "Stoppe bei Schwindel oder Unwohlsein.",
        },
        box_4_4_4_4: {
          about:
            "Gleiche Phasen schaffen einen vorhersehbaren, beruhigenden Rhythmus.",
          bestFor:
            "Stress-Reset, Übergänge zwischen Aufgaben und Konzentration.",
          tip: "Halte jede Phase sanft, statt tiefes Einatmen zu erzwingen.",
          caution: "Verkürze die Haltephasen, wenn sie Spannung erzeugen.",
        },
        relax_4_7_8: {
          about: "Lange Ausatmung mit Haltephase hilft beim Runterfahren.",
          bestFor: "Abendliche Entspannung und Vorbereitung auf den Schlaf.",
          tip: "Atme sanft ein, um vor der Pause nicht zu überatmen.",
          caution:
            "Lass die Pause weg oder verkürze sie, wenn du neu beginnst.",
        },
        coherent_5_5: {
          about: "Ausgewogenes 5-5 unterstützt eine ruhige Atemregulation.",
          bestFor: "Tägliche Basis-Praxis und emotionale Stabilität.",
          tip: "Atme durch die Nase und halte den Atemfluss weich.",
          caution: "Wenn es zu langsam wirkt, starte mit 4-4.",
        },
        resonant_6_6: {
          about: "Ein langsameres Tempo fördert tiefe, entspannte Atemzüge.",
          bestFor:
            "Längere Beruhigungs-Sessions und Downshift des Nervensystems.",
          tip: "Halte Schultern und Kiefer locker, um Spannung zu vermeiden.",
          caution: "Wechsle zu 5-5, wenn Luftknappheit entsteht.",
        },
        equal_4_4: {
          about: "Ein einfaches und gut zugängliches Muster für den Einstieg.",
          bestFor: "Kurze Reset-Pausen und Anfängerpraxis.",
          tip: "Nutze es als Aufwärmen vor längeren Ausatmungs-Mustern.",
          caution: "Atme eher leicht; mehr Volumen ist nicht besser.",
        },
        pursed_2_4: {
          about: "Kurzes Einatmen und längeres Ausatmen lösen Spannung.",
          bestFor: "Nach leichter Aktivität und bei gefühlter Atemnot.",
          tip: "Atme aus, als würdest du sanft durch einen Strohhalm pusten.",
          caution: "Presse die Ausatmung nicht heraus; bleib entspannt.",
        },
        extended_4_6: {
          about: "Moderat längere Ausatmung beruhigt ohne lange Haltezeiten.",
          bestFor: "Stressregulation am Mittag und fokussierte Arbeitsblöcke.",
          tip: "Zähle gleichmäßig über die gesamte Ausatmung.",
          caution:
            "Wenn du dich verspannst, gehe zu gleichmäßigem Atmen zurück.",
        },
        extended_4_8: {
          about:
            "Sehr lange Ausatmung wirkt stark beruhigend, wenn sie sanft bleibt.",
          bestFor: "Abendliches Runterfahren und Erholung nach Stress.",
          tip: "Halte die Einatmung klein, damit 8 Sekunden angenehm bleiben.",
          caution: "Verkürze die Ausatmung bei Luftnotgefühl.",
        },
        triangle_3_3_3: {
          about:
            "Drei gleiche Phasen mit kurzer Pause geben schnelle Struktur.",
          bestFor: "Grounding und schneller Fokus vor Meetings.",
          tip: "Lass die Pause ruhig sein, nicht anstrengend.",
          caution: "Lass die Pause weg, wenn sie Angst verstärkt.",
        },
        calm_4_4_6_2: {
          about: "Vier Phasen verbinden Kontrolle mit Loslassen.",
          bestFor:
            "Für Nutzer, die strukturierte Rhythmen mit moderater Herausforderung mögen.",
          tip: "Denke: weich ein, sammeln, länger aus, sanfte Pause.",
          caution:
            "Reduziere zuerst die Haltezeiten, wenn der Zyklus zu fordernd ist.",
        },
      },
      unit: {
        minuteShort: "min",
        secondShort: "s",
      },
    },
  },
  pt: {
    translation: {
      app: {
        eyebrow: "RESPIRAÇÃO",
        title: "Respiração consciente",
        subtitle: "Defina um ritmo calmo e estável.",
      },
      language: {
        title: "Idioma",
        subtitle: "Escolha o idioma do aplicativo.",
        name: "Português",
        current: "Atual",
      },
      phase: {
        inhale: "INSPIRAR",
        hold: "SEGURAR",
        exhale: "EXPIRAR",
      },
      action: {
        start: "Iniciar",
        pause: "Pausar",
        reset: "Redefinir",
        savePreset: "Salvar preset",
        presetSaved: "Preset salvo",
        presetRemoved: "Preset removido",
        resetData: "Redefinir dados do app",
        resetDataTitle: "Redefinir dados do app?",
        resetDataMessage: "Isso removerá presets salvos, favoritos e idioma.",
        resetDataDone: "Dados do app limpos",
        deletePresetTitle: "Excluir preset?",
        deletePresetMessage: "Tem certeza de que deseja excluir {{name}}?",
        cancel: "Cancelar",
        delete: "Excluir",
      },
      section: {
        home: "Início",
        presets: "Presets",
        preferences: "Preferências",
        language: "Idioma",
        settings: "Configurações",
        favorites: "Favoritos",
        aboutPreset: "Sobre este preset",
      },
      label: {
        remaining: "Restante",
        state: "Estado:",
        phaseSound: "Som de fase",
        vibration: "Vibração",
        repeatFor: "Duração",
        inhale: "Inspiração",
        hold1: "Pausa após inspirar",
        exhale: "Expiração",
        hold2: "Pausa após expirar",
        customPreset: "Personalizado",
      },
      presets: {
        box_4_4_4_4: "Caixa 4-4-4-4",
        relax_4_7_8: "Relaxamento 4-7-8",
        coherent_5_5: "Coerente 5-5",
        resonant_6_6: "Ressonante 6-6",
        equal_4_4: "Igual 4-4",
        pursed_2_4: "Lábios semicerrados 2-4",
        extended_4_6: "Expiração prolongada 4-6",
        extended_4_8: "Expiração prolongada 4-8",
        triangle_3_3_3: "Triângulo 3-3-3",
        calm_4_4_6_2: "Calmo 4-4-6-2",
      },
      presetGuide: {
        sequenceLabel: "Padrão:",
        bestForLabel: "Melhor para:",
        tipLabel: "Dica:",
        cautionLabel: "Cuidado:",
        routeLabel: "Via da respiracao:",
        route: {
          nose: "Inspire e expire pelo nariz.",
          noseMouth: "Inspire pelo nariz e expire pela boca.",
          nosePursed: "Inspire pelo nariz e expire com labios semicerrados.",
        },
        default: {
          about: "Um ritmo respiratório estável para promover calma e foco.",
          bestFor: "Sessões diárias de relaxamento.",
          tip: "Comece com 3-5 minutos e aumente aos poucos.",
          caution: "Pare se sentir tontura ou desconforto.",
        },
        box_4_4_4_4: {
          about: "Fases iguais criam um ritmo previsível que acalma a mente.",
          bestFor:
            "Reset do estresse, transições entre tarefas e concentração.",
          tip: "Mantenha cada fase suave em vez de forçar uma inspiração profunda.",
          caution: "Reduza as pausas se houver tensão.",
        },
        relax_4_7_8: {
          about: "Exalação longa com pausa ajuda a reduzir ativação.",
          bestFor: "Relaxamento noturno e preparação para dormir.",
          tip: "Faça uma inspiração suave para evitar hiperventilar antes da pausa.",
          caution: "Pule ou reduza a pausa se você estiver começando.",
        },
        coherent_5_5: {
          about: "Ritmo 5-5 equilibrado favorece regulação calma.",
          bestFor: "Prática diária de base e estabilidade emocional.",
          tip: "Respire pelo nariz e mantenha o fluxo suave.",
          caution: "Se parecer lento demais, tente 4-4 primeiro.",
        },
        resonant_6_6: {
          about:
            "Um ritmo mais lento incentiva respiração profunda e tranquila.",
          bestFor:
            "Sessões mais longas de calma e regulação do sistema nervoso.",
          tip: "Relaxe ombros e mandíbula para evitar tensão.",
          caution: "Volte para 5-5 se faltar ar.",
        },
        equal_4_4: {
          about: "Padrão simples e acessível para começar.",
          bestFor: "Pausas rápidas de reset e prática para iniciantes.",
          tip: "Use como aquecimento antes de padrões com exalação mais longa.",
          caution: "Mantenha o volume leve; maior não é melhor.",
        },
        pursed_2_4: {
          about: "Inspiração curta e expiração longa ajudam a soltar tensão.",
          bestFor:
            "Após atividade leve e para acalmar sensação de falta de ar.",
          tip: "Expire como se soprasse suavemente por um canudo.",
          caution: "Não force a exalação; mantenha confortável.",
        },
        extended_4_6: {
          about: "Expiração moderadamente mais longa acalma sem pausas longas.",
          bestFor: "Gestão de estresse no meio do dia e blocos de foco.",
          tip: "Conte de forma constante durante toda a exalação.",
          caution: "Se ficar tenso, volte para respiração igual.",
        },
        extended_4_8: {
          about: "Expiração bem longa pode ser muito calmante se for suave.",
          bestFor: "Desacelerar à noite e recuperação pós-estresse.",
          tip: "Mantenha a inspiração pequena para sustentar 8 segundos com conforto.",
          caution: "Encurte a exalação se houver falta de ar.",
        },
        triangle_3_3_3: {
          about: "Três fases iguais com pausa curta dão estrutura rápida.",
          bestFor: "Aterramento e foco rápido antes de reuniões.",
          tip: "Deixe a pausa silenciosa, sem esforço.",
          caution: "Remova a pausa se aumentar a ansiedade.",
        },
        calm_4_4_6_2: {
          about: "Ciclo de quatro fases que combina controle e soltura.",
          bestFor:
            "Para quem prefere ritmos estruturados com desafio moderado.",
          tip: "Pense: entra suave, estabiliza, sai longo, pausa leve.",
          caution: "Reduza primeiro as pausas se o ciclo parecer exigente.",
        },
      },
      unit: {
        minuteShort: "min",
        secondShort: "s",
      },
    },
  },
  ru: {
    translation: {
      app: {
        eyebrow: "ДЫХАНИЕ",
        title: "Осознанное дыхание",
        subtitle: "Выберите спокойный и ровный ритм.",
      },
      language: {
        title: "Язык",
        subtitle: "Выберите язык приложения.",
        name: "Русский",
        current: "Текущий",
      },
      phase: {
        inhale: "ВДОХ",
        hold: "ЗАДЕРЖКА",
        exhale: "ВЫДОХ",
      },
      action: {
        start: "Старт",
        pause: "Пауза",
        reset: "Сброс",
        savePreset: "Сохранить пресет",
        presetSaved: "Пресет сохранен",
        presetRemoved: "Пресет удален",
        resetData: "Сбросить данные приложения",
        resetDataTitle: "Сбросить данные приложения?",
        resetDataMessage: "Это удалит сохраненные пресеты, избранное и язык.",
        resetDataDone: "Данные приложения очищены",
        deletePresetTitle: "Удалить пресет?",
        deletePresetMessage: "Удалить {{name}}?",
        cancel: "Отмена",
        delete: "Удалить",
      },
      section: {
        home: "Главная",
        presets: "Пресеты",
        preferences: "Настройки",
        language: "Язык",
        settings: "Параметры",
        favorites: "Избранное",
        aboutPreset: "Об этом пресете",
      },
      label: {
        remaining: "Осталось",
        state: "Состояние:",
        phaseSound: "Звук фазы",
        vibration: "Вибрация",
        repeatFor: "Длительность",
        inhale: "Вдох",
        hold1: "Пауза после вдоха",
        exhale: "Выдох",
        hold2: "Пауза после выдоха",
        customPreset: "Пользовательский",
      },
      presets: {
        box_4_4_4_4: "Квадрат 4-4-4-4",
        relax_4_7_8: "Релакс 4-7-8",
        coherent_5_5: "Сбалансированный 5-5",
        resonant_6_6: "Резонанс 6-6",
        equal_4_4: "Ровный 4-4",
        pursed_2_4: "Сжатые губы 2-4",
        extended_4_6: "Удлиненный выдох 4-6",
        extended_4_8: "Удлиненный выдох 4-8",
        triangle_3_3_3: "Треугольник 3-3-3",
        calm_4_4_6_2: "Спокойствие 4-4-6-2",
      },
      presetGuide: {
        sequenceLabel: "Ритм:",
        bestForLabel: "Подходит для:",
        tipLabel: "Совет:",
        cautionLabel: "Внимание:",
        routeLabel: "Способ дыхания:",
        route: {
          nose: "Вдох и выдох через нос.",
          noseMouth: "Вдох через нос, выдох через рот.",
          nosePursed: "Вдох через нос, выдох через слегка сжатые губы.",
        },
        default: {
          about: "Ровный дыхательный ритм для спокойствия и фокуса.",
          bestFor: "Ежедневные короткие успокаивающие сессии.",
          tip: "Начните с 3-5 минут и увеличивайте постепенно.",
          caution: "Остановитесь при головокружении или дискомфорте.",
        },
        box_4_4_4_4: {
          about: "Равные фазы создают предсказуемый ритм и успокаивают мысли.",
          bestFor:
            "Быстрый сброс стресса, переходы между задачами и концентрация.",
          tip: "Сохраняйте каждую фазу мягкой, не форсируйте глубокий вдох.",
          caution: "Сократите задержки, если появляется напряжение.",
        },
        relax_4_7_8: {
          about: "Длинный выдох и задержка помогают снизить возбуждение.",
          bestFor: "Вечернее расслабление и подготовка ко сну.",
          tip: "Делайте мягкий вдох, чтобы не переусердствовать перед задержкой.",
          caution: "Уберите или сократите задержку, если вы новичок.",
        },
        coherent_5_5: {
          about: "Сбалансированный ритм 5-5 поддерживает спокойную регуляцию.",
          bestFor: "Ежедневная базовая практика и эмоциональная устойчивость.",
          tip: "Дышите через нос и сохраняйте ровный поток дыхания.",
          caution: "Если слишком медленно, начните с 4-4.",
        },
        resonant_6_6: {
          about:
            "Более медленный ритм способствует глубокому и мягкому дыханию.",
          bestFor:
            "Более длинные успокаивающие сессии и снижение активности нервной системы.",
          tip: "Расслабьте плечи и челюсть, чтобы избежать напряжения.",
          caution: "Вернитесь к 5-5, если не хватает воздуха.",
        },
        equal_4_4: {
          about: "Простой и доступный паттерн для начала.",
          bestFor: "Короткие перезагрузки и практика для начинающих.",
          tip: "Используйте как разминку перед более длинным выдохом.",
          caution: "Дышите мягко; глубже не значит лучше.",
        },
        pursed_2_4: {
          about: "Короткий вдох и длинный выдох помогают снять напряжение.",
          bestFor: "После лёгкой активности и при чувстве нехватки воздуха.",
          tip: "Выдыхайте так, будто мягко дуете через трубочку.",
          caution: "Не форсируйте выдох; пусть он будет лёгким.",
        },
        extended_4_6: {
          about: "Умеренно длинный выдох успокаивает без долгих задержек.",
          bestFor: "Управление стрессом днём и фокусные рабочие блоки.",
          tip: "Считайте равномерно на протяжении всего выдоха.",
          caution: "Если появляется напряжение, вернитесь к равному дыханию.",
        },
        extended_4_8: {
          about:
            "Очень длинный выдох может сильно успокаивать при мягком темпе.",
          bestFor: "Вечернее замедление и восстановление после стресса.",
          tip: "Делайте небольшой вдох, чтобы 8-секундный выдох был комфортным.",
          caution: "Сократите выдох, если появляется одышка.",
        },
        triangle_3_3_3: {
          about: "Три равные фазы с короткой паузой дают быстрое заземление.",
          bestFor: "Заземление и быстрый фокус перед встречей.",
          tip: "Пусть задержка ощущается спокойной, без усилия.",
          caution: "Уберите задержку, если она усиливает тревогу.",
        },
        calm_4_4_6_2: {
          about: "Четырехфазный цикл сочетает контроль и отпускание.",
          bestFor:
            "Для тех, кто любит структурированные ритмы с умеренной нагрузкой.",
          tip: "Думайте так: мягкий вдох, фиксация, длинный выдох, мягкая пауза.",
          caution: "Сначала уменьшите задержки, если цикл кажется тяжёлым.",
        },
      },
      unit: {
        minuteShort: "мин",
        secondShort: "с",
      },
    },
  },
  uk: {
    translation: {
      app: {
        eyebrow: "ДИХАННЯ",
        title: "Усвідомлене дихання",
        subtitle: "Налаштуйте спокійний і рівний ритм.",
      },
      language: {
        title: "Мова",
        subtitle: "Оберіть мову застосунку.",
        name: "Українська",
        current: "Поточна",
      },
      phase: {
        inhale: "ВДИХ",
        hold: "ЗАТРИМКА",
        exhale: "ВИДИХ",
      },
      action: {
        start: "Старт",
        pause: "Пауза",
        reset: "Скинути",
        savePreset: "Зберегти пресет",
        presetSaved: "Пресет збережено",
        presetRemoved: "Пресет видалено",
        resetData: "Скинути дані застосунку",
        resetDataTitle: "Скинути дані застосунку?",
        resetDataMessage: "Це видалить збережені пресети, вибране та мову.",
        resetDataDone: "Дані застосунку очищено",
        deletePresetTitle: "Видалити пресет?",
        deletePresetMessage: "Ви впевнені, що хочете видалити {{name}}?",
        cancel: "Скасувати",
        delete: "Видалити",
      },
      section: {
        home: "Головна",
        presets: "Пресети",
        preferences: "Уподобання",
        language: "Мова",
        settings: "Налаштування",
        favorites: "Вибране",
        aboutPreset: "Про цей пресет",
      },
      label: {
        remaining: "Залишилось",
        state: "Стан:",
        phaseSound: "Звук фази",
        vibration: "Вібрація",
        repeatFor: "Тривалість",
        inhale: "Вдих",
        hold1: "Пауза після вдиху",
        exhale: "Видих",
        hold2: "Пауза після видиху",
        customPreset: "Власний",
      },
      presets: {
        box_4_4_4_4: "Квадрат 4-4-4-4",
        relax_4_7_8: "Розслаблення 4-7-8",
        coherent_5_5: "Збалансоване 5-5",
        resonant_6_6: "Резонанс 6-6",
        equal_4_4: "Рівне 4-4",
        pursed_2_4: "Стиснуті губи 2-4",
        extended_4_6: "Подовжений видих 4-6",
        extended_4_8: "Подовжений видих 4-8",
        triangle_3_3_3: "Трикутник 3-3-3",
        calm_4_4_6_2: "Спокій 4-4-6-2",
      },
      presetGuide: {
        sequenceLabel: "Ритм:",
        bestForLabel: "Найкраще для:",
        tipLabel: "Порада:",
        cautionLabel: "Обережно:",
        routeLabel: "Спосіб дихання:",
        route: {
          nose: "Вдих і видих через ніс.",
          noseMouth: "Вдих через ніс, видих через рот.",
          nosePursed: "Вдих через ніс, видих через злегка стиснуті губи.",
        },
        default: {
          about: "Рівний дихальний ритм для спокою та концентрації.",
          bestFor: "Щоденні короткі заспокійливі сесії.",
          tip: "Почніть з 3-5 хвилин і поступово збільшуйте.",
          caution: "Зупиніться при запамороченні чи дискомфорті.",
        },
        box_4_4_4_4: {
          about:
            "Рівні фази створюють передбачуваний ритм і заспокоюють думки.",
          bestFor:
            "Швидке зниження стресу, переходи між завданнями та концентрація.",
          tip: "Тримайте кожну фазу м'якою, не змушуйте себе до глибокого вдиху.",
          caution: "Скоротіть затримки, якщо з'являється напруга.",
        },
        relax_4_7_8: {
          about: "Довгий видих і затримка допомагають знизити напруження.",
          bestFor: "Вечірнє розслаблення та підготовка до сну.",
          tip: "Робіть м'який вдих, щоб не перенасичувати дихання перед затримкою.",
          caution: "Приберіть або зменште затримку, якщо ви початківець.",
        },
        coherent_5_5: {
          about: "Збалансований ритм 5-5 підтримує спокійну регуляцію.",
          bestFor: "Щоденна базова практика та емоційна стабільність.",
          tip: "Дихайте носом і зберігайте плавний ритм.",
          caution: "Якщо занадто повільно, спробуйте спершу 4-4.",
        },
        resonant_6_6: {
          about: "Повільніший темп сприяє глибокому та м'якому диханню.",
          bestFor:
            "Довші заспокійливі сесії та зниження напруги нервової системи.",
          tip: "Розслабте плечі та щелепу, щоб уникнути напруження.",
          caution: "Поверніться до 5-5, якщо бракує повітря.",
        },
        equal_4_4: {
          about: "Простий і доступний шаблон для старту.",
          bestFor:
            "Швидкі паузи для перезавантаження і практика для початківців.",
          tip: "Використовуйте як розминку перед довшим видихом.",
          caution: "Дихайте легко; більший об'єм не означає кращий результат.",
        },
        pursed_2_4: {
          about: "Короткий вдих і довший видих допомагають відпустити напругу.",
          bestFor: "Після легкої активності та при відчутті задишки.",
          tip: "Видихайте так, ніби м'яко дмухаєте через соломинку.",
          caution: "Не форсуйте видих; робіть його комфортним.",
        },
        extended_4_6: {
          about: "Помірно довший видих заспокоює без довгих затримок.",
          bestFor:
            "Керування стресом посеред дня та блоки зосередженої роботи.",
          tip: "Рахуйте рівномірно протягом усього видиху.",
          caution: "Якщо зростає напруга, поверніться до рівного дихання.",
        },
        extended_4_8: {
          about:
            "Дуже довгий видих може глибоко заспокоювати, якщо він м'який.",
          bestFor: "Вечірнє заспокоєння та відновлення після стресу.",
          tip: "Робіть невеликий вдих, щоб 8 секунд видиху були комфортними.",
          caution: "Скоротіть видих, якщо з'являється задишка.",
        },
        triangle_3_3_3: {
          about: "Три рівні фази з короткою паузою дають швидке заземлення.",
          bestFor: "Заземлення та швидкий фокус перед зустрічами.",
          tip: "Нехай затримка буде спокійною, без зусилля.",
          caution: "Приберіть затримку, якщо вона підсилює тривогу.",
        },
        calm_4_4_6_2: {
          about: "Чотирифазний цикл поєднує контроль і розслаблення.",
          bestFor:
            "Для тих, хто любить структуровані ритми з помірним викликом.",
          tip: "Думайте так: м'який вдих, зафіксувати, довший видих, легка пауза.",
          caution: "Спершу зменште затримки, якщо цикл занадто складний.",
        },
      },
      unit: {
        minuteShort: "хв",
        secondShort: "с",
      },
    },
  },
  hi: {
    translation: {
      app: {
        eyebrow: "श्वास अभ्यास",
        title: "सचेत श्वास",
        subtitle: "एक शांत और स्थिर लय चुनें।",
      },
      language: {
        title: "भाषा",
        subtitle: "ऐप की भाषा चुनें।",
        name: "हिन्दी",
        current: "वर्तमान",
      },
      phase: {
        inhale: "श्वास लें",
        hold: "रोकें",
        exhale: "श्वास छोड़ें",
      },
      action: {
        start: "शुरू करें",
        pause: "रोकें",
        reset: "रीसेट",
        savePreset: "प्रीसेट सहेजें",
        presetSaved: "प्रीसेट सहेजा गया",
        presetRemoved: "प्रीसेट हटाया गया",
        resetData: "ऐप डेटा रीसेट करें",
        resetDataTitle: "ऐप डेटा रीसेट करें?",
        resetDataMessage: "इससे सहेजे गए प्रीसेट, पसंदीदा और भाषा हट जाएगी।",
        resetDataDone: "ऐप डेटा साफ़ हो गया",
        deletePresetTitle: "प्रीसेट हटाएँ?",
        deletePresetMessage: "क्या आप {{name}} हटाना चाहते हैं?",
        cancel: "रद्द करें",
        delete: "हटाएँ",
      },
      section: {
        home: "मुख्य पृष्ठ",
        presets: "प्रीसेट",
        preferences: "प्राथमिकताएं",
        language: "भाषा",
        settings: "सेटिंग",
        favorites: "पसंदीदा",
        aboutPreset: "इस प्रीसेट के बारे में",
      },
      label: {
        remaining: "शेष",
        state: "स्थिति:",
        phaseSound: "चरण ध्वनि",
        vibration: "वाइब्रेशन",
        repeatFor: "अवधि",
        inhale: "श्वास लें",
        hold1: "श्वास लेने के बाद विराम",
        exhale: "श्वास छोड़ें",
        hold2: "श्वास छोड़ने के बाद विराम",
        customPreset: "कस्टम",
      },
      presets: {
        box_4_4_4_4: "बॉक्स 4-4-4-4",
        relax_4_7_8: "रिलैक्स 4-7-8",
        coherent_5_5: "कोहेरेंट 5-5",
        resonant_6_6: "रेज़ोनेंट 6-6",
        equal_4_4: "समान 4-4",
        pursed_2_4: "सिकुड़े होंठ 2-4",
        extended_4_6: "लंबा श्वासत्याग 4-6",
        extended_4_8: "लंबा श्वासत्याग 4-8",
        triangle_3_3_3: "त्रिकोण 3-3-3",
        calm_4_4_6_2: "शांत 4-4-6-2",
      },
      presetGuide: {
        sequenceLabel: "पैटर्न:",
        bestForLabel: "किसके लिए उपयुक्त:",
        tipLabel: "सुझाव:",
        cautionLabel: "सावधानी:",
        routeLabel: "श्वास का तरीका:",
        route: {
          nose: "श्वास लेना और छोड़ना दोनों नाक से।",
          noseMouth: "नाक से श्वास लें, मुंह से छोड़ें।",
          nosePursed: "नाक से श्वास लें, सिकुड़े होंठों से छोड़ें।",
        },
        default: {
          about: "शांति और फोकस के लिए यह एक स्थिर श्वास-लय है।",
          bestFor: "रोज़ की छोटी रिलैक्सेशन प्रैक्टिस के लिए उपयुक्त।",
          tip: "3-5 मिनट से शुरू करें और धीरे-धीरे समय बढ़ाएं।",
          caution: "चक्कर या असहजता महसूस हो तो तुरंत रुकें।",
        },
        box_4_4_4_4: {
          about: "समान चरणों वाला यह रिदम मन को जल्दी स्थिर और शांत करता है।",
          bestFor: "तनाव कम करने, काम बदलने के बीच और एकाग्रता के लिए।",
          tip: "हर चरण को सहज रखें, गहरी सांस जबरदस्ती न लें।",
          caution: "अगर तनाव लगे तो होल्ड का समय कम करें।",
        },
        relax_4_7_8: {
          about:
            "लंबा श्वासत्याग और रोक शरीर की उत्तेजना कम करने में मदद करते हैं।",
          bestFor: "शाम की रिलैक्सेशन और नींद से पहले शांत होने के लिए।",
          tip: "होल्ड से पहले ओवर-ब्रीदिंग से बचने हेतु हल्का श्वास लें।",
          caution: "यदि आप नए हैं तो होल्ड घटाएं या छोड़ दें।",
        },
        coherent_5_5: {
          about: "संतुलित 5-5 लय श्वास को सहज और नियंत्रित बनाती है।",
          bestFor: "रोज़ की बेसलाइन प्रैक्टिस और भावनात्मक स्थिरता के लिए।",
          tip: "नाक से श्वास लें और प्रवाह को मुलायम रखें।",
          caution: "यदि यह धीमा लगे तो पहले 4-4 करें।",
        },
        resonant_6_6: {
          about: "धीमा 6-6 रिदम गहरी और आरामदायक श्वास को बढ़ावा देता है।",
          bestFor: "लंबी शांत सत्रों और नर्वस सिस्टम को डाउनशिफ्ट करने के लिए।",
          tip: "तनाव से बचने के लिए कंधे और जबड़ा ढीले रखें।",
          caution: "यदि सांस कम लगे तो 5-5 पर वापस आएं।",
        },
        equal_4_4: {
          about: "शुरुआत या त्वरित रीसेट के लिए सरल और भरोसेमंद पैटर्न।",
          bestFor: "त्वरित रीसेट ब्रेक और शुरुआती अभ्यास के लिए।",
          tip: "लंबे श्वासत्याग वाले पैटर्न से पहले इसे वार्म-अप की तरह करें।",
          caution: "सांस हल्की रखें; ज्यादा हमेशा बेहतर नहीं होता।",
        },
        pursed_2_4: {
          about:
            "छोटा श्वास-लेना और लंबा श्वासत्याग तनाव घटाने में मदद करते हैं।",
          bestFor:
            "हल्की गतिविधि के बाद और सांस फूलने की भावना शांत करने के लिए।",
          tip: "ऐसे श्वासत्याग करें जैसे आप स्ट्रॉ से धीरे फूंक रहे हों।",
          caution: "श्वासत्याग को जोर से न करें; सहज रखें।",
        },
        extended_4_6: {
          about: "मध्यम लंबा श्वासत्याग बिना लंबी रोक के शांति देता है।",
          bestFor: "दोपहर के तनाव प्रबंधन और फोकस्ड काम के ब्लॉक के लिए।",
          tip: "पूरे श्वासत्याग में समान गिनती रखें।",
          caution: "तनाव बढ़े तो बराबर श्वास पर लौट आएं।",
        },
        extended_4_8: {
          about:
            "बहुत लंबा श्वासत्याग, यदि नरम रखा जाए, तो गहरी शांति देता है।",
          bestFor: "शाम को शांत होने और तनाव के बाद रिकवरी के लिए।",
          tip: "श्वास छोटा रखें ताकि 8-सेकंड का श्वासत्याग आरामदायक रहे।",
          caution: "सांस फूलने लगे तो श्वासत्याग छोटा करें।",
        },
        triangle_3_3_3: {
          about: "तीन समान चरण और छोटी रोक जल्दी स्थिरता देते हैं।",
          bestFor: "ग्राउंडिंग और मीटिंग से पहले त्वरित फोकस के लिए।",
          tip: "होल्ड को शांत महसूस होने दें, मेहनत वाला नहीं।",
          caution: "यदि चिंता बढ़े तो होल्ड हटा दें।",
        },
        calm_4_4_6_2: {
          about:
            "चार चरणों का यह चक्र नियंत्रण और छोड़ने के बीच संतुलन बनाता है।",
          bestFor:
            "उन लोगों के लिए जिन्हें मध्यम चुनौती वाले संरचित रिदम पसंद हैं।",
          tip: "सोचें: मुलायम अंदर, ठहराव, लंबा बाहर, हल्का विराम।",
          caution: "यदि चक्र कठिन लगे तो पहले होल्ड कम करें।",
        },
      },
      unit: {
        minuteShort: "मि",
        secondShort: "से",
      },
    },
  },
  ja: {
    translation: {
      app: {
        eyebrow: "呼吸",
        title: "マインドフル呼吸",
        subtitle: "落ち着いた一定のリズムを作りましょう。",
      },
      language: {
        title: "言語",
        subtitle: "アプリの言語を選択してください。",
        name: "日本語",
        current: "現在",
      },
      phase: {
        inhale: "吸う",
        hold: "止める",
        exhale: "吐く",
      },
      action: {
        start: "開始",
        pause: "一時停止",
        reset: "リセット",
        savePreset: "プリセットを保存",
        presetSaved: "プリセットを保存しました",
        presetRemoved: "プリセットを削除しました",
        resetData: "アプリデータをリセット",
        resetDataTitle: "アプリデータをリセットしますか？",
        resetDataMessage:
          "保存したプリセット、お気に入り、言語が削除されます。",
        resetDataDone: "アプリデータを消去しました",
        deletePresetTitle: "プリセットを削除しますか？",
        deletePresetMessage: "{{name}}を削除しますか？",
        cancel: "キャンセル",
        delete: "削除",
      },
      section: {
        home: "ホーム",
        presets: "プリセット",
        preferences: "設定",
        language: "言語",
        settings: "オプション",
        favorites: "お気に入り",
        aboutPreset: "このプリセットについて",
      },
      label: {
        remaining: "残り",
        state: "状態:",
        phaseSound: "フェーズ音",
        vibration: "バイブレーション",
        repeatFor: "時間",
        inhale: "吸う",
        hold1: "吸った後の停止",
        exhale: "吐く",
        hold2: "吐いた後の停止",
        customPreset: "カスタム",
      },
      presets: {
        box_4_4_4_4: "ボックス 4-4-4-4",
        relax_4_7_8: "リラックス 4-7-8",
        coherent_5_5: "コヒーレント 5-5",
        resonant_6_6: "レゾナント 6-6",
        equal_4_4: "均等 4-4",
        pursed_2_4: "口すぼめ 2-4",
        extended_4_6: "長い呼気 4-6",
        extended_4_8: "長い呼気 4-8",
        triangle_3_3_3: "トライアングル 3-3-3",
        calm_4_4_6_2: "穏やか 4-4-6-2",
      },
      presetGuide: {
        sequenceLabel: "呼吸パターン:",
        bestForLabel: "おすすめの場面:",
        tipLabel: "コツ:",
        cautionLabel: "注意:",
        routeLabel: "呼吸の通り道:",
        route: {
          nose: "吸う・吐くの両方を鼻で行います。",
          noseMouth: "鼻で吸って、口で吐きます。",
          nosePursed: "鼻で吸って、すぼめた唇で吐きます。",
        },
        default: {
          about: "落ち着きと集中のための安定した呼吸リズムです。",
          bestFor: "毎日の短いリラックス習慣に。",
          tip: "まずは3-5分から始め、少しずつ延ばしましょう。",
          caution: "めまいや不快感があれば中止してください。",
        },
        box_4_4_4_4: {
          about: "各フェーズが同じ長さで、気持ちを整えやすい定番リズムです。",
          bestFor: "ストレスの切り替え、作業間の移行、集中に。",
          tip: "深く吸おうとせず、各フェーズをやさしく行います。",
          caution: "緊張を感じたらホールド時間を短くしてください。",
        },
        relax_4_7_8: {
          about: "長めの呼気とホールドで、興奮状態をゆるやかに下げます。",
          bestFor: "夜のリラックスや就寝前のクールダウンに。",
          tip: "ホールド前に過呼吸気味にならないよう、吸気はやさしく。",
          caution: "初心者はホールドを短くするか省いてください。",
        },
        coherent_5_5: {
          about: "5-5の均等な呼吸で、落ち着いたペースを作りやすくします。",
          bestFor: "毎日の基礎練習と気分の安定に。",
          tip: "鼻呼吸で、呼吸の流れをなめらかに保ちます。",
          caution: "遅く感じる場合は、まず4-4を試してください。",
        },
        resonant_6_6: {
          about: "よりゆっくりしたテンポで、深く無理のない呼吸を促します。",
          bestFor: "長めの鎮静セッションや自律神経のクールダウンに。",
          tip: "肩とあごを緩め、余計な力みを避けます。",
          caution: "息苦しさがあれば5-5に戻してください。",
        },
        equal_4_4: {
          about: "シンプルで取り入れやすく、初心者にも使いやすいパターンです。",
          bestFor: "短いリセット休憩や初心者の練習に。",
          tip: "長い呼気パターンの前のウォームアップとして使います。",
          caution: "呼吸量は軽めで十分。大きいほど良いわけではありません。",
        },
        pursed_2_4: {
          about: "短い吸気と長い呼気で、緊張を手放しやすくなります。",
          bestFor: "軽い運動後や息苦しさの落ち着けに。",
          tip: "ストローをやさしく吹くように吐きます。",
          caution: "吐く息を無理に押し出さず、楽に行ってください。",
        },
        extended_4_6: {
          about: "ほどよく長い呼気で、長いホールドなしでも落ち着けます。",
          bestFor: "日中のストレス管理や集中作業の前後に。",
          tip: "吐く間は最初から最後まで同じペースで数えます。",
          caution: "緊張してきたら均等呼吸に戻します。",
        },
        extended_4_8: {
          about: "非常に長い呼気は、やさしく行えば深い落ち着きに役立ちます。",
          bestFor: "夜のクールダウンやストレス後の回復に。",
          tip: "8秒吐きを楽に続けるため、吸気は小さめにします。",
          caution: "息苦しさがあれば吐く時間を短くしてください。",
        },
        triangle_3_3_3: {
          about: "3つの等しいフェーズと短いホールドで、すばやく整えます。",
          bestFor: "グラウンディングや会議前の素早い集中に。",
          tip: "ホールドは頑張らず、静かに保ちます。",
          caution: "不安が強まる場合はホールドを外してください。",
        },
        calm_4_4_6_2: {
          about: "4フェーズの流れで、コントロールと解放のバランスを取ります。",
          bestFor: "程よい難度の構造化リズムが好きな人に。",
          tip: "意識は「やさしく吸う、整える、長く吐く、軽く休む」。",
          caution: "きつく感じる場合は、まずホールド時間を下げます。",
        },
      },
      unit: {
        minuteShort: "分",
        secondShort: "秒",
      },
    },
  },
} as const;

const locale = Localization.getLocales()[0]?.languageTag ?? "en";
const language = locale.split("-")[0];

export type AppLanguage = keyof typeof resources;
const supported: AppLanguage[] = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ru",
  "uk",
  "hi",
  "ja",
  "pl",
];
const isSupportedLanguage = (value: string): value is AppLanguage =>
  supported.includes(value as AppLanguage);
const LANGUAGE_KEY = "breathe.language";
export const languageOptions = (Object.keys(resources) as AppLanguage[]).map(
  (code) => ({
    code,
    label: resources[code].translation.language.name,
  }),
);

i18n.use(initReactI18next).init({
  resources,
  lng: isSupportedLanguage(language) ? language : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

const loadSavedLanguage = async () => {
  try {
    const saved = await SecureStore.getItemAsync(LANGUAGE_KEY);
    if (
      saved &&
      supported.includes(saved as AppLanguage) &&
      saved !== i18n.language
    ) {
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
