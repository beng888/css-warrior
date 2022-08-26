import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import {
  Hint,
  HintProps,
  Text,
  View,
  ViewProps,
  Colors,
  TouchableOpacity,
  GridList,
} from 'react-native-ui-lib';
import { Ionicons, MaterialCommunityIcons, Octicons, FontAwesome5 } from '@expo/vector-icons';
import useAppStore from 'src/store/useAppStore';
import { useCanvasStore } from 'src/store';
import AppTextField from 'src/components/AppTextField';
import * as viewStyles from 'src/static/styles';
import StyleSheet from './StyleSheet';

type SetOpen = React.Dispatch<React.SetStateAction<boolean>>;

interface HinterProps {
  text: JSX.Element;
  setOpen?: SetOpen;
  content: JSX.Element;
  open?: boolean;
}

const Hinter = ({ text, setOpen, content, open, ...props }: HinterProps & HintProps) => {
  const [focused, setFocused] = useState(false);
  const toggleHint = (bool: boolean) => {
    setFocused(bool);
    setOpen?.(bool);
  };

  useEffect(() => {
    if (open === false) {
      toggleHint(false);
    }
  }, [open]);

  return (
    <Hint
      position="top"
      removePaddings
      style={{ padding: 4 }}
      visible={focused}
      customContent={content}
      useSideTip={false}
      onBackgroundPress={() => toggleHint(false)}
      {...props}
    >
      <TouchableOpacity onPress={() => toggleHint(true)} style={{ zIndex: 999 }}>
        {text}
      </TouchableOpacity>
    </Hint>
  );
};

interface ControlsProps {
  id: string;
  ids: string[];
  setOpen: SetOpen;
  name: string;
}

const Controls = ({ id, ids, setOpen, name }: ControlsProps) => {
  const iconStyles = { size: 40, color: 'white' };
  const { addDiv, editDiv, deleteDiv, duplicateDiv, setActiveDivId, setActiveDivIds } =
    useCanvasStore();
  const { openOverlay } = useAppStore();
  const [addDivName, setAddDivName] = useState<string>('div');
  const [editName, setEditName] = useState<string>(name);
  const isEdited = editName !== name;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View row padding-7 width={200} spread>
        <Octicons
          name="duplicate"
          {...iconStyles}
          onPress={() => {
            duplicateDiv(id, ids, name);
            setOpen(false);
          }}
        />
        <Hinter
          borderRadius={10}
          text={<MaterialCommunityIcons name="view-dashboard-edit-outline" {...iconStyles} />}
          content={
            <View row paddingB-5 width={220}>
              <MaterialCommunityIcons
                name="delete-outline"
                onPress={() => deleteDiv(ids)}
                {...iconStyles}
              />
              <View style={{ flex: 1 }}>
                <AppTextField
                  color="white"
                  value={editName}
                  style={{ fontSize: 30 }}
                  onChangeText={(text: string) => setEditName(text)}
                  maxLength={20}
                />
              </View>
              <Pressable disabled={!isEdited} onPress={() => editDiv(id, ids, { name: editName })}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  {...iconStyles}
                  color={isEdited ? 'white' : 'gray'}
                />
              </Pressable>
            </View>
          }
        />
        <MaterialCommunityIcons
          name="image-edit-outline"
          {...iconStyles}
          onPress={() => {
            setActiveDivId(id);
            setActiveDivIds(ids);
            openOverlay({
              content: (
                <GridList
                  data={Object.entries({ ...viewStyles, close: {} })}
                  renderItem={({ item }) => <StyleSheet key={item[0]} item={item} />}
                  inverted
                  numColumns={3}
                  maxItemWidth={140}
                  itemSpacing={0}
                />
              ),
              id: 'style-sheet',
              type: 'bottom-sheet',
            });
            setOpen(false);
          }}
        />
        <Hinter
          borderRadius={10}
          text={<Octicons name="diff-added" {...iconStyles} />}
          content={
            <View>
              <View paddingH-10>
                <AppTextField
                  color="white"
                  value={addDivName}
                  leadingAccessory={
                    <Text white marginR-5>
                      Insert
                    </Text>
                  }
                  onChangeText={(text: string) => setAddDivName(text)}
                  maxLength={20}
                />
              </View>
              <View row paddingB-5 paddingH-10 width={220} spread>
                {['above', 'inside', 'below'].map((place) => (
                  <Text
                    key={place}
                    white
                    text70
                    onPress={() => {
                      addDiv(id, ids, place as DivPosition, addDivName);
                      setOpen(false);
                    }}
                  >
                    {place}
                  </Text>
                ))}
              </View>
            </View>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

interface Props extends ViewProps {
  id: string;
  value: DivMapValue;
  ids?: string[];
}

export default function BodyDiv({ value, id, ids = [] }: Props) {
  const [hintOpen, setHintOpen] = useState(false);
  const { children, name } = value;
  const hasChildren = children.size > 0;
  ids = [...ids, id];

  return (
    <View paddingL-10>
      <Hinter
        borderRadius={10}
        open={hintOpen}
        setOpen={setHintOpen}
        content={<Controls {...{ id, ids, name: name as string }} setOpen={setHintOpen} />}
        text={
          <Text cyan50 green30={hintOpen} bg-grey70={hintOpen} text70>
            {`<${name}>`}
          </Text>
        }
      />

      {hasChildren &&
        Array.from(children as DivMap).map(([key, value]) => (
          <BodyDiv key={key} id={key} value={value} ids={ids} />
        ))}

      <Hinter
        borderRadius={10}
        open={hintOpen}
        setOpen={setHintOpen}
        text={
          <Text cyan50 green30={hintOpen} bg-grey70={hintOpen} text70>
            {`</${name}>`}
          </Text>
        }
        content={<Controls {...{ id, ids, name: name as string }} setOpen={setHintOpen} />}
      />
    </View>
  );
}
