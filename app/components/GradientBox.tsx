import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../styles';

type Props = {
  children: React.ReactNode;
  conatinerStyle?: StyleProp<ViewStyle>;
};

const GradientBox = ({children, conatinerStyle}: Props) => {
  return (
    <LinearGradient
      colors={[COLORS.greenDark, COLORS.greenLight]}
      style={[{}, conatinerStyle]}>
      {children}
    </LinearGradient>
  );
};

export default GradientBox;

const styles = StyleSheet.create({});
