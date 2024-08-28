import {Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import IconSvg from '../../../assets/svg/icons/password-updated.svg';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {MyText} from '../MyText';
import PrimaryBtn from '../buttons/PrimaryBtn';
type Props = {
  visible: boolean;
  onPress?: () => void;
};

const PasswordUpdatedModel = ({visible, onPress}: Props) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.transparentBlack,
        }}>
        <View
          style={{
            width: '80%',
            paddingVertical: 20,
            backgroundColor: COLORS.white,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
          }}>
          <IconSvg />

          <MyText size={FONT_SIZE['2xl']} bold={FONT_WEIGHT.bold}>
            Password Updated!
          </MyText>
          <MyText center color={COLORS.grey}>
            Your password has been set up Successfully
          </MyText>
          <View>
            <PrimaryBtn
              onPress={onPress}
              conatinerStyle={{
                marginVertical: 20,
              }}
              text="Back to Sign in"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PasswordUpdatedModel;

const styles = StyleSheet.create({});
