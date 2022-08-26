import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type BottomSheetProps = {
  children?: React.ReactNode;
};

export type BottomSheetRefProps = {
  setOpen: (bool: boolean) => void;
  isOpen: () => boolean;
};

const AppBottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(({ children }, ref) => {
  const context = useSharedValue({ y: 0 });
  const open = useSharedValue(false);
  const y = useSharedValue(0);
  const childHeight = useSharedValue(0);

  const setOpen = useCallback((bool: boolean) => {
    'worklet';
    open.value = bool;
    y.value = withSpring(bool ? -childHeight.value : 0, { damping: 50 });
  }, []);
  const isOpen = useCallback(() => open.value, []);
  useImperativeHandle(ref, () => ({ setOpen, isOpen }), [setOpen, isOpen]);

  // useEffect(() => {
  //   console.log({ open: open.value });
  //   if (open.value) y.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 });
  // }, [open.value]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: y.value };
    })
    .onUpdate((event) => {
      console.log({ y: y.value, SCREEN_HEIGHT });
      y.value = event.translationY + context.value.y;
      y.value = Math.max(y.value, -SCREEN_HEIGHT);
    })
    .onEnd(() => {
      // console.log('%c⧭', 'color: #ffa640', { y: y.value, SCREEN_HEIGHT: -SCREEN_HEIGHT / 3 });
      if (y.value > Math.min(-childHeight.value / 3, -200)) {
        setOpen(false);
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

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          { zIndex: 1200, top: SCREEN_HEIGHT, height: SCREEN_HEIGHT, width: '100%' },
          // { borderTopLeftRadius: 25, borderTopRightRadius: 25 },
          { position: 'absolute', backgroundColor: 'white' },
          rBottomSheetStyle,
        ]}
      >
        <View width={75} height={4} bg-grey30 marginV-15 br40 style={{ alignSelf: 'center' }} />
        <View
          onLayout={(event) => {
            childHeight.value = event.nativeEvent.layout.height;
          }}
        >
          {children}
        </View>
      </Animated.View>
    </GestureDetector>
  );
});

export default AppBottomSheet;
