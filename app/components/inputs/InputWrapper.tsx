import {View, Text} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {MyText} from '../MyText';

type Props = {
  children: React.ReactNode;
  title: string;
};

const InputWrapper = ({children, title}: Props) => {
  return (
    <View style={{marginBottom: 10}}>
      <MyText
        size={FONT_SIZE.base}
        bold={FONT_WEIGHT.medium}
        style={{marginVertical: 5, marginLeft: 15, color: COLORS.black}}>
        {title}
      </MyText>
      {children}
    </View>
  );
};

export default InputWrapper;
