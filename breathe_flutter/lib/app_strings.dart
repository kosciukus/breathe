import 'models.dart';
import 'preset_guide_strings.dart';

const Map<String, Map<String, String>> _localizedValues =
    <String, Map<String, String>>{
  "en": <String, String>{
    "app.eyebrow": "BREATHWORK",
    "app.title": "Mindful Breathe",
    "app.subtitle": "Set a rhythm that feels calm and steady.",
    "language.title": "Language",
    "language.subtitle": "Choose the language of the app.",
    "language.name": "English",
    "language.current": "Current",
    "phase.inhale": "INHALE",
    "phase.hold": "HOLD",
    "phase.exhale": "EXHALE",
    "phase.getReady": "GET READY",
    "action.start": "Start",
    "action.reset": "Reset",
    "action.savePreset": "Save preset",
    "action.presetSaved": "Preset saved",
    "action.presetRemoved": "Preset removed",
    "action.resetData": "Reset app data",
    "action.resetDataTitle": "Reset app data?",
    "action.resetDataMessage":
        "This will remove saved presets, favorites, and language.",
    "action.resetDataDone": "App data cleared",
    "action.cancel": "Cancel",
    "action.delete": "Delete",
    "section.home": "Home",
    "section.presets": "Presets",
    "section.preferences": "Preferences",
    "section.language": "Language",
    "section.settings": "Settings",
    "section.favorites": "Favorites",
    "section.aboutPreset": "About this preset",
    "label.remaining": "Remaining",
    "label.startingIn": "Starting in",
    "label.state": "State:",
    "label.phaseSound": "Phase sound",
    "label.vibration": "Vibration",
    "label.darkMode": "Dark mode",
    "label.repeatFor": "Duration",
    "label.inhale": "Inhale",
    "label.hold1": "Pause after inhale",
    "label.exhale": "Exhale",
    "label.hold2": "Pause after exhale",
    "label.customPreset": "Custom",
    "presetGuide.sequenceLabel": "Pattern:",
    "presetGuide.bestForLabel": "Best for:",
    "presetGuide.tipLabel": "Tip:",
    "presetGuide.cautionLabel": "Caution:",
    "presetGuide.routeLabel": "Breathing route:",
    "presetGuide.route.nose": "Inhale + exhale through the nose.",
    "presetGuide.route.noseMouth":
        "Inhale through the nose, exhale through the mouth.",
    "presetGuide.route.nosePursed":
        "Inhale through the nose, exhale through pursed lips.",
    "unit.minuteShort": "min",
    "unit.secondShort": "s",
    "presets.box_4_4_4_4": "Box 4-4-4-4",
    "presets.relax_4_7_8": "Relax 4-7-8",
    "presets.coherent_5_5": "Coherent 5-5",
    "presets.resonant_6_6": "Resonant 6-6",
    "presets.equal_4_4": "Equal 4-4",
    "presets.pursed_2_4": "Pursed-lip 2-4",
    "presets.extended_4_6": "Extended exhale 4-6",
    "presets.extended_4_8": "Extended exhale 4-8",
    "presets.triangle_3_3_3": "Triangle 3-3-3",
    "presets.calm_4_4_6_2": "Calm 4-4-6-2",
  },
  "es": <String, String>{
    "app.eyebrow": "RESPIRACION",
    "app.title": "Respiracion consciente",
    "app.subtitle": "Define un ritmo que se sienta tranquilo y estable.",
    "language.title": "Idioma",
    "language.subtitle": "Elige el idioma de la aplicacion.",
    "language.name": "Espanol",
    "language.current": "Actual",
    "phase.inhale": "INHALA",
    "phase.hold": "RETEN",
    "phase.exhale": "EXHALA",
    "phase.getReady": "PREPARATE",
    "action.start": "Iniciar",
    "action.reset": "Reiniciar",
    "action.savePreset": "Guardar preajuste",
    "action.presetSaved": "Preajuste guardado",
    "action.presetRemoved": "Preajuste eliminado",
    "action.resetData": "Restablecer datos",
    "action.resetDataTitle": "Restablecer datos?",
    "action.resetDataMessage":
        "Esto eliminara preajustes guardados, favoritos y el idioma.",
    "action.resetDataDone": "Datos eliminados",
    "action.cancel": "Cancelar",
    "action.delete": "Eliminar",
    "section.home": "Inicio",
    "section.presets": "Preajustes",
    "section.preferences": "Preferencias",
    "section.language": "Idioma",
    "section.settings": "Ajustes",
    "section.favorites": "Favoritos",
    "section.aboutPreset": "Sobre este preajuste",
    "label.remaining": "Restante",
    "label.startingIn": "Comienza en",
    "label.state": "Estado:",
    "label.phaseSound": "Sonido de fase",
    "label.vibration": "Vibracion",
    "label.darkMode": "Modo oscuro",
    "label.repeatFor": "Duracion",
    "label.inhale": "Inhala",
    "label.hold1": "Pausa despues de inhalar",
    "label.exhale": "Exhala",
    "label.hold2": "Pausa despues de exhalar",
    "label.customPreset": "Personalizado",
    "presetGuide.sequenceLabel": "Patron:",
    "presetGuide.bestForLabel": "Ideal para:",
    "presetGuide.tipLabel": "Consejo:",
    "presetGuide.cautionLabel": "Precaucion:",
    "presetGuide.routeLabel": "Via de respiracion:",
    "presetGuide.route.nose": "Inhala y exhala por la nariz.",
    "presetGuide.route.noseMouth":
        "Inhala por la nariz y exhala por la boca.",
    "presetGuide.route.nosePursed":
        "Inhala por la nariz y exhala con labios fruncidos.",
    "unit.minuteShort": "min",
    "unit.secondShort": "s",
    "presets.box_4_4_4_4": "Caja 4-4-4-4",
    "presets.relax_4_7_8": "Relajacion 4-7-8",
    "presets.coherent_5_5": "Coherente 5-5",
    "presets.resonant_6_6": "Resonante 6-6",
    "presets.equal_4_4": "Igual 4-4",
    "presets.pursed_2_4": "Labios fruncidos 2-4",
    "presets.extended_4_6": "Exhalacion extendida 4-6",
    "presets.extended_4_8": "Exhalacion extendida 4-8",
    "presets.triangle_3_3_3": "Triangulo 3-3-3",
    "presets.calm_4_4_6_2": "Calma 4-4-6-2",
  },
  "fr": <String, String>{
    "app.eyebrow": "RESPIRATION",
    "app.title": "Respiration consciente",
    "app.subtitle": "Definissez un rythme calme et regulier.",
    "language.title": "Langue",
    "language.subtitle": "Choisissez la langue de l'application.",
    "language.name": "Francais",
    "language.current": "Actuelle",
    "phase.inhale": "INSPIRER",
    "phase.hold": "RETENIR",
    "phase.exhale": "EXPIRER",
    "phase.getReady": "PREPAREZ-VOUS",
    "action.start": "Demarrer",
    "action.reset": "Reinitialiser",
    "action.savePreset": "Enregistrer un prereglage",
    "action.presetSaved": "Prereglage enregistre",
    "action.presetRemoved": "Prereglage supprime",
    "action.resetData": "Reinitialiser les donnees",
    "action.resetDataTitle": "Reinitialiser les donnees ?",
    "action.resetDataMessage":
        "Cela supprimera les prereglages, favoris et la langue.",
    "action.resetDataDone": "Donnees effacees",
    "action.cancel": "Annuler",
    "action.delete": "Supprimer",
    "section.home": "Accueil",
    "section.presets": "Prereglages",
    "section.preferences": "Preferences",
    "section.language": "Langue",
    "section.settings": "Parametres",
    "section.favorites": "Favoris",
    "section.aboutPreset": "A propos de ce prereglage",
    "label.remaining": "Restant",
    "label.startingIn": "Debut dans",
    "label.state": "Etat:",
    "label.phaseSound": "Son de phase",
    "label.vibration": "Vibration",
    "label.repeatFor": "Duree",
    "label.inhale": "Inspiration",
    "label.hold1": "Pause apres l'inspiration",
    "label.exhale": "Expiration",
    "label.hold2": "Pause apres l'expiration",
    "label.customPreset": "Personnalise",
    "presetGuide.sequenceLabel": "Rythme :",
    "presetGuide.bestForLabel": "Ideal pour :",
    "presetGuide.tipLabel": "Conseil :",
    "presetGuide.cautionLabel": "Prudence :",
    "presetGuide.routeLabel": "Voie respiratoire :",
    "presetGuide.route.nose": "Inspirez et expirez par le nez.",
    "presetGuide.route.noseMouth":
        "Inspirez par le nez, expirez par la bouche.",
    "presetGuide.route.nosePursed":
        "Inspirez par le nez, expirez levres pincees.",
    "unit.minuteShort": "min",
    "unit.secondShort": "s",
    "presets.box_4_4_4_4": "Carre 4-4-4-4",
    "presets.relax_4_7_8": "Relaxation 4-7-8",
    "presets.coherent_5_5": "Coherente 5-5",
    "presets.resonant_6_6": "Resonante 6-6",
    "presets.equal_4_4": "Egale 4-4",
    "presets.pursed_2_4": "Levres pincees 2-4",
    "presets.extended_4_6": "Expiration prolongee 4-6",
    "presets.extended_4_8": "Expiration prolongee 4-8",
    "presets.triangle_3_3_3": "Triangle 3-3-3",
    "presets.calm_4_4_6_2": "Calme 4-4-6-2",
  },
  "de": <String, String>{
    "app.eyebrow": "ATEMUEBUNG",
    "app.title": "Achtsames Atmen",
    "app.subtitle": "Finde einen ruhigen und gleichmassigen Rhythmus.",
    "language.title": "Sprache",
    "language.subtitle": "Wahle die Sprache der App.",
    "language.name": "Deutsch",
    "language.current": "Aktuell",
    "phase.inhale": "EINATMEN",
    "phase.hold": "HALTEN",
    "phase.exhale": "AUSATMEN",
    "phase.getReady": "BEREIT MACHEN",
    "action.start": "Start",
    "action.reset": "Zurucksetzen",
    "action.savePreset": "Preset speichern",
    "action.presetSaved": "Preset gespeichert",
    "action.presetRemoved": "Preset entfernt",
    "action.resetData": "App-Daten zurucksetzen",
    "action.resetDataTitle": "App-Daten zurucksetzen?",
    "action.resetDataMessage":
        "Gespeicherte Presets, Favoriten und Sprache werden entfernt.",
    "action.resetDataDone": "App-Daten geloscht",
    "action.cancel": "Abbrechen",
    "action.delete": "Loschen",
    "section.home": "Start",
    "section.presets": "Presets",
    "section.preferences": "Einstellungen",
    "section.language": "Sprache",
    "section.settings": "Optionen",
    "section.favorites": "Favoriten",
    "section.aboutPreset": "Uber dieses Preset",
    "label.remaining": "Verbleibend",
    "label.startingIn": "Start in",
    "label.state": "Status:",
    "label.phaseSound": "Phasenklang",
    "label.vibration": "Vibration",
    "label.repeatFor": "Dauer",
    "label.inhale": "Einatmen",
    "label.hold1": "Pause nach dem Einatmen",
    "label.exhale": "Ausatmen",
    "label.hold2": "Pause nach dem Ausatmen",
    "label.customPreset": "Benutzerdefiniert",
    "presetGuide.sequenceLabel": "Muster:",
    "presetGuide.bestForLabel": "Geeignet fur:",
    "presetGuide.tipLabel": "Tipp:",
    "presetGuide.cautionLabel": "Hinweis:",
    "presetGuide.routeLabel": "Atemweg:",
    "presetGuide.route.nose": "Ein- und Ausatmen durch die Nase.",
    "presetGuide.route.noseMouth":
        "Durch die Nase einatmen, durch den Mund ausatmen.",
    "presetGuide.route.nosePursed":
        "Durch die Nase einatmen, mit Lippenbremse ausatmen.",
    "unit.minuteShort": "min",
    "unit.secondShort": "s",
    "presets.box_4_4_4_4": "Box 4-4-4-4",
    "presets.relax_4_7_8": "Entspannung 4-7-8",
    "presets.coherent_5_5": "Koherent 5-5",
    "presets.resonant_6_6": "Resonanz 6-6",
    "presets.equal_4_4": "Gleichmassig 4-4",
    "presets.pursed_2_4": "Lippenbremse 2-4",
    "presets.extended_4_6": "Verlangertes Ausatmen 4-6",
    "presets.extended_4_8": "Verlangertes Ausatmen 4-8",
    "presets.triangle_3_3_3": "Dreieck 3-3-3",
    "presets.calm_4_4_6_2": "Ruhe 4-4-6-2",
  },
  "pt": <String, String>{
    "app.eyebrow": "RESPIRACAO",
    "app.title": "Respiracao consciente",
    "app.subtitle": "Defina um ritmo calmo e estavel.",
    "language.title": "Idioma",
    "language.subtitle": "Escolha o idioma do aplicativo.",
    "language.name": "Portugues",
    "language.current": "Atual",
    "phase.inhale": "INSPIRAR",
    "phase.hold": "SEGURAR",
    "phase.exhale": "EXPIRAR",
    "phase.getReady": "PREPARE-SE",
    "action.start": "Iniciar",
    "action.reset": "Redefinir",
    "action.savePreset": "Salvar preset",
    "action.presetSaved": "Preset salvo",
    "action.presetRemoved": "Preset removido",
    "action.resetData": "Redefinir dados do app",
    "action.resetDataTitle": "Redefinir dados do app?",
    "action.resetDataMessage":
        "Isso removera presets salvos, favoritos e idioma.",
    "action.resetDataDone": "Dados do app limpos",
    "action.cancel": "Cancelar",
    "action.delete": "Excluir",
    "section.home": "Inicio",
    "section.presets": "Presets",
    "section.preferences": "Preferencias",
    "section.language": "Idioma",
    "section.settings": "Configuracoes",
    "section.favorites": "Favoritos",
    "section.aboutPreset": "Sobre este preset",
    "label.remaining": "Restante",
    "label.startingIn": "Comeca em",
    "label.state": "Estado:",
    "label.phaseSound": "Som de fase",
    "label.vibration": "Vibracao",
    "label.repeatFor": "Duracao",
    "label.inhale": "Inspiracao",
    "label.hold1": "Pausa apos inspirar",
    "label.exhale": "Expiracao",
    "label.hold2": "Pausa apos expirar",
    "label.customPreset": "Personalizado",
    "presetGuide.sequenceLabel": "Padrao:",
    "presetGuide.bestForLabel": "Melhor para:",
    "presetGuide.tipLabel": "Dica:",
    "presetGuide.cautionLabel": "Cuidado:",
    "presetGuide.routeLabel": "Via da respiracao:",
    "presetGuide.route.nose": "Inspire e expire pelo nariz.",
    "presetGuide.route.noseMouth":
        "Inspire pelo nariz e expire pela boca.",
    "presetGuide.route.nosePursed":
        "Inspire pelo nariz e expire com labios semicerrados.",
    "unit.minuteShort": "min",
    "unit.secondShort": "s",
    "presets.box_4_4_4_4": "Caixa 4-4-4-4",
    "presets.relax_4_7_8": "Relaxamento 4-7-8",
    "presets.coherent_5_5": "Coerente 5-5",
    "presets.resonant_6_6": "Ressonante 6-6",
    "presets.equal_4_4": "Igual 4-4",
    "presets.pursed_2_4": "Labios semicerrados 2-4",
    "presets.extended_4_6": "Expiracao prolongada 4-6",
    "presets.extended_4_8": "Expiracao prolongada 4-8",
    "presets.triangle_3_3_3": "Triangulo 3-3-3",
    "presets.calm_4_4_6_2": "Calmo 4-4-6-2",
  },
  "ru": <String, String>{
    "app.eyebrow": "ДЫХАНИЕ",
    "app.title": "Осознанное дыхание",
    "app.subtitle": "Выберите спокойный и ровный ритм.",
    "language.title": "Язык",
    "language.subtitle": "Выберите язык приложения.",
    "language.name": "Русский",
    "language.current": "Текущий",
    "phase.inhale": "ВДОХ",
    "phase.hold": "ЗАДЕРЖКА",
    "phase.exhale": "ВЫДОХ",
    "phase.getReady": "ПРИГОТОВЬТЕСЬ",
    "action.start": "Старт",
    "action.reset": "Сброс",
    "action.savePreset": "Сохранить пресет",
    "action.presetSaved": "Пресет сохранен",
    "action.presetRemoved": "Пресет удален",
    "action.resetData": "Сбросить данные приложения",
    "action.resetDataTitle": "Сбросить данные приложения?",
    "action.resetDataMessage":
        "Это удалит сохраненные пресеты, избранное и язык.",
    "action.resetDataDone": "Данные приложения очищены",
    "action.cancel": "Отмена",
    "action.delete": "Удалить",
    "section.home": "Главная",
    "section.presets": "Пресеты",
    "section.preferences": "Настройки",
    "section.language": "Язык",
    "section.settings": "Параметры",
    "section.favorites": "Избранное",
    "section.aboutPreset": "Об этом пресете",
    "label.remaining": "Осталось",
    "label.startingIn": "Начало через",
    "label.state": "Состояние:",
    "label.phaseSound": "Звук фазы",
    "label.vibration": "Вибрация",
    "label.repeatFor": "Длительность",
    "label.inhale": "Вдох",
    "label.hold1": "Пауза после вдоха",
    "label.exhale": "Выдох",
    "label.hold2": "Пауза после выдоха",
    "label.customPreset": "Пользовательский",
    "presetGuide.sequenceLabel": "Ритм:",
    "presetGuide.bestForLabel": "Подходит для:",
    "presetGuide.tipLabel": "Совет:",
    "presetGuide.cautionLabel": "Внимание:",
    "presetGuide.routeLabel": "Способ дыхания:",
    "presetGuide.route.nose": "Вдох и выдох через нос.",
    "presetGuide.route.noseMouth": "Вдох через нос, выдох через рот.",
    "presetGuide.route.nosePursed":
        "Вдох через нос, выдох через слегка сжатые губы.",
    "unit.minuteShort": "мин",
    "unit.secondShort": "с",
    "presets.box_4_4_4_4": "Квадрат 4-4-4-4",
    "presets.relax_4_7_8": "Релакс 4-7-8",
    "presets.coherent_5_5": "Сбалансированный 5-5",
    "presets.resonant_6_6": "Резонанс 6-6",
    "presets.equal_4_4": "Ровный 4-4",
    "presets.pursed_2_4": "Сжатые губы 2-4",
    "presets.extended_4_6": "Удлиненный выдох 4-6",
    "presets.extended_4_8": "Удлиненный выдох 4-8",
    "presets.triangle_3_3_3": "Треугольник 3-3-3",
    "presets.calm_4_4_6_2": "Спокойствие 4-4-6-2",
  },
  "uk": <String, String>{
    "app.eyebrow": "ДИХАННЯ",
    "app.title": "Усвідомлене дихання",
    "app.subtitle": "Налаштуйте спокійний і рівний ритм.",
    "language.title": "Мова",
    "language.subtitle": "Оберіть мову застосунку.",
    "language.name": "Українська",
    "language.current": "Поточна",
    "phase.inhale": "ВДИХ",
    "phase.hold": "ЗАТРИМКА",
    "phase.exhale": "ВИДИХ",
    "phase.getReady": "ПРИГОТУЙТЕСЯ",
    "action.start": "Старт",
    "action.reset": "Скинути",
    "action.savePreset": "Зберегти пресет",
    "action.presetSaved": "Пресет збережено",
    "action.presetRemoved": "Пресет видалено",
    "action.resetData": "Скинути дані застосунку",
    "action.resetDataTitle": "Скинути дані застосунку?",
    "action.resetDataMessage":
        "Це видалить збережені пресети, вибране та мову.",
    "action.resetDataDone": "Дані застосунку очищено",
    "action.cancel": "Скасувати",
    "action.delete": "Видалити",
    "section.home": "Головна",
    "section.presets": "Пресети",
    "section.preferences": "Уподобання",
    "section.language": "Мова",
    "section.settings": "Налаштування",
    "section.favorites": "Вибране",
    "section.aboutPreset": "Про цей пресет",
    "label.remaining": "Залишилось",
    "label.startingIn": "Початок через",
    "label.state": "Стан:",
    "label.phaseSound": "Звук фази",
    "label.vibration": "Вібрація",
    "label.repeatFor": "Тривалість",
    "label.inhale": "Вдих",
    "label.hold1": "Пауза після вдиху",
    "label.exhale": "Видих",
    "label.hold2": "Пауза після видиху",
    "label.customPreset": "Власний",
    "presetGuide.sequenceLabel": "Ритм:",
    "presetGuide.bestForLabel": "Найкраще для:",
    "presetGuide.tipLabel": "Порада:",
    "presetGuide.cautionLabel": "Обережно:",
    "presetGuide.routeLabel": "Спосіб дихання:",
    "presetGuide.route.nose": "Вдих і видих через ніс.",
    "presetGuide.route.noseMouth": "Вдих через ніс, видих через рот.",
    "presetGuide.route.nosePursed":
        "Вдих через ніс, видих через злегка стиснуті губи.",
    "unit.minuteShort": "хв",
    "unit.secondShort": "с",
    "presets.box_4_4_4_4": "Квадрат 4-4-4-4",
    "presets.relax_4_7_8": "Розслаблення 4-7-8",
    "presets.coherent_5_5": "Збалансоване 5-5",
    "presets.resonant_6_6": "Резонанс 6-6",
    "presets.equal_4_4": "Рівне 4-4",
    "presets.pursed_2_4": "Стиснуті губи 2-4",
    "presets.extended_4_6": "Подовжений видих 4-6",
    "presets.extended_4_8": "Подовжений видих 4-8",
    "presets.triangle_3_3_3": "Трикутник 3-3-3",
    "presets.calm_4_4_6_2": "Спокій 4-4-6-2",
  },
  "hi": <String, String>{
    "app.eyebrow": "श्वास अभ्यास",
    "app.title": "सचेत श्वास",
    "app.subtitle": "एक शांत और स्थिर लय चुनें।",
    "language.title": "भाषा",
    "language.subtitle": "ऐप की भाषा चुनें।",
    "language.name": "हिन्दी",
    "language.current": "वर्तमान",
    "phase.inhale": "श्वास लें",
    "phase.hold": "रोकें",
    "phase.exhale": "श्वास छोड़ें",
    "phase.getReady": "तैयार हो जाएं",
    "action.start": "शुरू करें",
    "action.reset": "रीसेट",
    "action.savePreset": "प्रीसेट सहेजें",
    "action.presetSaved": "प्रीसेट सहेजा गया",
    "action.presetRemoved": "प्रीसेट हटाया गया",
    "action.resetData": "ऐप डेटा रीसेट करें",
    "action.resetDataTitle": "ऐप डेटा रीसेट करें?",
    "action.resetDataMessage":
        "इससे सहेजे गए प्रीसेट, पसंदीदा और भाषा हट जाएगी।",
    "action.resetDataDone": "ऐप डेटा साफ हो गया",
    "action.cancel": "रद्द करें",
    "action.delete": "हटाएं",
    "section.home": "मुख्य पृष्ठ",
    "section.presets": "प्रीसेट",
    "section.preferences": "प्राथमिकताएं",
    "section.language": "भाषा",
    "section.settings": "सेटिंग",
    "section.favorites": "पसंदीदा",
    "section.aboutPreset": "इस प्रीसेट के बारे में",
    "label.remaining": "शेष",
    "label.startingIn": "शुरू होने में",
    "label.state": "स्थिति:",
    "label.phaseSound": "चरण ध्वनि",
    "label.vibration": "वाइब्रेशन",
    "label.repeatFor": "अवधि",
    "label.inhale": "श्वास लें",
    "label.hold1": "श्वास लेने के बाद विराम",
    "label.exhale": "श्वास छोड़ें",
    "label.hold2": "श्वास छोड़ने के बाद विराम",
    "label.customPreset": "कस्टम",
    "presetGuide.sequenceLabel": "पैटर्न:",
    "presetGuide.bestForLabel": "किसके लिए उपयुक्त:",
    "presetGuide.tipLabel": "सुझाव:",
    "presetGuide.cautionLabel": "सावधानी:",
    "presetGuide.routeLabel": "श्वास का तरीका:",
    "presetGuide.route.nose": "श्वास लेना और छोड़ना दोनों नाक से।",
    "presetGuide.route.noseMouth": "नाक से श्वास लें, मुंह से छोड़ें।",
    "presetGuide.route.nosePursed":
        "नाक से श्वास लें, सिकुड़े होंठों से छोड़ें।",
    "unit.minuteShort": "मि",
    "unit.secondShort": "से",
    "presets.box_4_4_4_4": "बॉक्स 4-4-4-4",
    "presets.relax_4_7_8": "रिलैक्स 4-7-8",
    "presets.coherent_5_5": "कोहेरेंट 5-5",
    "presets.resonant_6_6": "रेज़ोनेंट 6-6",
    "presets.equal_4_4": "समान 4-4",
    "presets.pursed_2_4": "सिकुड़े होंठ 2-4",
    "presets.extended_4_6": "लंबा श्वासत्याग 4-6",
    "presets.extended_4_8": "लंबा श्वासत्याग 4-8",
    "presets.triangle_3_3_3": "त्रिकोण 3-3-3",
    "presets.calm_4_4_6_2": "शांत 4-4-6-2",
  },
  "ja": <String, String>{
    "app.eyebrow": "呼吸",
    "app.title": "マインドフル呼吸",
    "app.subtitle": "落ち着いた一定のリズムを作りましょう。",
    "language.title": "言語",
    "language.subtitle": "アプリの言語を選択してください。",
    "language.name": "日本語",
    "language.current": "現在",
    "phase.inhale": "吸う",
    "phase.hold": "止める",
    "phase.exhale": "吐く",
    "phase.getReady": "準備",
    "action.start": "開始",
    "action.reset": "リセット",
    "action.savePreset": "プリセットを保存",
    "action.presetSaved": "プリセットを保存しました",
    "action.presetRemoved": "プリセットを削除しました",
    "action.resetData": "アプリデータをリセット",
    "action.resetDataTitle": "アプリデータをリセットしますか？",
    "action.resetDataMessage":
        "保存したプリセット、お気に入り、言語が削除されます。",
    "action.resetDataDone": "アプリデータを消去しました",
    "action.cancel": "キャンセル",
    "action.delete": "削除",
    "section.home": "ホーム",
    "section.presets": "プリセット",
    "section.preferences": "設定",
    "section.language": "言語",
    "section.settings": "オプション",
    "section.favorites": "お気に入り",
    "section.aboutPreset": "このプリセットについて",
    "label.remaining": "残り",
    "label.startingIn": "開始まで",
    "label.state": "状態:",
    "label.phaseSound": "フェーズ音",
    "label.vibration": "バイブレーション",
    "label.repeatFor": "時間",
    "label.inhale": "吸う",
    "label.hold1": "吸った後の停止",
    "label.exhale": "吐く",
    "label.hold2": "吐いた後の停止",
    "label.customPreset": "カスタム",
    "presetGuide.sequenceLabel": "呼吸パターン:",
    "presetGuide.bestForLabel": "おすすめの場面:",
    "presetGuide.tipLabel": "コツ:",
    "presetGuide.cautionLabel": "注意:",
    "presetGuide.routeLabel": "呼吸の通り道:",
    "presetGuide.route.nose": "吸う・吐くの両方を鼻で行います。",
    "presetGuide.route.noseMouth": "鼻で吸って、口で吐きます。",
    "presetGuide.route.nosePursed":
        "鼻で吸って、すぼめた唇で吐きます。",
    "unit.minuteShort": "分",
    "unit.secondShort": "秒",
    "presets.box_4_4_4_4": "ボックス 4-4-4-4",
    "presets.relax_4_7_8": "リラックス 4-7-8",
    "presets.coherent_5_5": "コヒーレント 5-5",
    "presets.resonant_6_6": "レゾナント 6-6",
    "presets.equal_4_4": "均等 4-4",
    "presets.pursed_2_4": "口すぼめ 2-4",
    "presets.extended_4_6": "長い呼気 4-6",
    "presets.extended_4_8": "長い呼気 4-8",
    "presets.triangle_3_3_3": "トライアングル 3-3-3",
    "presets.calm_4_4_6_2": "穏やか 4-4-6-2",
  },
  "pl": <String, String>{
    "app.eyebrow": "ODDECH",
    "app.title": "Swiadomy oddech",
    "app.subtitle": "Ustaw spokojny i rowny rytm.",
    "language.title": "Jezyk",
    "language.subtitle": "Wybierz jezyk aplikacji.",
    "language.name": "Polski",
    "language.current": "Biezacy",
    "phase.inhale": "WDECH",
    "phase.hold": "WSTRZYMAJ",
    "phase.exhale": "WYDECH",
    "phase.getReady": "PRZYGOTUJ SIE",
    "action.start": "Start",
    "action.reset": "Reset",
    "action.savePreset": "Zapisz preset",
    "action.presetSaved": "Preset zapisany",
    "action.presetRemoved": "Preset usuniety",
    "action.resetData": "Wyczysc dane",
    "action.resetDataTitle": "Wyczyscic dane?",
    "action.resetDataMessage": "To usunie presety, ulubione i jezyk.",
    "action.resetDataDone": "Dane usuniete",
    "action.cancel": "Anuluj",
    "action.delete": "Usun",
    "section.home": "Start",
    "section.presets": "Presety",
    "section.preferences": "Preferencje",
    "section.language": "Jezyk",
    "section.settings": "Ustawienia",
    "section.favorites": "Ulubione",
    "section.aboutPreset": "O tym presecie",
    "label.remaining": "Pozostalo",
    "label.startingIn": "Start za",
    "label.state": "Stan:",
    "label.phaseSound": "Dzwiek fazy",
    "label.vibration": "Wibracje",
    "label.repeatFor": "Czas trwania",
    "label.inhale": "Wdech",
    "label.hold1": "Pauza po wdechu",
    "label.exhale": "Wydech",
    "label.hold2": "Pauza po wydechu",
    "label.customPreset": "Wlasny",
    "presetGuide.sequenceLabel": "Rytm:",
    "presetGuide.bestForLabel": "Najlepsze na:",
    "presetGuide.tipLabel": "Wskazowka:",
    "presetGuide.cautionLabel": "Uwaga:",
    "presetGuide.routeLabel": "Tor oddechu:",
    "presetGuide.route.nose": "Wdech i wydech przez nos.",
    "presetGuide.route.noseMouth": "Wdech przez nos, wydech przez usta.",
    "presetGuide.route.nosePursed":
        "Wdech przez nos, wydech przez lekko zacisniete usta.",
    "unit.minuteShort": "min",
    "unit.secondShort": "s",
    "presets.box_4_4_4_4": "Kwadrat 4-4-4-4",
    "presets.relax_4_7_8": "Relaks 4-7-8",
    "presets.coherent_5_5": "Spojny 5-5",
    "presets.resonant_6_6": "Rezonans 6-6",
    "presets.equal_4_4": "Rowny 4-4",
    "presets.pursed_2_4": "Usta zacisniete 2-4",
    "presets.extended_4_6": "Wydluzony wydech 4-6",
    "presets.extended_4_8": "Wydluzony wydech 4-8",
    "presets.triangle_3_3_3": "Trojkat 3-3-3",
    "presets.calm_4_4_6_2": "Spokoj 4-4-6-2",
  },
};

