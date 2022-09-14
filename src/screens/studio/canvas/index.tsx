import React from 'react';
import { Text, View, ViewProps } from 'react-native-ui-lib';
import { Assets } from 'react-native-ui-lib';
import { useCanvasStore } from 'src/store';
import CanvasDiv from './CanvasDiv';

export default function Canvas({ ...props }: ViewProps) {
  const { body } = useCanvasStore();

  return (
    <View {...props}>
      {body.size > 0 && (
        <View>
          {Array.from(body).map(([key, value]) => (
            <CanvasDiv key={key} id={key} value={value} />
          ))}
        </View>
      )}
    </View>
  );
}
