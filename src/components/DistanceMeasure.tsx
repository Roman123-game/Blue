import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import styles from "./DistanceMeasure.styles";

type Position = {
  x: number;
  y: number;
};

type Props = {
  carPosition: Position;
  dotPosition: Position;
  maxDistance: number;
};


export default function DistanceMeasure({
  carPosition,
  dotPosition,
  maxDistance,
}: Props) {

  const [distance, setDistance] = useState(0);


  useEffect(() => {
    const dx = dotPosition.x - carPosition.x;
    const dy = dotPosition.y - carPosition.y;


    const distanceMeters = Math.sqrt(
      dx * dx + dy * dy
    );


    setDistance(distanceMeters);

  }, [
    carPosition,
    dotPosition,
    maxDistance,
  ]);


  return (
    <Text style={styles.text}>
      Distance: {distance.toFixed(2)} m
    </Text>
  );
}