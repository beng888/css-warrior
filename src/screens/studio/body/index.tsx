import { View, ViewProps } from 'react-native-ui-lib';
import BodyDiv from './BodyDiv';
import { useCanvasStore } from 'src/store';
import { AntDesign } from '@expo/vector-icons';

export default function Body({ ...props }: ViewProps) {
  const { body, addFirstDiv, currentHistory, history } = useCanvasStore();

  return (
    <View paddingR-10 {...props}>
      {body.size > 0 ? (
        <View paddingT-40 paddingB-100>
          {Array.from(body).map(([key, value]) => (
            <BodyDiv key={key} id={key} value={value} />
          ))}
        </View>
      ) : (
        <View center flexG paddingV-40 paddingH-20>
          <AntDesign
            onPress={() => addFirstDiv()}
            name="plussquareo"
            size={40}
            color="lightgreen"
          />
        </View>
      )}
    </View>
  );
}
