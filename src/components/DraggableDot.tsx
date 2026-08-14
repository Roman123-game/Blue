import React, { useEffect, useRef } from "react";
import {
  Animated,
  PanResponder,
} from "react-native";

import styles from "./DraggableDot.styles";

export interface Point {
  x: number;
  y: number;
}

interface Props {
  initialPosition: Point;
  onMove: (position: Point) => void;
  draggable?: boolean;
}

export default function DraggableDot({
  initialPosition,
  onMove,
  draggable = true,
}: Props) {
  // Stores the current absolute position
  const currentPosition = useRef<Point>({
    x: initialPosition.x,
    y: initialPosition.y,
  });

  // Animated values
  const animatedPosition = useRef(
    new Animated.ValueXY({
      x: initialPosition.x,
      y: initialPosition.y,
    })
  ).current;

  useEffect(() => {
    onMove(currentPosition.current);
  }, [onMove]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => draggable,

      onPanResponderMove: (_, gesture) => {
        if (!draggable) {
          return false;
        }

        const x = currentPosition.current.x + gesture.dx;
        const y = currentPosition.current.y + gesture.dy;

        animatedPosition.setValue({ x, y });

        onMove({ x, y });
      },

      onPanResponderRelease: (_, gesture) => {
        if (!draggable) {
          return false;
        }

        currentPosition.current = {
          x: currentPosition.current.x + gesture.dx,
          y: currentPosition.current.y + gesture.dy,
        };

        animatedPosition.setValue(currentPosition.current);

        onMove(currentPosition.current);
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.dot,
        {
          left: animatedPosition.x,
          top: animatedPosition.y,
        },
      ]}
    />
  );
}