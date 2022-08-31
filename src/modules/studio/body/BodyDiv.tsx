import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Hint, Text, View, ViewProps, TouchableOpacity } from 'react-native-ui-lib';
import AppTextField from 'src/components/AppTextField';
import { useCanvasStore } from 'src/store';

type SetOpen = React.Dispatch<React.SetStateAction<string | null>>;

interface ControlsProps {
  id: string;
  ids: string[];
  setOpen: SetOpen;
  name: string;
}

const hintProps = {
  position: 'top',
  removePaddings: true,
  borderRadius: 10,
  useSideTip: false,
};

const Controls = ({ setOpen, name }: ControlsProps) => {
  const iconStyles = { size: 40, color: 'white' };
  const { addDiv, editDiv, deleteDiv, duplicateDiv, setStyleSheetOpen } = useCanvasStore();
  const [addDivName, setAddDivName] = useState<string>('div');
  const [editName, setEditName] = useState<string>(name);
  const isEdited = editName !== name;
  const positions: DivPosition[] = ['above', 'inside', 'below'];
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isOpeningStyleSheet, setIsOpeningStyleSheet] = useState<boolean>(false);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View row padding-7 width={200} spread>
        <Octicons
          name="duplicate"
          {...iconStyles}
          onPress={() => {
            duplicateDiv(name);
            setOpen(null);
          }}
        />
        <Hint
          {...hintProps}
          visible={editOpen}
          onBackgroundPress={() => setEditOpen(false)}
          customContent={
            <View row paddingB-5 width={220}>
              <MaterialCommunityIcons
                name="delete-outline"
                onPress={() => deleteDiv()}
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
              <Pressable disabled={!isEdited} onPress={() => editDiv({ name: editName })}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  {...iconStyles}
                  color={isEdited ? 'white' : 'gray'}
                />
              </Pressable>
            </View>
          }
        >
          <TouchableOpacity onPress={() => setEditOpen(true)}>
            <MaterialCommunityIcons name="view-dashboard-edit-outline" {...iconStyles} />
          </TouchableOpacity>
        </Hint>
        <MaterialCommunityIcons
          name="image-edit-outline"
          onPress={() => {
            setStyleSheetOpen(true);
            setIsOpeningStyleSheet(true);
          }}
          {...iconStyles}
        />
        <Hint
          {...hintProps}
          visible={addOpen}
          onBackgroundPress={() => setAddOpen(false)}
          customContent={
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
                {positions.map((position) => (
                  <Text
                    key={position}
                    white
                    text70
                    onPress={() => {
                      addDiv(position, addDivName);
                      setOpen(null);
                    }}
                  >
                    {position}
                  </Text>
                ))}
              </View>
            </View>
          }
        >
          <TouchableOpacity onPress={() => setAddOpen(true)}>
            <Octicons name="diff-added" {...iconStyles} />
          </TouchableOpacity>
        </Hint>
      </View>
    </KeyboardAvoidingView>
  );
};

interface Props extends ViewProps {
  id: string;
  value: DivMapValue;
  ids?: string[];
}

export default function BodyDiv2({ value, id, ids = [] }: Props) {
  const [hintOpen, setHintOpen] = useState<string | null>(null);
  const { children, name } = value;
  const hasChildren = children.size > 0;
  const { activeDivIds, setActiveDivId, setActiveDivIds, styleSheetOpen } = useCanvasStore();

  ids = [...ids, id];

  const handleClose = () => {
    setHintOpen(null);
    setActiveDivId(null);
    setActiveDivIds([]);
  };

  const handleOpen = (str: string) => {
    setHintOpen(str);
    setActiveDivId(id);
    setActiveDivIds(ids);
  };

  const isActive = hintOpen && JSON.stringify(activeDivIds) == JSON.stringify(ids);

  return (
    <View paddingL-10>
      <Hint
        {...hintProps}
        visible={hintOpen === 'top' && !styleSheetOpen}
        onBackgroundPress={() => handleClose()}
        customContent={<Controls {...{ id, ids, name: name as string }} setOpen={setHintOpen} />}
      >
        <TouchableOpacity onPress={() => handleOpen('top')}>
          <Text cyan50 green30={isActive} bg-grey20={isActive} text70>
            {`<${name}>`}
          </Text>
        </TouchableOpacity>
      </Hint>

      {hasChildren &&
        Array.from(children as DivMap).map(([key, value]) => (
          <BodyDiv2 key={key} id={key} value={value} ids={ids} />
        ))}

      <Hint
        {...hintProps}
        visible={hintOpen === 'bottom' && !styleSheetOpen}
        onBackgroundPress={() => handleClose()}
        customContent={<Controls {...{ id, ids, name: name as string }} setOpen={setHintOpen} />}
      >
        <TouchableOpacity onPress={() => handleOpen('bottom')}>
          <Text cyan50 green30={isActive} bg-grey20={isActive} text70>
            {`</${name}>`}
          </Text>
        </TouchableOpacity>
      </Hint>
    </View>
  );
}
