import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "salmon",
    borderWidth: 3,
    borderColor: "#ffffff",
    marginLeft: -15,
    marginTop: -15,
    zIndex: 999,
    elevation: 6,
    shadowColor: "#10243b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default styles;