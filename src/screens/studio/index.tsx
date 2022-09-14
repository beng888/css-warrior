import { Dimensions, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { Slider, Text, View } from 'react-native-ui-lib';
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
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import BottomActionBar from './BottomActionBar';
import { useCanvasStore } from 'src/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from 'App';
import { battleImages } from 'src/static/battles';
import Settings from './Settings';
import AppBottomSheet from 'src/components/AppBottomSheet';
import Details from './Details';

const MOVER_SIZE = 80;
const radius = MOVER_SIZE / 2;
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

interface ContextProps {
  moverX: number;
  moverY: number;
  bodyHeight: number;
}

type Props = NativeStackScreenProps<RootStackParams, 'Studio'>;

export default function StudioScreen({ navigation, route }: Props) {
  const { params } = route;
  const item = params?.item ?? '1';
  const image = battleImages[item];
  const imageLock = 25;
  const { height: imageHeight, width: imageWidth } = Image.resolveAssetSource(image);
  const scrollX = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(1);
  const context = useSharedValue<ContextProps>({ moverX: 0, moverY: 0, bodyHeight: 0 });
  const moverX = useSharedValue<number>(-radius);
  const moverY = useSharedValue<number>(
    imageHeight > WINDOW_HEIGHT ? WINDOW_HEIGHT - radius : imageHeight - radius,
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loading, setLoading] = useState(true);

  const { setSavedData, isSaveable, save, saveSettings } = useCanvasStore();

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (isSaveable()) {
          e.preventDefault();

          Alert.alert(
            'You have unsaved changes',
            'Do you want to save them before leaving the screen?',
            [
              {
                text: 'Yes',
                style: 'cancel',
                onPress: () => {
                  save(item);
                  navigation.dispatch(e.data.action);
                },
              },
              {
                text: 'Leave without saving',
                style: 'destructive',
                onPress: () => navigation.dispatch(e.data.action),
              },
            ],
            {
              cancelable: true,
            },
          );
        }
      }),
    [navigation],
  );

  useEffect(() => {
    const getSavedData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(item);
        const parsed = jsonValue !== null ? JSON.parse(jsonValue) : null;

        return setSavedData(parsed);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    const getSettings = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('settings');
        const parsed = jsonValue !== null ? JSON.parse(jsonValue) : null;
        if (parsed) {
          saveSettings(parsed);
        }
      } catch (e) {}
    };

    getSettings();
    getSavedData();
  }, [item]);

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
    transform: [{ translateX: moverX.value }, { translateY: moverY.value }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    width: moverX.value + radius + scrollX.value,
    minWidth: 0,
    opacity: opacity.value,
  }));

  const bodyAnimatedStyle = useAnimatedStyle(() => ({
    height: WINDOW_HEIGHT - (moverY.value + radius),
  }));

  return (
    <View flexG>
      {!loading && (
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
              style={[{ justifyContent: 'center', flex: 1, alignItems: 'center' }]}
            >
              <Fontisto name="arrow-move" size={40} color="grey" />
            </Pressable>
          </Animated.View>
        </GestureDetector>
      )}
      <ScrollView>
        <Animated.ScrollView horizontal onScroll={scrollHandler}>
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
        {!loading && (
          <View>
            <Slider
              value={1}
              containerStyle={{ transform: [{ translateY: -14 }] }}
              trackStyle={{ height: 1 }}
              thumbStyle={{ opacity: 0.1 }}
              activeThumbStyle={{ opacity: 1 }}
              minimumValue={0}
              maximumValue={1}
              onValueChange={(val) => {
                opacity.value = val;
              }}
            />
            <Details {...{ item, imageHeight, imageWidth }} />
          </View>
        )}
      </ScrollView>

      <Animated.ScrollView
        style={[
          { width: '100%', position: 'absolute', bottom: 0 },
          { borderTopColor: 'grey', borderTopWidth: 1, backgroundColor: 'black' },
          bodyAnimatedStyle,
        ]}
      >
        {loading ? (
          <View center height={WINDOW_HEIGHT - (moverY.value + radius)} width="100%">
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ) : (
          <ScrollView horizontal>
            <Body />
          </ScrollView>
        )}
      </Animated.ScrollView>
      <StyleSheet />
      {!loading && (
        <BottomActionBar
          setOpenDrawer={() => setOpenDrawer(!openDrawer)}
          {...{ openDrawer, item }}
        />
      )}

      <AppBottomSheet visible={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Settings />
      </AppBottomSheet>
    </View>
  );
}
