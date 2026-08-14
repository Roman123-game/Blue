import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container:{
    justifyContent:"center",
    alignItems:"center",
  },


  ring:{
    position:"absolute",
    borderWidth:2,
    borderColor:"#00ff88",
    opacity:0.35,
  },


  car:{
    backgroundColor:"#1976d2",
    position:"absolute",
    justifyContent:"center",
    alignItems:"center",
  },


  windshield:{
    position:"absolute",
    backgroundColor:"#90caf9",
    borderRadius:10,
  },


  windowBack:{
    position:"absolute",
    backgroundColor:"#64b5f6",
    borderRadius:10,
  },


  wheel:{
    position:"absolute",
    width:10,
    height:35,
    backgroundColor:"#111",
    borderRadius:8,
  },


  frontLeft:{
    left:-8,
    top:15,
  },

  frontRight:{
    right:-8,
    top:15,
  },


  backLeft:{
    left:-8,
    bottom:15,
  },

  backRight:{
    right:-8,
    bottom:15,
  },


  lightFrontLeft:{
    position:"absolute",
    top:5,
    left:10,
    width:15,
    height:8,
    backgroundColor:"#fff",
    borderRadius:5,
  },


  lightFrontRight:{
    position:"absolute",
    top:5,
    right:10,
    width:15,
    height:8,
    backgroundColor:"#fff",
    borderRadius:5,
  },

});

export default styles;