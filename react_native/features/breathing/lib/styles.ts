import { Platform, StyleSheet } from "react-native";

export type BreathingColors = {
  bg: string;
  ink: string;
  muted: string;
  card: string;
  accent: string;
  accentSoft: string;
  track: string;
  soft: string;
  coral: string;
  panelBorder: string;
  controlBorder: string;
  cardBorder: string;
  chipBorder: string;
};

export const LIGHT_COLORS: BreathingColors = {
  bg: "#F7F4F0",
  ink: "#1F2328",
  muted: "#5B616A",
  card: "#FFFFFF",
  accent: "#0E7C86",
  accentSoft: "#D5F3F1",
  track: "#E3E0DA",
  soft: "#EFEAE4",
  coral: "#F5C8B8",
  panelBorder: "#EFE7DE",
  controlBorder: "#E2DBD3",
  cardBorder: "#F3EEE7",
  chipBorder: "#E6E0D8",
};

export const DARK_COLORS: BreathingColors = {
  bg: "#111417",
  ink: "#F3F5F7",
  muted: "#AAB2BA",
  card: "#1B2127",
  accent: "#53BBC5",
  accentSoft: "#173C40",
  track: "#2B3239",
  soft: "#262D34",
  coral: "#4A332F",
  panelBorder: "#303840",
  controlBorder: "#3A434C",
  cardBorder: "#2D353D",
  chipBorder: "#3A444D",
};

const GOLDEN_RATIO = 1.618;
const GOLDEN_INVERSE = 0.618;
const GOLDEN_UNIT = 10;
const GOLDEN_SPACE = Math.round(GOLDEN_UNIT * GOLDEN_RATIO);
const GOLDEN_SPACE_COMPACT = Math.round(GOLDEN_SPACE * GOLDEN_INVERSE);

export const createBreathingStyles = (colors: BreathingColors) =>
  StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.bg },
  scrollContent: { paddingBottom: GOLDEN_SPACE, flexGrow: 1 },
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  sheetContainer: {
    height: "75%",
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 16,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -8 },
    elevation: 10,
  },
  sheetBackdrop: { flex: 1 },
  sheetContent: { flex: 1 },
  sheetScrollContent: { paddingBottom: 24, gap: 12, flexGrow: 1 },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.ink,
    ...Platform.select({
      ios: { fontFamily: "AvenirNext-Heavy" },
      android: { fontFamily: "sans-serif-condensed" },
      default: {},
    }),
  },
  sheetSubtitle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
    ...Platform.select({
      ios: { fontFamily: "AvenirNext-Regular" },
      android: { fontFamily: "sans-serif-light" },
      default: {},
    }),
  },
  sheetCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.controlBorder,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  bgOrbOne: {
    position: "absolute",
    width: 258,
    height: 258,
    borderRadius: 129,
    backgroundColor: colors.accentSoft,
    top: -90,
    left: -50,
    opacity: 0.85,
  },
  bgOrbTwo: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.coral,
    bottom: -36,
    right: -34,
    opacity: 0.7,
  },
  goldenLayout: { flexGrow: 1, gap: GOLDEN_SPACE },
  goldenPrimarySection: {
    flexGrow: GOLDEN_RATIO,
    justifyContent: "space-between",
    gap: GOLDEN_SPACE_COMPACT,
  },
  goldenTopStack: { gap: GOLDEN_SPACE_COMPACT },
  goldenCardAnchor: { gap: GOLDEN_SPACE_COMPACT },
  goldenSecondarySection: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  header: { marginBottom: GOLDEN_SPACE_COMPACT },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.muted,
    fontWeight: "700",
    ...Platform.select({
      ios: { fontFamily: "AvenirNext-DemiBold" },
      android: { fontFamily: "sans-serif-medium" },
      default: {},
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 6,
    ...Platform.select({
      ios: { fontFamily: "AvenirNext-Heavy" },
      android: { fontFamily: "sans-serif-condensed" },
      default: {},
    }),
  },
  subtitle: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 15,
    ...Platform.select({
      ios: { fontFamily: "AvenirNext-Regular" },
      android: { fontFamily: "sans-serif-light" },
      default: {},
    }),
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  phasePill: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  phaseRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  phaseCaption: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.muted,
    textTransform: "uppercase",
  },
  phaseLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.accent,
    ...Platform.select({
      ios: { fontFamily: "AvenirNext-DemiBold" },
      android: { fontFamily: "sans-serif-medium" },
      default: {},
    }),
  },
  countdown: {
    fontSize: 58,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 8,
    color: colors.ink,
    ...Platform.select({
      ios: { fontFamily: "AvenirNext-Heavy" },
      android: { fontFamily: "sans-serif-condensed" },
      default: {},
    }),
  },
  remainingLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.muted,
    textTransform: "uppercase",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonDisabled: { opacity: 0.45 },
  progressTrack: {
    height: 12,
    backgroundColor: colors.track,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 999,
  },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: { backgroundColor: colors.accent },
  secondaryButton: {
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.controlBorder,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    ...Platform.select({
      ios: { fontFamily: "AvenirNext-DemiBold" },
      android: { fontFamily: "sans-serif-medium" },
      default: {},
    }),
  },
  secondaryText: { color: colors.ink },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.4 },
  note: { marginTop: 12, color: colors.muted },
  noteBold: { fontWeight: "700" },
  controls: { marginTop: 14, gap: 10 },
  homeControls: { gap: 10 },
  presetSection: { gap: 8 },
  favoritesSection: { marginBottom: 0 },
  presetTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.muted,
    letterSpacing: 1.2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionToggle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.muted,
  },
  presetRow: { gap: 10 },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  favoriteBarContent: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 4,
  },
  presetChip: {
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.chipBorder,
  },
  presetChipSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  presetChipText: { color: colors.ink, fontWeight: "600" },
  presetChipTextSelected: { color: colors.accent, fontWeight: "700" },
  presetGuideCard: {
    backgroundColor: colors.soft,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.controlBorder,
    gap: 6,
  },
  presetGuideTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
  },
  presetGuideMeta: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: "700",
  },
  presetGuideBody: {
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },
  presetGuideBullet: {
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
  },
  presetGuideCaution: {
    marginTop: 2,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },
  row: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: { fontSize: 15, fontWeight: "600", color: colors.ink },
  rowValue: { fontSize: 15, fontWeight: "700", color: colors.ink },
  durationSlider: {
    height: Platform.OS === "android" ? 44 : 32,
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  languageRowSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  languageHint: { marginTop: 2, fontSize: 12, color: colors.muted },
  languageCheck: { fontSize: 18, fontWeight: "800", color: colors.accent },
});
