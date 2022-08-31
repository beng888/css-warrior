import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { Dimensions, Pressable } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { View } from 'react-native-ui-lib';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

type BottomSheetProps = {
  children?: React.ReactNode;
  visible?: boolean;
  onClose?(): void;
  noBackdrop?: boolean;
};

export type BottomSheetRefProps = {
  setOpen: (bool: boolean) => void;
  isOpen: () => boolean;
};

const AppBottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children, visible = false, onClose, noBackdrop }, ref) => {
    const context = useSharedValue({ y: 0 });
    const open = useSharedValue(visible);
    const y = useSharedValue(0);
    const childHeight = useSharedValue(0);
    const sliderHeight = useSharedValue(0);
    const setOpen = useCallback((bool: boolean) => {
      ('worklet');

      open.value = bool;
      y.value = withSpring(
        bool ? Math.max(-WINDOW_HEIGHT, -childHeight.value - sliderHeight.value) : 0,
        {
          damping: 50,
        },
      );

      if (!bool) onClose?.();
    }, []);
    const isOpen = useCallback(() => open.value, []);

    useImperativeHandle(ref, () => ({ setOpen, isOpen }), [setOpen, isOpen]);

    useEffect(() => {
      if (visible) setOpen(true);
    }, [visible]);

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: y.value };
      })
      .onUpdate((event) => {
        // console.log({ y: y.value, WINDOW_HEIGHT });
        y.value = event.translationY + context.value.y;
        y.value = Math.max(y.value, -WINDOW_HEIGHT);
      })
      .onEnd(() => {
        if (y.value > -100) {
          runOnJS(setOpen)(false);
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: y.value }],
      borderRadius: interpolate(
        y.value,
        [-WINDOW_HEIGHT + 50, -WINDOW_HEIGHT],
        [25, 0],
        Extrapolate.CLAMP,
      ),
    }));

    const rBackDropStyle = useAnimatedStyle(() => ({
      opacity: withTiming(open.value ? 0.1 : 0),
    }));

    const rScrollViewStyle = useAnimatedStyle(() => ({
      height: Math.abs(y.value) - sliderHeight.value,
    }));

    return (
      <>
        {!noBackdrop && (
          <Pressable
            style={{ zIndex: 1200, position: 'absolute' }}
            pointerEvents={open.value ? 'auto' : 'none'}
            onPress={() => setOpen(false)}
          >
            <Animated.View
              style={[
                { position: 'absolute', backgroundColor: 'black' },
                { width: WINDOW_WIDTH, height: WINDOW_HEIGHT },
                { zIndex: 1200, position: 'absolute' },
                rBackDropStyle,
              ]}
            />
          </Pressable>
        )}
        <Animated.View
          style={[
            { zIndex: 1200, top: WINDOW_HEIGHT, height: WINDOW_HEIGHT, width: '100%' },
            { position: 'absolute', backgroundColor: 'white' },
            rBottomSheetStyle,
          ]}
        >
          <GestureDetector gesture={gesture}>
            <View
              onLayout={(event) => {
                sliderHeight.value = event.nativeEvent.layout.height;
              }}
              height={32}
              center
              style={{ borderBottomColor: '#ddd', borderBottomWidth: 1 }}
            >
              <View width={75} height={4} bg-grey30 marginV-15 br40 />
              <View absR row width={65} paddingR-10 spread>
                <MaterialCommunityIcons
                  onPress={() => {
                    y.value = withTiming(-WINDOW_HEIGHT);
                  }}
                  name="arrow-expand-up"
                  size={24}
                  color="black"
                />
                <MaterialCommunityIcons
                  {...{ name: 'close', size: 24, color: 'darkred' }}
                  onPress={() => setOpen(false)}
                />
              </View>
            </View>
          </GestureDetector>
          <View>
            <Animated.ScrollView style={[rScrollViewStyle]}>
              <View
                onLayout={(event) => {
                  childHeight.value = event.nativeEvent.layout.height;
                }}
              >
                {children}
              </View>
            </Animated.ScrollView>
          </View>
        </Animated.View>
      </>
    );
  },
);

export default AppBottomSheet;
