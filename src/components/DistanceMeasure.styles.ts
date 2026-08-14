import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  row: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginRight: 8,
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },

});

export default styles;