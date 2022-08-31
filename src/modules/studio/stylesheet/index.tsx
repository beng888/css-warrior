import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { ExpandableSection, Text, View } from 'react-native-ui-lib';
// import { activeDivIdAtom, styleSheetOpenAtom } from 'src/atoms/StudioAtoms';
import AppBottomSheet, { BottomSheetRefProps } from 'src/components/AppBottomSheet';
import viewStyles from 'src/static/viewStyles';
// import { useStudioContext } from '../StudioContextProvider';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import StyleInput from './StyleInput';
import { useAppStore, useCanvasStore } from 'src/store';
import { styleSheetOpenAtom } from 'src/atoms/StudioAtoms';
import { Keyboard, KeyboardEvent } from 'react-native';

export default function StyleSheet() {
  // const [styleSheetOpen, setStyleSheetOpen] = useAtom(styleSheetOpenAtom);
  // const [activeDivId] = useAtom(activeDivIdAtom);
  const [expanded, setExpanded] = useState<string | null>(null);
  // const { styleSheetOpen, setStyleSheetOpen } = useAppStore();
  const { styleSheetOpen, setStyleSheetOpen } = useCanvasStore();
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const ref = useRef<BottomSheetRefProps>(null);
  // const flattenedBody = getFlattenedBody();
  // console.log('%c⧭', 'color: #997326', flattenedBody);

  useEffect(() => {
    if (!styleSheetOpen) setExpanded(null);
  }, [styleSheetOpen]);

  const toggleKeyboard = (e: KeyboardEvent) => {
    if (styleSheetOpen) setKeyboardHeight(e.endCoordinates.height);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', toggleKeyboard);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', toggleKeyboard);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const rIconStyle = (key: string) =>
    useAnimatedStyle(() => ({
      transform: [{ rotate: withTiming(expanded === key ? '180deg' : '0deg') }],
    }));

  return (
    <AppBottomSheet onClose={() => setStyleSheetOpen(false)} noBackdrop visible={styleSheetOpen}>
      <View style={{ paddingBottom: keyboardHeight }}>
        {Object.entries(viewStyles).map(([key, value]) => (
          <ExpandableSection
            key={key}
            expanded={expanded === key}
            sectionHeader={
              <View row spread padding-4>
                <Text grey10 text50 style={{ textTransform: 'capitalize' }}>
                  {key}
                </Text>

                <Animated.View style={[rIconStyle(key)]}>
                  <Ionicons name="chevron-down" size={24} color="black" />
                </Animated.View>
              </View>
            }
            onPress={() => {
              setExpanded(expanded === key ? null : key);
            }}
          >
            <View>
              {Object.entries(value).map((_item, index) => (
                <StyleInput category={key} key={index} styleProp={_item} />
              ))}
            </View>
          </ExpandableSection>
        ))}
      </View>
    </AppBottomSheet>
  );
}
