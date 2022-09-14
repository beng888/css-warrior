import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { Text, View } from 'react-native-ui-lib';
import { Dimensions, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

type DrawerProps = {
  children?: React.ReactNode;
  visible?: boolean;
  onClose?(): void;
  noBackdrop?: boolean;
};

export type DrawerRefProps = {
  setOpen: (bool: boolean) => void;
  isOpen: () => boolean;
};
const AppDrawer = forwardRef<DrawerRefProps, DrawerProps>(
  ({ children, visible = false, onClose, noBackdrop }, ref) => {
    const x = useSharedValue<number>(0);
    const open = useSharedValue(visible);
    const childWidth = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: x.value }],
    }));

    const setOpen = useCallback((bool: boolean) => {
      ('worklet');
      open.value = bool;
      x.value = withTiming(bool ? Math.max(-WINDOW_WIDTH, -childWidth.value) : 0);

      if (!bool) onClose?.();
    }, []);

    const isOpen = useCallback(() => open.value, []);

    useImperativeHandle(ref, () => ({ setOpen, isOpen }), [setOpen, isOpen]);

    const rBackDropStyle = useAnimatedStyle(() => ({
      opacity: withTiming(open.value ? 0.5 : 0),
    }));

    useEffect(() => {
      setOpen(visible);
    }, [visible]);

    return (
      <>
        {!noBackdrop && (
          <Pressable
            style={{ zIndex: 1200, position: 'absolute' }}
            pointerEvents={visible ? 'auto' : 'none'}
            onPress={() => setOpen(false)}
          >
            <Animated.View
              pointerEvents={visible ? 'auto' : 'none'}
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
            { height: WINDOW_HEIGHT, left: WINDOW_WIDTH, position: 'absolute' },
            { backgroundColor: 'gray', zIndex: 9999 },
            animatedStyle,
          ]}
        >
          <View
            onLayout={(event) => {
              childWidth.value = event.nativeEvent.layout.width;
            }}
          >
            {children}
          </View>
        </Animated.View>
      </>
    );
  },
);

export default AppDrawer;