class AppStrings {
  const AppStrings(this.language);

  final AppLanguage language;

  String _t(String key) {
    final languageMap = _localizedValues[language.code];
    final englishMap = _localizedValues[AppLanguage.en.code]!;
    return languageMap?[key] ?? englishMap[key] ?? key;
  }

  String get appEyebrow => _t("app.eyebrow");
  String get appTitle => _t("app.title");
  String get appSubtitle => _t("app.subtitle");

  String get homeTab => _t("section.home");
  String get presetsTab => _t("section.presets");
  String get preferencesTab => _t("section.preferences");
  String get languageTab => _t("section.language");

  String get favoriteSectionTitle => _t("section.favorites");
  String get aboutPresetTitle => _t("section.aboutPreset");

  String get remainingLabel => _t("label.remaining");
  String get startingInLabel => _t("label.startingIn");
  String get stateLabel => _t("label.state");
  String get repeatForLabel => _t("label.repeatFor");
  String get inhaleLabel => _t("label.inhale");
  String get holdInLabel => _t("label.hold1");
  String get exhaleLabel => _t("label.exhale");
  String get holdOutLabel => _t("label.hold2");
  String get customPresetLabel => _t("label.customPreset");

  String get phaseSoundLabel => _t("label.phaseSound");
  String get vibrationLabel => _t("label.vibration");
  String get darkModeLabel => _t("label.darkMode");

