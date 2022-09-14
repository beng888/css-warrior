import React, { useState } from 'react';
import { Text, View } from 'react-native-ui-lib';
import { battleColors, battleTitles } from 'src/static/battles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { setStringAsync } from 'expo-clipboard';
import { Toast } from 'react-native-ui-lib/src/incubator';

interface Props {
  item: string;
  imageHeight: number;
  imageWidth: number;
}

const copyToClipboard = async (str: string) => {
  await setStringAsync(str);
};

export default function Details({ item, imageHeight, imageWidth }: Props) {
  const [color, setColor] = useState<string | null>(null);

  return (
    <View paddingH-10 row>
      <View flexG>
        <Text text60>{battleTitles[item]} </Text>
        <View paddingT-10>
          <Text text70>height: {imageHeight} px </Text>
          <Text text70>width: {imageWidth} px</Text>
        </View>
      </View>
      <View br40 style={{ borderWidth: 1, borderColor: 'black', borderStyle: 'dashed' }} padding-10>
        <Text text60>colors to use:</Text>
        {battleColors[item]?.map((color) => (
          <Pressable
            key={color}
            style={{ marginTop: 10 }}
            onPress={() => {
              copyToClipboard(color);
              setColor(color);
            }}
          >
            <View br20 row spread paddingH-4 style={{ borderWidth: 1, borderColor: color }}>
              <Text
                text60
                style={[
                  { color, textShadowColor: 'rgba(0, 0, 0, 0.75)', paddingTop: 3 },
                  { textShadowRadius: 1, textShadowOffset: { width: -0.5, height: 0.5 } },
                ]}
              >
                {color}
              </Text>
              <MaterialCommunityIcons
                style={{ marginLeft: 4 }}
                name="clipboard-edit-outline"
                size={24}
                color="black"
              />
            </View>
          </Pressable>
        ))}
      </View>
      <Toast
        visible={color !== null}
        position={'top'}
        autoDismiss={2500}
        onDismiss={() => setColor(null)}
        message={color && `${color} copied to clipboard`}
        centerMessage
        swipeable
        enableHapticFeedback
        preset="success"
        containerStyle={{ width: 290 }}
      />
    </View>
  );
}
