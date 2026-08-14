import React from "react";
import { View, Text } from 'react-native';
import styles from './BatteryIndicator.styles';


interface Props {
  battery: number | null;
  style?: any;
}

export default function BatteryIndicator({
  battery,
  style,
}: Props) {

return (

<View style={[styles.container, style]}>

<Text>
Battery:
</Text>

<Text style={styles.value}>
{
 battery === null
 ? "Not available"
 : `${battery}%`
}
</Text>

</View>

);

}
 