import {View} from 'react-native';
import React from 'react';
import {COLORS} from '../../../styles';

type Props = {
  active?: boolean;
};
const Dot = ({active}: Props) => {
  const SIZE = active ? 15 : 10;
  return (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        backgroundColor: active ? COLORS.greenDark : COLORS.grey,
      }}
    />
  );
};

export default Dot;
