import { ActionSheet, GridList, View } from 'react-native-ui-lib';
import * as viewStyles from 'src/static/styles';
import StyleSheet from './StyleSheet';
import BodyDiv from './BodyDiv';
import { useCanvasStore } from 'src/store';
import AppButton from 'src/components/AppButton';

export default function Body({ ...props }) {
  const { body, addFirstDiv, setActiveDivId, setActiveDivIds, activeDivId, activeDivIds } =
    useCanvasStore();

  const resetActiveDiv = () => {
    setActiveDivId(null);
    setActiveDivIds([]);
  };

  return (
    <View {...props}>
      {body.size > 0 ? (
        <View paddingV-40>
          {Array.from(body).map(([key, value]) => (
            <BodyDiv key={key} id={key} value={value} />
          ))}
        </View>
      ) : (
        <View center flexG>
          <AppButton onPress={() => addFirstDiv()} label="Click here to add your first div!" />
        </View>
      )}
      <ActionSheet
        renderTitle={() => (
          <GridList
            data={Object.entries({ ...viewStyles, close: {} })}
            renderItem={({ item }) => <StyleSheet key={item[0]} item={item} />}
            inverted
            numColumns={3}
            maxItemWidth={140}
            itemSpacing={0}
          />
        )}
        // visible={activeDivId}
        onDismiss={() => resetActiveDiv()}
        destructiveButtonIndex={0}
      />
    </View>
  );
}
