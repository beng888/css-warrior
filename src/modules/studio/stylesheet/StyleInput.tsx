import { useAtom } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, TransformsStyle, ViewStyle } from 'react-native';
import { ActionSheet, ColorPicker, Colors, Switch, Text, View } from 'react-native-ui-lib';
import { WheelPicker } from 'react-native-ui-lib/src/incubator';
// import { activeDivIdAtom, activeDivIdsAtom } from 'src/atoms/StudioAtoms';
import AppTextField from 'src/components/AppTextField';
import { toNumberElseString } from 'src/functions';
import { useCanvasStore } from 'src/store';

type ActionTypes = 'wheel' | 'color' | null;

interface TransformProps {
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
}

interface Props {
  styleProp: [string, string | string[] | object];
  category: string;
}
export default function StyleInput({ styleProp, category }: Props) {
  const [key, val] = styleProp;
  const isArray = Array.isArray(val);
  const isColor = val === 'color';
  const isPicker = isArray || isColor;
  const { editDiv, getActiveDiv } = useCanvasStore();

  // const [activeDivId] = useAtom(activeDivIdAtom);
  // const [activeDivIds] = useAtom(activeDivIdsAtom);

  // const activeDivId: string | null = null;
  // const activeDivIds: string[] = [];
  const activeDiv = getActiveDiv();
  // const activeDiv: ViewStyle = { transform: [] };
  // const activeDivParent = useMemo(() => getActiveDivParent(activeDivIds), [activeDivIds]);

  // console.log('%c⧭', 'color: #ffa640', { activeDiv, activeDivParent });

  const getInitial = () => {
    const initial = activeDiv[key as keyof ViewStyle];
    const data = {
      initialValue: '',
      isPercentage: false,
    };
    if (initial) {
      const stringInitial = String(initial);

      data.initialValue = stringInitial;
      // if (stringInitial.includes('-')) {
      //   data.initialValue = stringInitial.split('-')[1] as string;
      //   data.isNegative = true;
      // }
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

  const getPlaceholder = (): string => {
    if (isArray) return 'select';
    if (isColor) return 'color';
    return '0000';
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
      editDiv({ transform });
    } else {
      // const test = activeDivParent.set(activeDivId, { ...activeDiv, [key]: getValue(v) });
      // console.log('%c⧭', 'color: #00b300', test);

      editDiv({ [key]: getValue(v) });
    }
  };

  const handleChange = (val: string) => {
    if (val.includes('-') && val.length > 1) {
      if (val.endsWith('-') && val.startsWith('-')) return setValue(val.slice(0, val.length - 1));
    }

    if (val === '.') return;
    if (val.includes('.')) {
      if (val.endsWith('..')) return setValue(val.slice(0, val.length - 1));
      if (val.endsWith('.') && val.indexOf('.') !== val.length - 1) {
        return setValue(val.slice(0, val.length - 1));
      }
    }
    setValue(val);
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
            onChangeText={(value) => handleChange(value.replace(/[^-?0-9.]/g, ''))}
            keyboardType="numeric"
            maxLength={!isPicker ? 10 : 30}
            onEndEditing={() => handleSubmit(value)}
            leadingAccessory={
              <View paddingL-4 row width="50%">
                <Text>{key}</Text>
              </View>
            }
            trailingAccessory={
              <View row>
                {val === 'number|string' && (
                  <View row>
                    <View style={{ zIndex: 1, transform: [{ translateX: 21 }, { translateY: 3 }] }}>
                      <Text>px</Text>
                    </View>
                    <Switch
                      disabled={value === ''}
                      height={30}
                      thumbSize={25}
                      width={50}
                      value={isPercentage}
                      onValueChange={(bool: boolean) => {
                        setIsPercentage(bool);
                        handleSubmit(`${value}${bool ? '%' : ''}`);
                      }}
                    />
                    <View style={{ transform: [{ translateX: -20 }, { translateY: 5 }] }}>
                      <Text>%</Text>
                    </View>
                  </View>
                )}
                {/* {(String(val).includes('number') || val === 'string') && (
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{ zIndex: 1, transform: [{ translateX: 18 }, { translateY: 4.5 }] }}
                    >
                      <Text>+</Text>
                    </View>
                    <Switch
                      disabled={value === ''}
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
                      <Text>-</Text>
                    </View>
                  </View>
                )} */}
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
                  onChange={(item: string) => setValue(item)}
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
                    onValueChange={(colorValue) => setValue(colorValue)}
                  />
                </View>
              );

            return null;
          }}
          visible={open === (isArray ? 'wheel' : 'color')}
          onDismiss={() => {
            handleSubmit(value);
            setOpen(null);
          }}
        />
      )}
    </View>
  );
}
