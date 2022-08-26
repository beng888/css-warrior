import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Colors, Text, View } from 'react-native-ui-lib';
import Body from './body';
import Canvas from './canvas';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
  interpolateColor,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

export default function Test({ ...props }) {
  const opacity = useSharedValue(0);
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      touchX.value = event.translationX;
      touchY.value = event.translationY;
    },
    onEnd: () => {
      touchX.value = withSpring(0);
      touchY.value = withSpring(0);
    },
  });

  const scrollViewAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollY.value,
      [-50, 0, 50],
      ['rgb(10,10,10)', 'rgb(255,255,255)', 'rgb(10,10,10)'],
    ),
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: touchX.value },
      { translateY: touchY.value },
      { scale: interpolate(opacity.value, [0, 1], [0.5, 1]) },
    ],
  }));

  const scrollHandler = useAnimatedScrollHandler((event) => {
    console.log('%c⧭', 'color: #408059', { event });
    scrollY.value = event.contentOffset.y;
  });

  useEffect(() => {
    opacity.value = withSequence(withSpring(1), withSpring(0.5), withSpring(1));
  }, []);

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.circle, animatedStyle]}>
        <View center flexG>
          <Pressable onPress={() => console.log('pressed')}>
            <Text>TEXT</Text>
          </Pressable>
        </View>
      </Animated.View>
    </PanGestureHandler>
    // <Animated.ScrollView
    //   onScrollBeginDrag={() => console.log('begin drag')}
    //   onScroll={scrollHandler}
    //   scrollEventThrottle={16}
    //   style={[{ height: '100%', width: '100%' }, scrollViewAnimatedStyle]}
    //   contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
    // >
    //   {/* <Animated.View style={[styles.circle, animatedStyle]} /> */}

    //   <View height={1000} center flexG>
    //     <PanGestureHandler onGestureEvent={gestureHandler}>
    //       <Animated.View style={[styles.circle, animatedStyle]}>
    //         <View center flexG>
    //           <Pressable onPress={() => console.log('pressed')}>
    //             <Text>TEXT</Text>
    //           </Pressable>
    //         </View>
    //       </Animated.View>
    //     </PanGestureHandler>
    //   </View>
    // </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 100,
    backgroundColor: 'magenta',
    height: 100,
    width: 100,
  },
});
