import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';
import Canvas from 'src/modules/studio';
import Auth from 'src/modules/Auth';
import AndroidSafeArea from 'src/layouts/AndroidSafeArea';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native-ui-lib';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useAppStore } from 'src/store';
import AppOverlay from 'src/components/AppOverlay';
import AppButton from 'src/components/AppButton';

export default function App() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  const { overlays, openOverlay } = useAppStore();
  console.log(
    '%c⧭',
    'color: #00b300',
    Object.values(overlays).map((obj) => ({ [obj.id]: obj.open })),
  );
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
          {Object.entries(overlays).map(([key, props]) => (
            <AppOverlay key={key} {...props} />
          ))}

          <AppButton
            label="open overlay 1"
            onPress={() =>
              openOverlay({
                id: 'overlay-1',
                type: 'bottom-sheet',
                content: (
                  <AppButton
                    label="open overlay 2"
                    onPress={() =>
                      openOverlay({
                        id: 'overlay-2',
                        type: 'bottom-sheet',
                        content: (
                          <AppButton
                            label="open overlay 3"
                            onPress={() =>
                              openOverlay({
                                id: 'overlay-3',
                                type: 'bottom-sheet',
                                content: (
                                  <AppButton
                                    label="open overlay 4"
                                    onPress={() =>
                                      openOverlay({
                                        id: 'overlay-4',
                                        type: 'bottom-sheet',
                                        content: <AppButton label="open overlay 5" />,
                                      })
                                    }
                                  />
                                ),
                              })
                            }
                          />
                        ),
                      })
                    }
                  />
                ),
              })
            }
          />
          <AppButton
            label="open overlay 4"
            onPress={() =>
              openOverlay({
                id: 'overlay-4',
                type: 'bottom-sheet',
                content: (
                  <AppButton
                    label="open overlay 5"
                    onPress={() => {
                      console.log('pressed');
                      openOverlay({
                        id: 'overlay-5',
                        type: 'bottom-sheet',
                        content: (
                          <AppButton
                            label="open overlay 6"
                            onPress={() =>
                              openOverlay({
                                id: 'overlay-6',
                                type: 'bottom-sheet',
                                content: <AppButton label="open overlay 7" />,
                              })
                            }
                          />
                        ),
                      });
                    }}
                  />
                ),
              })
            }
          />
          <Canvas />
        </View>
        {/* <View height={'100%'}>{session && session.user ? <Canvas /> : <Auth />}</View> */}
      </GestureHandlerRootView>
    </AndroidSafeArea>
  );
}
