import React from 'react';
import { ViewProps } from 'react-native';
import { View } from 'react-native-ui-lib';

interface Props extends ViewProps {
  id: string;
  value: DivMapValue;
  ids?: string[];
}

export default function CanvasDiv({ value, id, ids = [] }: Props) {
  const { children, name, ...styles } = value;
  const hasChildren = children.size > 0;

  return (
    <View style={styles}>
      {hasChildren &&
        Array.from(children as DivMap).map(([key, value]) => (
          <CanvasDiv key={key} id={key} value={value} ids={ids} />
        ))}
    </View>
  );
}
