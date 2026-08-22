import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080c18",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logo: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoEmoji: {
    fontSize: 64,
    marginBottom: 10,
  },

  logoSubText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },

  permissionMessage: {
    width: "90%",
    maxWidth: 400,
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: "#1a2235",
    borderWidth: 1,
    borderColor: "#303b55",
  },

  permissionMessageText: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },

  button: {
    width: "90%",
    maxWidth: 400,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#3478f6",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  }
});

export default styles;
