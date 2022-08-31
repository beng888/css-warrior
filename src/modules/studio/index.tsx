import { Dimensions, ScrollView, Image, Pressable, Keyboard, KeyboardEvent } from 'react-native';
import { View } from 'react-native-ui-lib';
import Body from './body';
import Canvas from './canvas';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Fontisto } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import StyleSheet from './stylesheet';
import { useEffect, useState } from 'react';

const MOVER_SIZE = 80;
const radius = MOVER_SIZE / 2;
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

interface ContextProps {
  moverX: number;
  moverY: number;
  bodyHeight: number;
}

export default function Studio() {
  const image = require('assets/battle/1.png');
  const imageLock = 25;
  const { height: imageHeight, width: imageWidth } = Image.resolveAssetSource(image);
  const scrollX = useSharedValue<number>(0);
  const context = useSharedValue<ContextProps>({ moverX: 0, moverY: 0, bodyHeight: 0 });
  const moverX = useSharedValue<number>(-radius);
  const moverY = useSharedValue<number>(
    imageHeight > WINDOW_HEIGHT ? WINDOW_HEIGHT - radius : imageHeight - radius,
  );
  const keyboardHeight = useSharedValue<number>(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {
        ...context.value,
        moverX: moverX.value,
        moverY: moverY.value,
      };
    })
    .onUpdate((event) => {
      moverX.value = event.translationX + context.value.moverX;
      moverY.value = event.translationY + context.value.moverY;

      if (moverY.value < -radius) {
        moverY.value = -radius;
      }

      if (moverY.value > WINDOW_HEIGHT - radius) {
        moverY.value = WINDOW_HEIGHT - radius;
      }

      if (moverX.value < -radius) {
        moverX.value = -radius;
      }
    })
    .onEnd(() => {
      if (
        moverY.value > imageHeight - (imageLock + radius) &&
        moverY.value < imageHeight + (imageLock - radius)
      ) {
        moverY.value = withSpring(imageHeight - radius);
      }
      if (moverX.value > WINDOW_WIDTH - (radius + imageLock)) {
        moverX.value = withTiming(WINDOW_WIDTH - radius);
      }
      if (moverX.value < radius - imageLock || moverX.value < 0) {
        moverX.value = withTiming(-radius);
      }
    });

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const moverAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: moverX.value }, { translateY: moverY.value - keyboardHeight.value }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    width: moverX.value + radius + scrollX.value,
    minWidth: 0,
  }));

  const bodyAnimatedStyle = useAnimatedStyle(() => ({
    height: WINDOW_HEIGHT - (moverY.value + radius),
  }));

  const toggleKeyboard = (e: KeyboardEvent) => {
    keyboardHeight.value = withTiming(e.endCoordinates.height);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', toggleKeyboard);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', toggleKeyboard);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View flexG>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            { height: MOVER_SIZE, aspectRatio: 1 },
            { alignSelf: 'flex-start', position: 'absolute', zIndex: 1 },
            moverAnimatedStyle,
          ]}
        >
          <Pressable
            android_ripple={{ color: 'grey', radius: 35 }}
            style={[
              { justifyContent: 'center', flex: 1, alignItems: 'center' },
              { borderColor: 'grey', borderWidth: 2, borderRadius: 100 },
            ]}
          >
            <Fontisto name="arrow-move" size={40} color="grey" />
          </Pressable>
        </Animated.View>
      </GestureDetector>

      <ScrollView>
        <Animated.ScrollView
          horizontal
          onScroll={scrollHandler}
          style={{ borderBottomWidth: 1, borderBottomColor: 'grey', borderStyle: 'dashed' }}
        >
          <View>
            <Image source={image} resizeMode="contain" />
          </View>

          <Animated.View
            style={[
              { height: '100%', position: 'absolute', overflow: 'hidden' },
              { borderRightColor: 'red', borderRightWidth: 1 },
              imageAnimatedStyle,
            ]}
          >
            <View bg-white style={{ minWidth: imageWidth }} height="100%">
              <Canvas />
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </ScrollView>

      <Animated.ScrollView
        style={[
          { width: '100%', position: 'absolute', bottom: 0 },
          { borderTopColor: 'grey', borderTopWidth: 1, backgroundColor: 'black' },
          bodyAnimatedStyle,
        ]}
      >
        <Body />
      </Animated.ScrollView>
      <StyleSheet />
    </View>
  );
}
