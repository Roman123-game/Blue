import React, { useMemo, useState } from 'react';
import {
  BackHandler,
  Modal,
  NativeModules,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import createStyles from './ExitButton.styles';
import { useThemeColors } from '../theme';

/**
 * X button shown on every level. Pressing it opens a popup asking the user
 * whether they want to leave or stay. Pressing "Exit" completely closes the
 * app on Android (via the AppExit native module, which removes the task from
 * the recents screen and kills the process), while pressing "Stay" just
 * dismisses the popup.
 */
export default function ExitButton() {
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleLeave = () => {
    setVisible(false);
    // iOS does not allow the app to be closed programmatically, so this
    // gracefully does nothing there.
    if (Platform.OS !== 'android') {
      return;
    }
    // The native AppExit module closes the app completely (finishAndRemoveTask
    // + process kill). BackHandler.exitApp() only triggers the default back
    // press, which on several launchers simply backgrounds ("minimizes") the
    // app, so prefer the native module and keep exitApp as a fallback.
    const AppExit = NativeModules.AppExit;
    if (AppExit?.exitApp) {
      AppExit.exitApp();
    } else {
      BackHandler.exitApp();
    }
  };

  return (
    <>
      <TouchableOpacity
        accessible
        accessibilityLabel="Exit app"
        style={[styles.xButton, { top: insets.top + 12 }]}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.xText}>x</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Leave app?</Text>
            <Text style={styles.dialogMessage}>
              Are you sure you want to leave? Your connection will be closed.
            </Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                accessible
                accessibilityLabel="Stay"
                style={styles.stayButton}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.stayButtonText}>Stay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessible
                accessibilityLabel="Exit"
                style={styles.leaveButton}
                onPress={handleLeave}
              >
                <Text style={styles.leaveButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}