import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";

import styles from "./CarTopView.styles";
import DraggableDot from "./DraggableDot";
import DistanceAlert from "./DistanceAlert"
import { rssiToDistance } from "../utils/rssiToDistance";

export interface Point {
  x: number;
  y: number;
}

interface Props {
  size?: number;
  carScale?: number;
  rssi?: number | null;
}


export default function CarTopView({
  size = 220,
  carScale = 0.65,
  rssi,
}: Props) {

  

  const radarSize = size * 1.7;

  const center = radarSize / 2;

  const carPosition: Point = {
    x: center,
    y: center,
  };


  const [dotPosition, setDotPosition] = useState<Point>(carPosition);
  const innerRingOpacity = useRef(new Animated.Value(0.35)).current;
  const secondRingOpacity = useRef(new Animated.Value(0.35)).current;
  const middleRingOpacity = useRef(new Animated.Value(0.35)).current;
  const outerRingOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulseRing = (opacity: Animated.Value) => Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.35,
        duration: 320,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const pulse = Animated.loop(
      Animated.sequence([
        pulseRing(innerRingOpacity),
        pulseRing(secondRingOpacity),
        pulseRing(middleRingOpacity),
        pulseRing(outerRingOpacity),
      ]),
    );

    pulse.start();

    return () => pulse.stop();
  }, [innerRingOpacity, secondRingOpacity, middleRingOpacity, outerRingOpacity]);

  const distanceMeters = rssi === null || rssi === undefined ? 0 : rssiToDistance(rssi);

  const maxDistanceMeters = 10;
  const clampedDistanceMeters = Math.min(Math.max(distanceMeters, 0), maxDistanceMeters);
  const targetDistance = (radarSize / 2) * (clampedDistanceMeters / maxDistanceMeters);
  const angle = Math.PI / 4;
  const computedDotPosition: Point = {
    x: carPosition.x + Math.cos(angle) * targetDistance,
    y: carPosition.y + Math.sin(angle) * targetDistance,
  };

  const activeDotPosition = dotPosition.x === carPosition.x && dotPosition.y === carPosition.y
    ? computedDotPosition
    : dotPosition;

  return (
    <View
      style={[
        styles.container,
        {
          width: radarSize,
          height: radarSize,
        },
      ]}
    >

      {/* Radar Outer Ring */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          {
            width: radarSize,
            height: radarSize,
            borderRadius: radarSize / 2,
            borderWidth: radarSize * 0.125,
            opacity: outerRingOpacity.interpolate({
              inputRange: [0.35, 1],
              outputRange: [0, 0.22],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: radarSize,
            height: radarSize,
            borderRadius: radarSize / 2,
          },
        ]}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          {
            width: radarSize * 0.75,
            height: radarSize * 0.75,
            borderRadius: radarSize * 0.375,
            borderWidth: radarSize * 0.125,
            opacity: middleRingOpacity.interpolate({
              inputRange: [0.35, 1],
              outputRange: [0, 0.22],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: radarSize * 0.75,
            height: radarSize * 0.75,
            borderRadius: radarSize * 0.375,
          },
        ]}
      />


      {/* Radar Middle Ring */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          {
            width: radarSize * 0.5,
            height: radarSize * 0.5,
            borderRadius: radarSize * 0.25,
            borderWidth: radarSize * 0.125,
            opacity: secondRingOpacity.interpolate({
              inputRange: [0.35, 1],
              outputRange: [0, 0.22],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: radarSize * 0.5,
            height: radarSize * 0.5,
            borderRadius: radarSize * 0.25,
          },
        ]}
      />


      {/* Radar Inner Ring */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          styles.innerFill,
          {
            width: radarSize * 0.25,
            height: radarSize * 0.25,
            borderRadius: radarSize * 0.125,
            opacity: innerRingOpacity.interpolate({
              inputRange: [0.35, 1],
              outputRange: [0, 0.22],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: radarSize * 0.25,
            height: radarSize * 0.25,
            borderRadius: radarSize * 0.125,
          },
        ]}
      />


      {/* Car Body */}
      <View
        style={[
          styles.car,
          {
            width: size * 0.55 * carScale,
            height: size * carScale,
            borderRadius: size * 0.12 * carScale,
          },
        ]}
      >

        {/* Front Windshield */}
        <View
          style={[
            styles.windshield,
            {
              width: size * 0.32 * carScale,
              height: size * 0.22 * carScale,
              top: size * 0.18 * carScale,
            },
          ]}
        />


        {/* Rear Window */}
        <View
          style={[
            styles.windowBack,
            {
              width: size * 0.32 * carScale,
              height: size * 0.22 * carScale,
              bottom: size * 0.18 * carScale,
            },
          ]}
        />


        {/* Wheels */}
        <View style={[styles.wheel, styles.frontLeft]} />
        <View style={[styles.wheel, styles.frontRight]} />

        <View style={[styles.wheel, styles.backLeft]} />
        <View style={[styles.wheel, styles.backRight]} />


        {/* Lights */}
        <View style={styles.lightFrontLeft} />
        <View style={styles.lightFrontRight} />


      </View>


      {/* Draggable Target */}
      <DraggableDot
        initialPosition={activeDotPosition}
        onMove={setDotPosition}
        draggable={false}
      />


      <DistanceAlert
        distanceMeters={distanceMeters}
      />


    </View>
  );
}