import React, { useState } from 'react';
import { ActivityIndicator, Pressable, TransformsStyle, ViewStyle } from 'react-native';
import {
  ActionSheet,
  Colors,
  ExpandableSection,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import { WheelPicker } from 'react-native-ui-lib/src/incubator';
import { toNumberElseString } from 'src/functions';
import { useCanvasStore } from 'src/store';
import { Ionicons } from '@expo/vector-icons';
import AppColorPicker from 'src/components/AppColorPicker';
import AppTextField from 'src/components/AppTextField';

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
  const { editDiv, getActiveDiv } = useCanvasStore();
  const activeDiv: DivMapValue = getActiveDiv();

  const getInitial = () => {
    const initial = activeDiv[key as keyof ViewStyle];
    const _default = activeDiv[`${key}-default` as keyof ViewStyle];

    interface IData {
      initialValue: string;
      isPercentage: boolean;
      default: null | any;
    }

    const data: IData = {
      initialValue: '',
      isPercentage: false,
      default: null,
    };
    if (initial) {
      const stringInitial = String(initial);

      data.initialValue = stringInitial;
      if (stringInitial.includes('%')) {
        data.initialValue = stringInitial.split('-')[0] as string;
        data.isPercentage = true;
      }
      if (stringInitial.includes('deg')) {
        data.initialValue = stringInitial.split('-')[0] as string;
      }
    }

    if (_default) data.default = _default;

    return data;
  };

  const [value, setValue] = useState<string>(getInitial().initialValue);
  const [openArrayPicker, setOpenArrayPicker] = useState<boolean>(false);
  const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
  const [isPercentage, setIsPercentage] = useState(getInitial().isPercentage);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getPlaceholder = (): string => {
    if (isArray) return 'select';
    if (isColor) return 'hex-code';
    return 'number';
  };

  const getValue = (v: string) => {
    if (isArray) return v;
    if (key.includes('rotate') || key.includes('skew')) {
      if (v === '') return '0deg';
      return `${v}deg`;
    }
    if (v.includes('%')) return v;
    if (v === '') return 0;
    if (val === 'string') return v;
    return toNumberElseString(v);
  };

  const handleSubmit = (v: string, other?: any) => {
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
      return editDiv({ transform });
    }

    if (other) {
      return editDiv({ [key]: getValue(v), ...other });
    }
    return editDiv({ [key]: getValue(v) });
  };

  const handleChange = (val: string) => {
    if (isColor) {
      if (val === '#') setValue('');
      if (val.length > 0 && val.endsWith('#')) return;
      const hexRegex = /^[0-9a-fA-F#]+$/;
      const valid = hexRegex.test(val);
      if (valid) {
        setValue(val.length > 1 ? val : `#${val.toLowerCase()}`);
      }
      return;
    }
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

  const getMaxlength = () => {
    if (isArray) return 30;
    if (isColor) return 7;
    return 10;
  };

  const validate = () => {
    if (isColor) return [(value: any) => value.length === 7];
    return [];
  };

  const validationMessage = () => {
    if (isColor) return ['must be 6 chars after "#"'];
    return [];
  };

  const content = (
    <View flexG paddingV-5>
      <Pressable onPress={() => (isArray ? setOpenArrayPicker(true) : {})}>
        <AppTextField
          editable={!isArray}
          style={{
            color: isColor && value.length === 7 ? value : Colors.black,
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: -0.5, height: 0.5 },
            textShadowRadius: 1,
          }}
          placeholder={getPlaceholder()}
          value={value}
          enableErrors={isColor ? true : false}
          validateOnChange
          validate={validate()}
          validationMessage={validationMessage()}
          onChangeText={(value) => {
            if (isColor) return handleChange(value);
            return handleChange(value.replace(/[^-?0-9.]/g, ''));
          }}
          keyboardType={isColor ? 'default' : 'numeric'}
          maxLength={getMaxlength()}
          onEndEditing={() => {
            if (value !== '') {
              if (isColor) {
                if (value.length === 7) return handleSubmit(value);
                return;
              }
              return handleSubmit(value);
            }
          }}
          leadingAccessory={
            <View paddingL-4 row width="50%">
              <Text>{key}</Text>
            </View>
          }
          trailingAccessory={
            <View flexG row>
              {isLoading && (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    paddingVertical: 5,
                    transform: [{ translateX: -30 }],
                  }}
                  size="small"
                  color="#0000ff"
                />
              )}
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
              {isColor && (
                <TouchableOpacity onPress={() => setOpenColorPicker((prev) => !prev)}>
                  <Ionicons
                    name="md-color-palette-outline"
                    size={24}
                    color={openColorPicker ? 'orange' : 'black'}
                  />
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </Pressable>
    </View>
  );

  return (
    <>
      {isColor ? (
        <ExpandableSection sectionHeader={content} expanded={openColorPicker}>
          {
            <AppColorPicker
              submit={(v, x) => {
                setValue(v);
                handleSubmit(v, { [`${key}-default`]: x });
              }}
              color={value}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              defaultValue={getInitial().default}
            />
          }
        </ExpandableSection>
      ) : (
        content
      )}

      {isArray && (
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
          }}
          visible={openArrayPicker}
          onDismiss={() => {
            handleSubmit(value);
            setOpenArrayPicker(false);
          }}
        />
      )}
    </>
  );
}
