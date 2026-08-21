import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#1f2b4d",
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
  },
  logoEmoji: {
    color: "#1f2b4d",
    fontSize: 48,
    fontWeight: "700",
    textAlign: "center",
  },
  logoSubText: {
    color: "#1f2b4d",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    overflow: "visible",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
