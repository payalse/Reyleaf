import {Modal, StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import IconSvg from '../../../assets/svg/illustrations/loaction.svg';
import {COLORS, FONT_SIZE, FONT_WEIGHT, wp} from '../../styles';
import {MyText} from '../MyText';
import PrimaryBtn from '../buttons/PrimaryBtn';
type Props = {
  visible: boolean;
  onPress?: () => void;
  onChange?: (s: string) => void;
  value?: string;
};

const LoactionPermissionModal = ({visible, onPress,  value, onChange}: Props) => {
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
            width: wp(90),
            paddingVertical: 20,
            backgroundColor: COLORS.white,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
          }}>
          <IconSvg />

          <MyText
            style={{marginVertical: 10}}
            size={FONT_SIZE['2xl']}
            bold={FONT_WEIGHT.bold}>
            Search Feed by Location
          </MyText>
          <MyText center color={COLORS.grey}>
          Discover unique activity nearby with our feed. Find events, activity, and more around your location.
          </MyText>
          <View
            style={{
              backgroundColor: '#EBEBEB',
              height: 50,
              borderRadius: 30,
              width: wp(80),
              flexDirection: 'row',
              alignItems: 'center',
              overflow: 'hidden',
              marginTop: 20,
              marginBottom: 10,
              paddingHorizontal: 20,
            }}>
            <TextInput
             value={value}
             onChangeText={onChange}
              placeholderTextColor={COLORS.lightgrey}
              placeholder="Enter Zip Code"
              style={{
                flex: 1,
                height: '100%',
                fontSize: FONT_SIZE.base,
              }}
            />
          </View>
          <PrimaryBtn
            onPress={onPress}
            text="Save"
            conatinerStyle={{width: wp(80), marginBottom: 5}}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LoactionPermissionModal;

const styles = StyleSheet.create({});
