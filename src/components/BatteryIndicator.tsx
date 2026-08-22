import React, { useMemo } from "react";
import { View, Text } from 'react-native';
import createStyles from './BatteryIndicator.styles';
import { useThemeColors } from '../theme';


interface Props {
  battery: number | null;
  style?: any;
}

export default function BatteryIndicator({
  battery,
  style,
}: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

return (

<View style={[styles.container, style]}>

<Text style={styles.label}>
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
 