import 'react-native-url-polyfill/auto';
// import AndroidSafeArea from 'src/layouts/AndroidSafeArea';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native-ui-lib';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudioScreen from 'src/screens/studio';
import Battles from 'src/modules/Battles';

export type RootStackParams = {
  Home: undefined;
  Studio: {
    item: string;
  };
};

export default function App() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

  // const [session, setSession] = useState<Session | null>(null);

  // useEffect(() => {
  //   setSession(supabase.auth.session());
  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });
  // }, []);

  const Stack = createNativeStackNavigator<RootStackParams>();

  return (
    <GestureHandlerRootView>
      <View height={'100%'}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
          >
            <Stack.Screen name="Home" component={Battles} />
            <Stack.Screen name="Studio" component={StudioScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}
