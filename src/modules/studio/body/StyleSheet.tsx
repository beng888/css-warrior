import { useState } from 'react';
import { Pressable } from 'react-native';
import { ActionSheet, ButtonProps, ButtonSize, Colors, Text, View } from 'react-native-ui-lib';
import AppButton from 'src/components/AppButton';
import { useCanvasStore } from 'src/store';
import StyleInput from './StyleInput';

export default function StyleSheet({ item }: { item: [string, string | [] | object] }) {
  const { setActiveDivId, setActiveDivIds, getActiveDiv } = useCanvasStore();
  const [open, setOpen] = useState(false);
  const isCloseButton = item[0] === 'close';
  const activeDiv = getActiveDiv();

  const resetActiveDiv = () => {
    setActiveDivId(null);
    setActiveDivIds([]);
  };

  return (
    <Pressable
      android_ripple={{ color: isCloseButton ? Colors.red80 : Colors.purple70 }}
      onPress={() => {
        if (isCloseButton) return resetActiveDiv();
        setOpen(true);
      }}
    >
      <Text
        style={{
          ...{ color: isCloseButton ? Colors.red30 : Colors.black },
          ...{ textAlign: 'center', paddingVertical: 10, textTransform: 'capitalize' },
        }}
      >
        {item[0]}
      </Text>

      <ActionSheet
        renderAction={(option: ButtonProps, index: number) => (
          <Text key={index}>{option.label}</Text>
        )}
        renderTitle={() => (
          <View>
            {Object.entries(item[1]).map((_item, index) => {
              if (typeof _item[1] === 'object' && !Array.isArray(_item[1]))
                return <StyleSheet key={index} item={_item} />;

              return (
                <StyleInput
                  category={item[0]}
                  activeDiv={activeDiv}
                  key={index}
                  styleProp={_item}
                />
              );
            })}
            <AppButton
              onPress={() => setOpen(false)}
              label="Close"
              activeBackgroundColor={Colors.red80}
              outline
              color={Colors.red10}
              marginH-10
              outlineColor={Colors.red10}
              size={ButtonSize.small}
            />
          </View>
        )}
        visible={open}
        onDismiss={() => resetActiveDiv()}
      />
    </Pressable>
  );
}
