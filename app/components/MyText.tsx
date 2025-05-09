import {
  StyleProp,
  TextStyle,
  Text,
  TextProps,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';
import {FONT_SIZE} from '../styles';

interface TextProp extends TextProps {
  children: string | React.ReactNode;
  style?: StyleProp<TextStyle>;
  bold?: TextStyle['fontWeight'];
  size?: number;
  center?: boolean;
  color?: TextStyle['color'];
  onPress?: (event: GestureResponderEvent) => void;
  containerStyle?:ViewStyle;
}

export const MyText = ({
  children,
  style,
  bold,
  size,
  color,
  center,
  onPress,
  containerStyle,
  ...rest
}: TextProp) => {
  const textComponent = (
    <Text
      {...rest}
      style={[
        {
          // fontFamily: FONT_FAMILY.Mulish.name,
          fontSize: size ? size : FONT_SIZE.base,
          fontWeight: bold,
          color: color ? color : '#222',
          textAlign: center ? 'center' : 'auto',
        },
        style,
      ]}>
      {children}
    </Text>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={containerStyle} onPress={onPress}>{textComponent}</TouchableOpacity>
    );
  }

  return textComponent;
};
