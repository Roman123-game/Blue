// src/styles.ts

import { StyleSheet } from "react-native";

export const colors = {
  background: "#111111",
  card: "#222222",

  white: "#ffffff",
  textSecondary: "#aaaaaa",

  green: "#00ff66",
  radar: "#00ff88",

  yellow: "#ffee00",
  orange: "#ff9900",
  red: "#ff3030",

  border: "#333333",
};


export const commonStyles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    paddingTop: 25,
  },


  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    marginLeft:"auto",
    marginRight:"auto",
  },


  card: {
    width: "90%",
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
  },


  label: {
    color: colors.textSecondary,
    fontSize: 14,
  },


  value: {
    color: colors.white,
    fontSize: 20,
    marginTop: 5,
    fontWeight: "600",
  },


  center: {
    justifyContent: "center",
    alignItems: "center",
  },


  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },


  button: {
    backgroundColor: colors.green,
    paddingHorizontal: 35,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20,
  },


  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },


});