import React from 'react';
import { ActionBar } from 'react-native-ui-lib';
import { useCanvasStore } from 'src/store';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  setOpenDrawer: () => void;
  item: string;
  openDrawer: boolean;
}

export default function BottomActionBar({ setOpenDrawer, item, openDrawer }: Props) {
  const { undoHistory, redoHistory, unDoable, reDoable, save, isSaveable } = useCanvasStore();

  return (
    <ActionBar
      useSafeArea
      centered
      actions={[
        {
          label: <Ionicons name="md-save" size={24} />,
          onPress: () => save(item),
          disabled: !isSaveable(),
          size: 'large',
        },
        {
          label: <Ionicons name="md-arrow-undo" size={24} />,
          onPress: () => undoHistory(),
          disabled: !unDoable(),
          size: 'large',
        },
        {
          label: <Ionicons name="md-arrow-redo" size={24} />,
          onPress: () => redoHistory(),
          disabled: !reDoable(),
          size: 'large',
        },
        {
          label: <Ionicons name="md-settings" size={24} />,
          onPress: () => setOpenDrawer(),
          disabled: openDrawer,
          size: 'large',
        },
      ]}
    />
  );
}
