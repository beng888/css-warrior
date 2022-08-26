import { Dimensions, ScrollView, Image, Pressable } from 'react-native';
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
import AppBottomSheet from 'src/components/AppBottomSheet';
import { useEffect } from 'react';

const MOVER_SIZE = 80;
const radius = MOVER_SIZE / 2;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    imageHeight > SCREEN_HEIGHT ? SCREEN_HEIGHT - radius : imageHeight - radius,
  );

  // useEffect(() => {
  //   moverY.value = withTiming(
  //     imageHeight > SCREEN_HEIGHT ? SCREEN_HEIGHT - radius : imageHeight - radius,
  //   );
  // }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {
        ...context.value,
        moverX: moverX.value,
        moverY: moverY.value,
      };
    })
    .onUpdate((event) => {
      // console.log(event.translationY);
      // console.log('%c⧭', 'color: #e50000', Math.max(moverY.value, -SCREEN_HEIGHT));
      moverX.value = event.translationX + context.value.moverX;
      moverY.value = event.translationY + context.value.moverY;
      // moverY.value = Math.max(moverY.value, -500);

      if (moverY.value < -radius) {
        moverY.value = -radius;
      }

      if (moverY.value > SCREEN_HEIGHT - radius) {
        moverY.value = SCREEN_HEIGHT - radius;
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
      if (moverX.value > SCREEN_WIDTH - (radius + imageLock)) {
        moverX.value = withTiming(SCREEN_WIDTH - radius);
      }
      if (moverX.value < radius - imageLock || moverX.value < 0) {
        moverX.value = withTiming(-radius);
      }
    });

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const moverAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: moverX.value }, { translateY: moverY.value }],
  }));

  const bodyAnimatedStyle = useAnimatedStyle(() => ({
    height: SCREEN_HEIGHT - (moverY.value + radius),
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    width: moverX.value + radius + scrollX.value,
    minWidth: 0,
  }));

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
        <Animated.ScrollView horizontal onScroll={scrollHandler}>
          <Image source={image} resizeMode="contain" />

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
      <AppBottomSheet />
    </View>
  );
}