  String get startAction => _t("action.start");
  String get resetAction => _t("action.reset");
  String get savePresetAction => _t("action.savePreset");
  String get removePresetAction => _t("action.delete");
  String get favoriteAction => favoriteSectionTitle;
  String get resetDataAction => _t("action.resetData");

  String get presetSaved => _t("action.presetSaved");
  String get presetRemoved => _t("action.presetRemoved");
  String get appDataCleared => _t("action.resetDataDone");

  String get currentLabel => _t("language.current");
  String get getReadyLabel => _t("phase.getReady");
  String get resetDataTitle => _t("action.resetDataTitle");
  String get resetDataMessage => _t("action.resetDataMessage");
  String get cancelAction => _t("action.cancel");
  String get confirmAction => resetAction;

  String get sequenceLabel => _t("presetGuide.sequenceLabel");
  String get bestForLabel => _t("presetGuide.bestForLabel");
  String get tipLabel => _t("presetGuide.tipLabel");
  String get cautionLabel => _t("presetGuide.cautionLabel");
  String get routeLabel => _t("presetGuide.routeLabel");

  String get minuteShort => _t("unit.minuteShort");
  String get secondShort => _t("unit.secondShort");
  String get untimedLabel => "—";

  String phaseLabel(BreathingPhase phase) {
    switch (phase) {
      case BreathingPhase.inhale:
        return _t("phase.inhale");
      case BreathingPhase.holdIn:
        return _t("phase.hold");
      case BreathingPhase.exhale:
        return _t("phase.exhale");
      case BreathingPhase.holdOut:
        return _t("phase.hold");
    }
  }

