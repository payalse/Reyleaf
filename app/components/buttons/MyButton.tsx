import {StyleProp, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import {MyText} from '../MyText';

type Props = {
  text: string;
  onPress?: () => void;
  leftComp?: () => React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
};

const MyButton = ({
  text,
  onPress,
  leftComp,
  containerStyle,
  textStyle,
  loading,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: 'white',
          width: '100%',
          height: 50,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 20,
        },
        containerStyle,
      ]}>
      {leftComp && leftComp()}
      <MyText style={[textStyle]}>{loading ? 'loading...' : text}</MyText>
    </TouchableOpacity>
  );
};

export default MyButton;
