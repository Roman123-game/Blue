import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useThemeColors } from '../theme';
interface Props{onPress:()=>void};

export default function DisconnectButton({onPress}:Props){
const colors = useThemeColors();
return (
<TouchableOpacity
	accessible
	accessibilityRole="button"
	accessibilityLabel="Disconnect from vehicle"
	onPress={onPress}
	style={[styles.button, { borderColor: colors.danger }]}
>
	<Text style={[styles.text, { color: colors.danger }]}>
		Disconnect
	</Text>
</TouchableOpacity>
);
}

const styles = StyleSheet.create({
	button: {
		minWidth: 170,
		paddingVertical: 14,
		paddingHorizontal: 22,
		borderRadius: 14,
		borderWidth: 1,
		alignItems: 'center',
	},
	text: {
		fontSize: 15,
		fontWeight: '800',
	},
});