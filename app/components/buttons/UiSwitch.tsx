import React from 'react';
import {StyleSheet} from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
import {COLORS} from '../../styles';

type Props = {
  value: boolean;
  onChange: () => void;
};

const UiSwitch = ({value, onChange}: Props) => {
  return (
    <SwitchToggle
      switchOn={value}
      onPress={onChange}
      circleColorOff={'rgba(0,0,0,0.1)'}
      circleColorOn={COLORS.greenDark}
      backgroundColorOn={COLORS.white}
      backgroundColorOff={COLORS.white}
    />
  );
};

export default UiSwitch;

const styles = StyleSheet.create({});
