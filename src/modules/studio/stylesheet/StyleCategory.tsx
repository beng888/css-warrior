/* eslint-disable import/namespace */
// import { Ionicons } from '@expo/vector-icons';
// import React, { memo, useState } from 'react';
// import { ActivityIndicator } from 'react-native';
// import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
// import { ExpandableSection, Text, View } from 'react-native-ui-lib';

// import StyleInput from './StyleInput';

// interface Props {
//   name: string;
//   value: Record<string, string | string[] | object>;
// }

// const StyleCategory = memo(({ name, value }: Props) => {
//   const [expanded, setExpanded] = useState<boolean>(false);

//   const rIconStyle = useAnimatedStyle(() => ({
//     transform: [{ rotate: withTiming(expanded ? '180deg' : '0deg') }],
//   }));

//   return (
//     <ExpandableSection
//       expanded={expanded}
//       sectionHeader={
//         <View row spread padding-4>
//           <Text grey10 text50 style={{ textTransform: 'capitalize' }}>
//             {name}
//           </Text>

//           <Animated.View style={[rIconStyle]}>
//             <Ionicons name="chevron-down" size={24} color="black" />
//           </Animated.View>
//         </View>
//       }
//       onPress={() => {
//         setExpanded(!expanded);
//       }}
//     >
//       <View>
//         {Object.entries(value).map((_item, index) => (
//           <StyleInput category={name} key={index} styleProp={_item} />
//         ))}
//       </View>
//     </ExpandableSection>
//   );
// });

// export default StyleCategory;
