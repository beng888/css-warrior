import React from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native-ui-lib';
import { ScrollView } from 'react-native';
import { battleImages, battleTitles } from 'src/static/battles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from 'App';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParams, 'Home'>;

export default function Battles({ close, ...props }: ViewProps & { close?(): void }) {
  const navigation: Props['navigation'] = useNavigation();

  return (
    <View center height="100%" {...props}>
      <View paddingV-8 row center width="100%">
        <Text text50>choose an image</Text>
        {!!close && (
          <Ionicons
            onPress={close}
            name="close"
            size={24}
            color="black"
            style={{ position: 'absolute', right: 10 }}
          />
        )}
      </View>
      <ScrollView>
        {Object.keys(battleImages).map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => navigation.navigate('Studio', { item: item })}
          >
            <View>
              <View>
                <Image
                  source={battleImages[item]}
                  style={{ maxWidth: '100%' }}
                  resizeMode="contain"
                />
              </View>
              <View absT br60 backgroundColor="black" paddingH-8 paddingV-2 margin-4>
                <Text text70 white>
                  #{item} {battleTitles[item]}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* <FlatList
        data={Object.keys(battleImages)}
        renderItem={({ item }: { item: string }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Studio', { item: item })}>
            <View>
              <View>
                <Image
                  source={battleImages[item]}
                  style={{ maxWidth: '100%' }}
                  resizeMode="contain"
                />
              </View>
              <View absT br60 backgroundColor="black" paddingH-8 paddingV-2 margin-4>
                <Text text70 white>
                  #{item} {battleTitles[item]}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      /> */}
    </View>
  );
}
