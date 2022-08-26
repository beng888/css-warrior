import React, { forwardRef, useRef } from 'react';
import { Button, ButtonProps } from 'react-native-ui-lib';

const AppButton = forwardRef<any, ButtonProps>(({ ...props }, ref) => {
  return <Button ref={ref} {...props} />;
});

export default AppButton;
