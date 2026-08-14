import React, { useState } from "react";
import { View } from "react-native";

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
      <View
        style={[
          styles.ring,
          {
            width: radarSize,
            height: radarSize,
            borderRadius: radarSize / 2,
          },
        ]}
      />


      {/* Radar Middle Ring */}
      <View
        style={[
          styles.ring,
          {
            width: radarSize * 0.7,
            height: radarSize * 0.7,
            borderRadius: radarSize * 0.35,
          },
        ]}
      />


      {/* Radar Inner Ring */}
      <View
        style={[
          styles.ring,
          {
            width: radarSize * 0.4,
            height: radarSize * 0.4,
            borderRadius: radarSize * 0.2,
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