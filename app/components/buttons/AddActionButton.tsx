import {
  Platform,
  SafeAreaView,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import GradientBox from '../GradientBox';
import {COLORS, FONT_SIZE, hp, wp} from '../../styles';
import Entypo from 'react-native-vector-icons/Entypo';
import {TAB_BAR_BG_HEIGHT} from '../../naviagtion/MainTab';

const isIos = Platform.OS === 'ios';
type Props = {
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};
const AddActionButton = ({onPress, containerStyle}: Props) => {
  return (
    <View
      style={[
        {
          pointerEvents: 'box-none',
          paddingHorizontal: wp(5),
          paddingBottom: TAB_BAR_BG_HEIGHT - wp(isIos ? 10 : 10),
          position: 'absolute',
          width: wp(100),
          bottom: 0,
          alignItems: 'flex-end',
          zIndex: 1
        },
        containerStyle,
      ]}>
      <TouchableOpacity onPress={onPress}>
        <GradientBox
          conatinerStyle={{
            width: wp(17),
            borderRadius: wp(17) / 2,
            height: wp(17),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Entypo name="plus" color={COLORS.white} size={FONT_SIZE['3xl']} />
        </GradientBox>
      </TouchableOpacity>
    </View>
  );
};

export default AddActionButton;
