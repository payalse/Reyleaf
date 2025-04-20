import {View, Text} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {MyText} from '../MyText';
import { pixelSizeHorizontal, pixelSizeVertical } from '../../utils/sizeNormalization';

type Props = {
  children: React.ReactNode;
  title: string;
};

const InputWrapper = ({children, title}: Props) => {
  return (
    <View style={{marginBottom: pixelSizeVertical(10)}}>
      <MyText
        size={FONT_SIZE.sml}
        bold={FONT_WEIGHT.medium}
        style={{marginVertical: pixelSizeVertical(6), marginLeft: pixelSizeHorizontal(16), color: COLORS.black}}>
        {title}
      </MyText>
      {children}
    </View>
  );
};

export default InputWrapper;
