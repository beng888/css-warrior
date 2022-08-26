import React, { Ref, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView } from 'react-native';
import { Text, View, ViewProps } from 'react-native-ui-lib';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { useAppStore } from 'src/store';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const TestSheet = ({ content, open, id }: Overlay) => {
  const { closeOverlay } = useAppStore();
  const context = useSharedValue({ y: 0 });
  const y = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const ref = useRef<any>(null);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: y.value };
    })
    .onUpdate((event) => {
      y.value = event.translationY + context.value.y;
      y.value = Math.max(y.value, -SCREEN_HEIGHT);
    })
    .onEnd(() => {
      if (y.value > Math.min(-contentHeight.value / 3, -200)) {
        runOnJS(closeOverlay)(id);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    borderRadius: interpolate(
      y.value,
      [-SCREEN_HEIGHT + 50, -SCREEN_HEIGHT],
      [25, 0],
      Extrapolate.CLAMP,
    ),
  }));

  const rBackDropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(open ? 0.1 : 0),
  }));

  useEffect(() => {
    if (open) y.value = withSpring(-contentHeight.value, { damping: 50, mass: 0.1 });
    if (!open) y.value = withSpring(0, { damping: 50, mass: 0.1 });
  }, [open]);

  return (
    <>
      <Pressable style={{ zIndex: 1200, position: 'absolute' }} onPress={() => closeOverlay(id)}>
        <Animated.View
          pointerEvents={open ? 'auto' : 'none'}
          style={[
            { opacity: 0.1, position: 'absolute', backgroundColor: 'black' },
            { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
            { zIndex: 1200, position: 'absolute' },
            rBackDropStyle,
          ]}
        />
      </Pressable>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            { zIndex: 1200, top: SCREEN_HEIGHT, height: SCREEN_HEIGHT, width: '100%' },
            { position: 'absolute', backgroundColor: 'white' },
            rBottomSheetStyle,
          ]}
        >
          <View width={75} height={4} bg-grey30 marginV-15 br40 style={{ alignSelf: 'center' }} />
          <View
            ref={ref}
            style={{ height: 300 }}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              contentHeight.value = height;
              if (open) y.value = withSpring(-height, { damping: 50 });
            }}
          >
            {content}
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export default TestSheet;
