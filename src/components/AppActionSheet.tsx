import React from 'react';
import { ActionSheet } from 'react-native-ui-lib';

type ActionSheetProps = React.ComponentProps<typeof ActionSheet>;
type Props = ActionSheetProps & {};
const test: ActionSheetProps = {};
export default function AppActionSheet({ ...props }: Props) {
  return <ActionSheet {...props} />;
}
