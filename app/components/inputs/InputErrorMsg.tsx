import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { MyText } from '../MyText';
import { COLORS, FONT_SIZE } from '../../styles';
import { pixelSizeHorizontal, pixelSizeVertical } from '../../utils/sizeNormalization';

type Props = {
  msg: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const InputErrorMsg = ({ msg, textStyle, containerStyle }: Props) => {
  return (
    <View style={[{ marginBottom: pixelSizeVertical(4) }, containerStyle]}>
      <MyText center color={COLORS.red} size={FONT_SIZE.base} style={[textStyle, { textAlign: "left", marginLeft: pixelSizeHorizontal(12) }]}>
        {msg}
      </MyText>
    </View>
  );
};

export default InputErrorMsg;
