import React, { useMemo } from "react";
import { View, Text } from 'react-native';
import createStyles from './BatteryIndicator.styles';
import { useThemeColors } from '../theme';
import GaugeIcon from './GaugeIcon';


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

<View style={styles.labelRow}>
<GaugeIcon
  name="battery"
  color={colors.textSecondary}
  backgroundColor={colors.gaugeCard}
/>
<Text style={styles.label}>Battery:</Text>
</View>

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
 