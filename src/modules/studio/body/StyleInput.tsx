import React, { useState } from 'react';
import { Pressable, TransformsStyle, ViewStyle } from 'react-native';
import { ActionSheet, ColorPicker, Colors, Switch, Text, View } from 'react-native-ui-lib';
import { WheelPicker } from 'react-native-ui-lib/src/incubator';
import AppTextField from 'src/components/AppTextField';
import { toNumberElseString } from 'src/functions';
import { useCanvasStore } from 'src/store';

type ActionTypes = 'wheel' | 'color' | null;

interface TransformProps {
  perspective: number;
  rotate: string;
  rotateX: string;
  rotateY: string;
  rotateZ: string;
  scale: number;
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
  skewX: string;
  skewY: string;
  matrix: number[];
}

interface Props {
  styleProp: [string, string | string[] | object];
  activeDiv: DivMapValue;
  category: string;
}

export default function StyleInput({ styleProp, activeDiv, category }: Props) {
  const [key, val] = styleProp;
  const isArray = Array.isArray(val);
  const isColor = val === 'color';
  const isPicker = isArray || isColor;

  const getInitial = () => {
    const initial = activeDiv[key as keyof ViewStyle];
    let data = {
      initialValue: '',
      isNegative: false,
      isPercentage: false,
    };
    if (initial) {
      const stringInitial = String(initial);

      data.initialValue = stringInitial;
      if (stringInitial.includes('-')) {
        data.initialValue = stringInitial.split('-')[1] as string;
        data.isNegative = true;
      }
      if (stringInitial.includes('%')) {
        data.initialValue = stringInitial.split('-')[0] as string;
        data.isPercentage = true;
      }
      if (stringInitial.includes('deg')) {
        data.initialValue = stringInitial.split('-')[0] as string;
      }
    }
    return data;
  };

  const [colors, setColors] = useState<string[]>([]);
  const [value, setValue] = useState<string>(getInitial().initialValue);
  const [open, setOpen] = useState<ActionTypes>(null);
  const [isPercentage, setIsPercentage] = useState(getInitial().isPercentage);
  const [isNegative, setIsNegative] = useState(getInitial().isNegative);
  const { editDiv, activeDivId, activeDivIds } = useCanvasStore();

  const getPlaceholder = (): string => {
    if (isArray) return 'select';
    if (isColor) return 'color';
    return '-';
  };

  const getValue = (v: string) => {
    if (isPicker) return v;
    if (key.includes('rotate') || key.includes('skew')) {
      if (v === '') return '0deg';
      return `${v}deg`;
    }
    if (v.includes('%')) return v;
    if (v === '') return 0;
    if (val === 'string') return v;
    return toNumberElseString(v);
  };

  const handleSubmit = (v: string) => {
    if (category === 'transform') {
      const T = activeDiv.transform?.reduce(
        (acc, cur) => ({ ...acc, ...cur }),
        {},
      ) as TransformProps;
      const transform: TransformsStyle['transform'] = [
        { rotate: key === 'rotate' ? (getValue(v) as string) : T?.rotate ?? '0deg' },
        { rotateX: key === 'rotateX' ? (getValue(v) as string) : T?.rotateX ?? '0deg' },
        { rotateY: key === 'rotateY' ? (getValue(v) as string) : T?.rotateY ?? '0deg' },
        { rotateZ: key === 'rotateZ' ? (getValue(v) as string) : T?.rotateZ ?? '0deg' },
        { scale: key === 'scale' ? (getValue(v) as number) : T?.scale ?? 1 },
        { scaleX: key === 'scaleX' ? (getValue(v) as number) : T?.scaleX ?? 1 },
        { scaleY: key === 'scaleY' ? (getValue(v) as number) : T?.scaleY ?? 1 },
        { translateX: key === 'translateX' ? (getValue(v) as number) : T?.translateX ?? 0 },
        { translateY: key === 'translateY' ? (getValue(v) as number) : T?.translateY ?? 0 },
        { skewX: key === 'skewX' ? (getValue(v) as string) : T?.skewX ?? '0deg' },
        { skewY: key === 'skewY' ? (getValue(v) as string) : T?.skewY ?? '0deg' },
      ];
      editDiv(activeDivId as string, activeDivIds, {
        transform: transform,
      });
    } else {
      editDiv(activeDivId as string, activeDivIds, {
        [key]: getValue(v),
      });
    }
  };

  return (
    <View
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}
    >
      <View flexG paddingV-2>
        <Pressable onPress={() => (isPicker ? setOpen(isArray ? 'wheel' : 'color') : {})}>
          <AppTextField
            editable={!isPicker}
            style={{ color: Colors.black }}
            placeholder={getPlaceholder()}
            value={value}
            onChangeText={(value) => setValue(value.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={!isPicker ? 4 : 30}
            onEndEditing={() => handleSubmit(value)}
            leadingAccessory={
              <View style={{ width: '50%', justifyContent: 'center', flexDirection: 'row' }}>
                <Text>{key}</Text>
              </View>
            }
            trailingAccessory={
              <View style={{ flexDirection: 'row' }}>
                {val === 'number|string' && (
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ zIndex: 1, transform: [{ translateX: 21 }, { translateY: 3 }] }}>
                      <Text>px</Text>
                    </View>
                    <Switch
                      height={30}
                      thumbSize={25}
                      width={50}
                      value={isPercentage}
                      onValueChange={(bool: boolean) => {
                        setIsPercentage(bool);
                        handleSubmit(`${isNegative ? '-' : ''}${value}${bool ? '%' : ''}`);
                      }}
                    />
                    <View style={{ transform: [{ translateX: -20 }, { translateY: 5 }] }}>
                      <Text>%</Text>
                    </View>
                  </View>
                )}
                {(String(val).includes('number') || val === 'string') && (
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{ zIndex: 1, transform: [{ translateX: 18 }, { translateY: 4.5 }] }}
                    >
                      <Text>{'+'}</Text>
                    </View>
                    <Switch
                      height={30}
                      thumbSize={25}
                      width={50}
                      value={isNegative}
                      onValueChange={(bool: boolean) => {
                        setIsNegative(bool);
                        handleSubmit(`${bool ? '-' : ''}${value}${isPercentage ? '%' : ''}`);
                      }}
                    />
                    <View style={{ transform: [{ translateX: -16 }, { translateY: 4 }] }}>
                      <Text>{'-'}</Text>
                    </View>
                  </View>
                )}
              </View>
            }
          />
        </Pressable>
      </View>

      {isPicker && (
        <ActionSheet
          renderTitle={() => {
            if (isArray)
              return (
                <WheelPicker
                  items={val.map((v) => ({ label: v, value: v }))}
                  initialValue={value}
                  onChange={(item: string) => {
                    setValue(item);
                    handleSubmit(item);
                  }}
                />
              );

            if (isColor)
              return (
                <View>
                  <ColorPicker
                    colors={colors}
                    value={value}
                    animatedIndex={colors.indexOf(value)}
                    onSubmit={(colorValue) => setColors((prev) => [...prev, colorValue])}
                    onValueChange={(colorValue) => {
                      setValue(colorValue);
                      handleSubmit(colorValue);
                    }}
                  />
                </View>
              );

            return null;
          }}
          visible={open === (isArray ? 'wheel' : 'color')}
          onDismiss={() => setOpen(null)}
        />
      )}
    </View>
  );
}
