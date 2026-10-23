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
  const driveProgress = useRef(new Animated.Value(0)).current;
  const cloudProgress = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const innerRingOpacity = useRef(new Animated.Value(0.35)).current;
  const secondRingOpacity = useRef(new Animated.Value(0.35)).current;
  const middleRingOpacity = useRef(new Animated.Value(0.35)).current;
  const outerRingOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const drive = Animated.loop(
      Animated.timing(driveProgress, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    drive.start();

    return () => drive.stop();
  }, [driveProgress]);

  useEffect(() => {
    const clouds = cloudProgress.map((progress, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 650),
          Animated.timing(progress, {
            toValue: 1,
            duration: 2600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(progress, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    clouds.forEach(cloud => cloud.start());

    return () => clouds.forEach(cloud => cloud.stop());
  }, [cloudProgress]);

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

      {[center - 16, center - 2, center + 12].map(left => (
        <Animated.View
          key={left}
          pointerEvents="none"
          style={[
            styles.motionTrail,
            {
              left,
              top: center + (size * carScale) / 2 + 8,
              opacity: driveProgress.interpolate({
                inputRange: [0, 0.35, 1],
                outputRange: [0, 0.65, 0],
              }),
              transform: [
                {
                  translateY: driveProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-12, 16],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

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

      {cloudProgress.map((progress, index) => {
        const cloud = [
          { left: center - 54, width: 44 },
          { left: center + 20, width: 48 },
          { left: center - 28, width: 40 },
        ][index];

        return (
          <Animated.View
            key={index}
            pointerEvents="none"
            style={[
              styles.cloud,
              {
                left: cloud.left,
                width: cloud.width,
                opacity: progress.interpolate({
                  inputRange: [0, 0.12, 0.78, 1],
                  outputRange: [0, 0.48, 0.48, 0],
                }),
                transform: [
                  {
                    translateY: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-24, radarSize + 24],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={[styles.cloudBody, { width: cloud.width }]} />
            <View style={[styles.cloudPuff, styles.cloudPuffOffset]} />
            <View style={[styles.cloudPuffLarge, styles.cloudPuffLargeOffset]} />
            <View style={[styles.cloudPuff, { left: cloud.width - 19 }]} />
          </Animated.View>
        );
      })}

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