import { StyleSheet } from "react-native";
import { ThemeColors } from "../theme";

export default (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: c.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: c.textPrimary,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    gaugeCard: {
      marginTop: -82,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: c.gaugeCard,
      alignItems: "flex-start",
    },
    gaugeLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: c.textSecondary,
      marginBottom: 4,
    },
    gaugeValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: c.textPrimary,
    },
    gaugeSubValue: {
      fontSize: 16,
      fontWeight: "500",
      color: c.textSecondary,
    },
    distanceLabel: {
      fontSize: 12,
      color: c.textMuted,
      marginTop: 4,
    },
    box: {
      marginTop: 20,
      padding: 15,
      borderWidth: 1,
      borderRadius: 12,
    },
    connectedContainer: {
      flex: 1,
      marginTop: 20,
      justifyContent: "space-between",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 12,
      marginTop: -18,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: c.surface,
    },
    strengthWrap: {
      minWidth: 120,
    },

    separator: {
      width: 1,
      height: 40,
      backgroundColor: c.surfaceBorder,
      marginHorizontal: 12,
      alignSelf: "center",
    },

    batteryWrap: {
      marginLeft: 0,
    },
    carWrap: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    bottomRow: {
      alignItems: "center",
      position: "relative",
      bottom: 30,
      zIndex: 10,
    },
    name: {
      fontSize: 18,
      fontWeight: "bold",
      color: c.textPrimary,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 20,
      color: c.textPrimary,
    },
    button: {
      marginTop: 16,
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: c.buttonBg,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: c.buttonText,
      marginTop: -56,
      backgroundColor: "gray",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
    },
  });
