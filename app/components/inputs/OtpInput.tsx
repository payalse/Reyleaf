import React, {useState, useRef} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import GradientBox from '../GradientBox';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';

type Props = {
  length?: number;
  onOTPChange: (s: string) => void;
};
const OTPInput = ({length = 4, onOTPChange}: Props) => {
  const [otp, setOTP] = useState(Array(length).fill(''));
  const otpInputs = useRef<any>([]);

  const handleOTPChange = (index: number, value: string) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    onOTPChange(newOTP.join(''));
  };

  const handleKeyPress = (index: number, key: any) => {
    if (key === 'Backspace' && index > 0) {
      otpInputs.current[index - 1].focus();
    } else if (index < length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <React.Fragment key={index}>
          {value ? (
            <GradientBox
              conatinerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 70,
                width: 70,
                borderRadius: 20,
              }}>
              <TextInput
                key={`${index}-A`}
                style={styles.input}
                value={value}
                onChangeText={text => handleOTPChange(index, text)}
                onKeyPress={({nativeEvent: {key}}) =>
                  handleKeyPress(index, key)
                }
                keyboardType="numeric"
                maxLength={1}
                ref={input => (otpInputs.current[index] = input)}
              />
            </GradientBox>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 70,
                width: 70,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: COLORS.grey,
              }}>
              <TextInput
                key={`${index}-i`}
                style={styles.input}
                value={value}
                placeholderTextColor={COLORS.grey}
                onChangeText={text => handleOTPChange(index, text)}
                onKeyPress={({nativeEvent: {key}}) =>
                  handleKeyPress(index, key)
                }
                keyboardType="numeric"
                maxLength={1}
                ref={input => (otpInputs.current[index] = input)}
              />
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    gap: 10,
  },
  input: {
    // borderBottomWidth: 2,
    color: COLORS.white,
    textAlign: 'center',
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT['bold'],
    height: 70,
    width: 70,
  },
});

export default OTPInput;
