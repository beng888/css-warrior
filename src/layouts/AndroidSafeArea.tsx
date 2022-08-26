import React from 'react';

import { StyleSheet, Platform, StatusBar, View } from 'react-native';

export type Props = {
  children: React.ReactNode;
};

const AndroidSafeArea: React.FC<Props> = ({ children }) => {
  return <View style={styles.view}>{children}</View>;
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default AndroidSafeArea;
