import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Platform,
  Text,
  TouchableOpacity,
  Vibration,
} from "react-native";

import styles from "./DistanceAlert.styles";


interface Props {
  distanceMeters: number;
  limit?: number;
}


export default function DistanceAlert({
  distanceMeters,
  limit = 2,
}: Props) {


  const [dismissed, setDismissed] = useState(false);


  const scale = useRef(
    new Animated.Value(1)
  ).current;




  const isDanger =
    distanceMeters > limit;

  function startVibration() {
    if (Platform.OS === "web") {
      return;
    }

    if (typeof Vibration?.vibrate === "function") {
      Vibration.vibrate([1000, 1000, 1000], true);
    }
  }

  function stopVibration() {
    if (typeof Vibration?.cancel === "function") {
      Vibration.cancel();
    }
  }


  useEffect(() => {


    if (isDanger && !dismissed) {
      startVibration();

      const animation = Animated.loop(
        Animated.sequence([

          Animated.timing(scale, {
            toValue: 1.15,
            duration: 400,
            useNativeDriver: true,
          }),


          Animated.timing(scale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),

        ])
      );


      animation.start();


      return () => {
        animation.stop();
        stopVibration();
      };

    }

    stopVibration();
    scale.setValue(1);


  }, [
    isDanger,
    dismissed,
    scale,
  ]);



  function resetAlert() {

    setDismissed(true);
    stopVibration();
    scale.setValue(1);

  }



  // reset automatically when distance is safe again
  useEffect(() => {

    if (!isDanger) {
      setDismissed(false);
    }

  }, [
    isDanger,
  ]);



  if (!isDanger || dismissed) {
    return null;
  }



  return (

    <Animated.View
      style={[
        styles.alert,
        {
          transform:[
            {
              scale,
            },
          ],
        },
      ]}
    >

      <Text style={styles.title}>
        ⚠ WARNING ⚠
      </Text>


      <Text style={styles.message}>
       CHILD IN CAR
      </Text>


      <Text style={styles.distance}>
        Distance {distanceMeters.toFixed(2)} m
      </Text>



      <TouchableOpacity
        style={styles.button}
        onPress={resetAlert}
      >

        <Text style={styles.buttonText}>
          RESET
        </Text>

      </TouchableOpacity>


    </Animated.View>

  );
}