import React from "react";
import {
  View,
  Text,
  StyleSheet
} from "react-native";
import { useThemeColors } from "../theme";
interface Props{
connected:boolean;
}
export default function ConnectionStatus({
connected
}:Props){
const colors = useThemeColors();
return (
<View style={styles.container}>
<View
style={[
styles.dot,
{
backgroundColor:
connected
?
"#22c55e"
:
"#ef4444"
}
]}
/>
<Text style={[styles.text, { color: colors.textPrimary }]}>
{
connected
?
"Connected"
:
"Disconnected"
}
</Text>
</View>
);
}
const styles =
StyleSheet.create({
container:{
flexDirection:"row",
alignItems:"center",
marginVertical:10
},
dot:{
width:12,
height:12,
borderRadius:6,
marginRight:8
},
text:{
fontSize:16,
fontWeight:"600"
}
});