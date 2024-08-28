import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {MyText} from '../MyText';
import {COLORS, FONT_SIZE} from '../../styles';

type Props = {
  msg: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const InputErrorMsg = ({msg, textStyle, containerStyle}: Props) => {
  return (
    <View style={[{marginBottom: 5}, containerStyle]}>
      <MyText center color={COLORS.red} size={FONT_SIZE.sm} style={[textStyle]}>
        {msg}
      </MyText>
    </View>
  );
};

export default InputErrorMsg;
