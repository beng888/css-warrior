import React from 'react';
import { TextField } from 'react-native-ui-lib/src/incubator';
import { TextFieldProps } from 'react-native-ui-lib/src/incubator/TextField';

export default function AppTextField({ ...props }: TextFieldProps) {
  return <TextField {...props} />;
}