  String routeInstruction(BreathingRoute route) {
    switch (route) {
      case BreathingRoute.nose:
        return _t("presetGuide.route.nose");
      case BreathingRoute.noseMouth:
        return _t("presetGuide.route.noseMouth");
      case BreathingRoute.nosePursed:
        return _t("presetGuide.route.nosePursed");
    }
  }

  String timerText(int? remainingMs) {
    if (remainingMs == null) return untimedLabel;
    return formatClock(remainingMs);
  }

  String languageName(AppLanguage code) {
    return _localizedValues[code.code]?["language.name"] ??
        _localizedValues[AppLanguage.en.code]!["language.name"]!;
  }

  String presetLabelFor(String presetId, String fallback) {
    final key = "presets.$presetId";
    final translated = _localizedValues[language.code]?[key] ??
        _localizedValues[AppLanguage.en.code]?[key];
    return translated ?? fallback;
  }

  String presetAbout(String presetId, String fallback) {
    return _presetGuideValue(presetId, "about", fallback);
  }

  String presetBestFor(String presetId, String fallback) {
    return _presetGuideValue(presetId, "bestFor", fallback);
  }

  String presetTip(String presetId, String fallback) {
    return _presetGuideValue(presetId, "tip", fallback);
  }

  String presetCaution(String presetId, String fallback) {
    return _presetGuideValue(presetId, "caution", fallback);
  }

  String _presetGuideValue(String presetId, String field, String fallback) {
    final key = "$presetId.$field";
    final defaultKey = "default.$field";
    final languageMap = presetGuideLocalizedValues[language.code];
    final englishMap = presetGuideLocalizedValues[AppLanguage.en.code]!;
    return languageMap?[key] ??
        languageMap?[defaultKey] ??
        englishMap[key] ??
        englishMap[defaultKey] ??
        fallback;
  }
}
