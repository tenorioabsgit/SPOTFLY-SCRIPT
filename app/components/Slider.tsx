import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { Colors } from '../../src/constants/Colors';

interface SliderProps {
  value: number; // 0 to 1
  onValueChange: (value: number) => void;
}

export default function Slider({ value, onValueChange }: SliderProps) {
  const [width, setWidth] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        setDragging(true);
        const x = evt.nativeEvent.locationX;
        const newVal = Math.max(0, Math.min(1, x / width));
        setDragValue(newVal);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const x = evt.nativeEvent.locationX;
        const newVal = Math.max(0, Math.min(1, x / width));
        setDragValue(newVal);
      },
      onPanResponderRelease: () => {
        setDragging(false);
        onValueChange(dragValue);
      },
    })
  ).current;

  const displayValue = dragging ? dragValue : value;

  return (
    <View
      style={styles.container}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${displayValue * 100}%` }]} />
      </View>
      <View
        style={[
          styles.thumb,
          {
            left: displayValue * width - 6,
            opacity: dragging ? 1 : 0,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    backgroundColor: Colors.inactive,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.textPrimary,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.textPrimary,
    top: 6,
  },
});
