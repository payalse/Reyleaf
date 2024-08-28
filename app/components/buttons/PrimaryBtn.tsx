import {TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import {MyText} from '../MyText';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONT_WEIGHT} from '../../styles';
import {StyleProp} from 'react-native';
import {ActivityIndicator} from 'react-native';
type Props = {
  text: string;
  rightComp?: () => React.ReactNode;
  leftComp?: () => React.ReactNode;
  onPress?: () => void;
  conatinerStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
};
const PrimaryBtn = ({
  text,
  leftComp,
  rightComp,
  onPress,
  conatinerStyle,
  loading,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={conatinerStyle}>
      <LinearGradient
        colors={[COLORS.greenDark, COLORS.greenLight]}
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
          conatinerStyle,
        ]}>
        {leftComp && leftComp()}
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <MyText bold={FONT_WEIGHT.bold} color={COLORS.white}>
            {text}
          </MyText>
        )}
        {rightComp && rightComp()}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryBtn;
