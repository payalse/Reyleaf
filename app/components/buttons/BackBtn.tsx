import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {MyText} from '../MyText';
import {COLORS, FONT_WEIGHT} from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
type Props = {
  onPress?: () => void;
};

const SIZE = 25;

const BackBtn = ({onPress}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
      <View
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE,
          backgroundColor: COLORS.greenDark,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Ionicons color={COLORS.white} size={16} name="arrow-back-outline" />
      </View>
      <MyText bold={FONT_WEIGHT.semibold} color={COLORS.greenDark}>
        Back
      </MyText>
    </TouchableOpacity>
  );
};

export default BackBtn;

const styles = StyleSheet.create({});
