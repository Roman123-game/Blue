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

  // logoEmoji: {
  //   fontSize: 64,
  //   marginBottom: 10,
  // },

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

  googleButton: {
    width: "90%",
    maxWidth: 400,
    height: 54,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dadce0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  enterButton: {
    width: "90%",
    maxWidth: 400,
    height: 54,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: "#3478f6",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  googleIcon: {
    color: "#4285f4",
    fontSize: 20,
    fontWeight: "700",
  },

  googleButtonText: {
    color: "#202124",
    fontSize: 16,
    fontWeight: "600",
  },

  enterButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  logoImage: {
    width: 240,
    height: 240,
    marginBottom: 12,
     borderRadius: 25,
  }
});

export default styles;
