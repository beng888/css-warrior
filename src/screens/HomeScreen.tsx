import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from 'App';
import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { Dimensions, FlatList, Pressable, Image } from 'react-native';
import { battleImages, battleTitles } from 'src/static/battles';
import { TouchableHighlight } from 'react-native-gesture-handler';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParams, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View center height="100%">
      <View paddingV-12>
        <Text text40>Choose a Battle</Text>
      </View>

      <FlatList
        data={Object.keys(battleImages)}
        renderItem={({ item }: { item: string }) => (
          <TouchableHighlight onPress={() => navigation.navigate('Studio', { item: item })}>
            <View>
              <Image
                source={battleImages[item]}
                style={{ maxWidth: WINDOW_WIDTH }}
                resizeMode="cover"
              />
              <View absT br60 backgroundColor="black" paddingH-8 paddingV-2 margin-4>
                <Text text70 white>
                  #{item} {battleTitles[item]}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
}
