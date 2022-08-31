import { View } from 'react-native-ui-lib';
import BodyDiv from './BodyDiv';
import { useCanvasStore } from 'src/store';
import AppButton from 'src/components/AppButton';

export default function Body({ ...props }) {
  const { body, addFirstDiv } = useCanvasStore();
  // console.log('%c⧭', 'color: #aa00ff', { body });

  return (
    <View {...props}>
      {body.size > 0 ? (
        <View paddingV-40>
          {Array.from(body).map(([key, value]) => (
            <BodyDiv key={key} id={key} value={value} />
          ))}
        </View>
      ) : (
        <View center flexG>
          <AppButton onPress={() => addFirstDiv()} label="Click here to add your first div!" />
        </View>
      )}
    </View>
  );
}
