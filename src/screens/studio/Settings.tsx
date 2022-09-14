import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { ButtonSize, Checkbox, Hint, Slider, Text, View } from 'react-native-ui-lib';
import { Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCanvasStore } from 'src/store';
import { ISettings } from 'src/store/useCanvasStore';
import AppButton from 'src/components/AppButton';

export default function Settings() {
  const { settings, saveSettings } = useCanvasStore();
  const [historyLimit, setHistoryLimit] = useState<number>(settings.historyLimit);
  const [showInlineStyles, setShowInlineStyles] = useState(settings.showInlineStyles);
  const [showHistoryHint, setShowHistoryHint] = useState(false);

  const maxHistory = 200;
  const minHistory = 0;
  const settingsValue: ISettings = { historyLimit: historyLimit, showInlineStyles };

  const saveNewSettings = async () => {
    const settingsJSON = JSON.stringify(settingsValue);

    try {
      await AsyncStorage.setItem('settings', settingsJSON);
      saveSettings(settingsValue);
    } catch (e) {}
  };

  useEffect(() => {
    setHistoryLimit(settings.historyLimit);
    setShowInlineStyles(settings.showInlineStyles);
  }, [settings]);

  return (
    <View padding-10>
      <View row centerV>
        <Text text60>History Limit</Text>
        <Hint
          visible={showHistoryHint}
          useSideTip={false}
          position="top"
          message="higher value will take more memory space, changes will reflect on next code update"
          onBackgroundPress={() => setShowHistoryHint(false)}
        >
          <Pressable onPress={() => setShowHistoryHint(true)} style={{ marginLeft: 10 }}>
            <Octicons name="info" size={20} color="orange" />
          </Pressable>
        </Hint>
        <View padding-10>
          <Text>
            {historyLimit}/{maxHistory}
          </Text>
        </View>
      </View>

      <Slider
        value={settings.historyLimit}
        minimumValue={minHistory}
        maximumValue={maxHistory}
        step={1}
        onValueChange={(val) => setHistoryLimit(val)}
      />

      <View row marginT-10>
        <Text text60>Show inline styles</Text>
        <Checkbox
          style={{ marginLeft: 10 }}
          value={showInlineStyles}
          onValueChange={(val: boolean) => setShowInlineStyles(val)}
        />
      </View>

      <AppButton
        marginT-20
        marginB-10
        label="Save Settings"
        size={ButtonSize.medium}
        labelStyle={{ fontSize: 20 }}
        onPress={() => saveNewSettings()}
        disabled={JSON.stringify(settingsValue) === JSON.stringify(settings)}
      />
    </View>
  );
}
