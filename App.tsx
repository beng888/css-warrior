import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';

import { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';
import Canvas from 'src/modules/studio';
import Auth from 'src/modules/Auth';
import AndroidSafeArea from 'src/layouts/AndroidSafeArea';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View } from 'react-native-ui-lib';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Provider } from 'jotai';

export default function App() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AndroidSafeArea>
      <GestureHandlerRootView>
        <View height={'100%'}>
          <Provider>
            <Canvas />
          </Provider>
        </View>
        {/* <View height={'100%'}>{session && session.user ? <Canvas /> : <Auth />}</View> */}
      </GestureHandlerRootView>
    </AndroidSafeArea>
  );
}
