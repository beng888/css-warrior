import React from 'react';
import { Text, View, ViewProps } from 'react-native-ui-lib';
import { Assets } from 'react-native-ui-lib';
import { useCanvasStore } from 'src/store';
import CanvasDiv from './CanvasDiv';

Assets.loadAssetsGroup('battle', {
  battle1: require('assets/battle/1.png'),
});

export default function Canvas({ ...props }: ViewProps) {
  const { body } = useCanvasStore();

  return (
    <View {...props}>
      {body.size > 0 ? (
        <View>
          {Array.from(body).map(([key, value]) => (
            <CanvasDiv key={key} id={key} value={value} />
          ))}
        </View>
      ) : (
        <View center flexG>
          <Text>No Available Image </Text>
        </View>
      )}
    </View>
  );
}
