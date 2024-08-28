import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS} from '../../styles';
import {RegularText} from '../MyText';

type Props = {
  onPress: () => void;
  value: string;
};

const GenderInput = ({onPress, value}: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: '#F5FAFF',
          padding: 20,
          borderRadius: 10,
          borderWidth: 2,
          height: 60,
          borderColor: COLORS.borderLight,
        }}>
        <RegularText style={{color: COLORS.grey}}>{value}</RegularText>
      </View>
    </TouchableOpacity>
  );
};

export default GenderInput;
