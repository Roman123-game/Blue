import React, { useMemo } from "react";
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
const styles = useMemo(() => createStyles(colors), [colors]);
return (
<View style={styles.container}>
<View
style={[
styles.dot,
{
backgroundColor:
connected
?
colors.accent
:
colors.danger
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
const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
container:{
flexDirection:"row",
alignItems:"center",
paddingHorizontal:10,
paddingVertical:7,
borderRadius:20,
backgroundColor: colors.surfaceElevated,
borderWidth: 1,
borderColor: colors.surfaceBorder,
},
dot:{
width:8,
height:8,
borderRadius:4,
marginRight:7
},
text:{
fontSize:12,
fontWeight:"800",
color: colors.textPrimary,
}
});