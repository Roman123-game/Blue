import React from "react";
import {
 View,
 Text,
 StyleSheet
} from "react-native";


interface Props{
 rssi:number|null;
}


export default function SignalIndicator({
 rssi
}:Props){


return (

<View style={styles.box}>

<Text>
Signal:
</Text>

<Text style={styles.value}>
{
 rssi ?? "Unknown"
}
</Text>


</View>

);

}


const styles=StyleSheet.create({

box:{
 marginTop:10
},

value:{
 fontSize:18,
 fontWeight:"bold"
}

});