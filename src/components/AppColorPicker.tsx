import React, { useRef, useCallback, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withSpring,
  withTiming,
  interpolateColor,
  runOnJS,
  withDelay,
} from 'react-native-reanimated';

const colors = ['white', 'red', 'purple', 'blue', 'cyan', 'green', 'yellow', 'orange', 'black'];
const width = Dimensions.get('window').width - 40;
const pickerSize = 30;

interface Props {
  submit(v: string, x: number): void;
  setIsLoading(v: boolean): void;
  color: string;
  isLoading: boolean;
  defaultValue: number;
}

export default function AppColorPicker({
  submit,
  color,
  setIsLoading,
  isLoading,
  defaultValue,
}: Props) {
  const x = useSharedValue(defaultValue ?? 0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const internalPickerSize = useSharedValue(pickerSize / 2);
  const context = useSharedValue({ x: 0 });
  const adjustedX = useDerivedValue(() => {
    return Math.min(Math.max(x.value, 0), width - pickerSize);
  });
  const ref = useRef<Animated.View>(null);
  const inputRange = colors.map((_, index) => (index / colors.length) * width);

  const decimalToHexString = (number: any) => {
    if (number < 0) {
      number = 0xffffffff + number + 1;
    }
    const newColor = `#${number.toString(16).substring(2, 8)}`;
    if (color !== newColor) {
      setIsLoading(true);
      setTimeout(() => {
        submit(newColor, x.value);
      }, 500);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [color]);

  const handleEnd = () => {
    ('worklet');
    y.value = withSpring(0);
    scale.value = withSpring(1);
    internalPickerSize.value = withTiming(pickerSize / 2);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: x.value };
      y.value = withSpring(-pickerSize);
      scale.value = withSpring(1.2);
      internalPickerSize.value = withTiming(pickerSize);
    })
    .onUpdate((e) => {
      x.value = e.translationX + context.value.x;
    })
    .onEnd(() => {
      runOnJS(handleEnd)();
      const backgroundColor = interpolateColor(x.value, inputRange, colors);
      runOnJS(decimalToHexString)(backgroundColor);
    });

  const tapGesture = Gesture.Tap()
    .onBegin((e) => {
      y.value = withSpring(-pickerSize);
      scale.value = withSpring(1.2);
      x.value = withTiming(e.absoluteX - pickerSize);
      internalPickerSize.value = withTiming(pickerSize);
    })
    .onEnd((e) => {
      runOnJS(handleEnd)();
      const backgroundColor = interpolateColor(e.absoluteX - pickerSize, inputRange, colors);
      runOnJS(decimalToHexString)(backgroundColor);
    });

  const rPickerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: adjustedX.value }, { translateY: y.value }, { scale: scale.value }],
  }));

  const rInternalPickerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(x.value, inputRange, colors);

    return {
      backgroundColor,
      width: internalPickerSize.value,
      height: internalPickerSize.value,
      borderRadius: internalPickerSize.value / 2,
    };
  });

  return (
    <GestureDetector gesture={isLoading ? Gesture.Tap() : tapGesture}>
      <Animated.View style={{ opacity: isLoading ? 0.5 : 1 }}>
        <GestureDetector gesture={isLoading ? Gesture.Pan() : panGesture}>
          <Animated.View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View width={width}>
              <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: pickerSize, borderRadius: 20 }}
              />
              <Animated.View
                style={[
                  { width: pickerSize, height: pickerSize, borderRadius: pickerSize / 2 },
                  { backgroundColor: 'white', position: 'absolute', bottom: 0 },
                  { alignItems: 'center', justifyContent: 'center' },
                  rPickerStyle,
                ]}
              >
                <Animated.View
                  ref={ref}
                  style={[{ borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)' }, rInternalPickerStyle]}
                />
              </Animated.View>
            </View>
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}
