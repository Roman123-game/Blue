import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  alert: {
    position: "absolute",
    width: 300,
    height: 220,
    left: "50%",
    top: "50%",
    marginLeft: -150,
    marginTop: -110,
    backgroundColor: "red",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset:{
      width:0,
      height:5,
    },
    shadowOpacity:0.4,
    shadowRadius:10,
  },
  title:{
    color:"white",
    fontSize:32,
    fontWeight:"900",
  },
  message:{
    color:"white",
    fontSize:26,
    fontWeight:"700",
    marginTop:5,
  },
  distance:{
    color:"white",
    fontSize:20,
    marginTop:10,
  },
  button:{
    marginTop:20,
    backgroundColor:"white",
    paddingHorizontal:35,
    paddingVertical:10,
    borderRadius:20,
  },
  buttonText:{
    color:"red",
    fontSize:18,
    fontWeight:"800",
  },
});
export default styles;