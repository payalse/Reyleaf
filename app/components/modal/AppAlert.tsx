import {Modal, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {MyText} from '../MyText';
import PrimaryBtn from '../buttons/PrimaryBtn';
import {AppAlertDataType, useAppAlert} from '../../context/AppAlertContext';

const AppAlert = ({text, isError, onConfirm, icon}: AppAlertDataType) => {
  const {hideModal, appAlertlVisible} = useAppAlert()!;
  return (
    <Modal
      transparent
      visible={appAlertlVisible}
      animationType="slide"
      onRequestClose={hideModal}>
      <TouchableWithoutFeedback onPress={hideModal}>
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
            {icon && <View style={{padding: 20}}>{icon()}</View>}
            <MyText
              color={!isError ? COLORS.black : 'red'}
              size={FONT_SIZE['xl']}
              style={{padding: 20}}
              center
              bold={FONT_WEIGHT.bold}>
              {text}
            </MyText>
            <View>
              <PrimaryBtn
                onPress={onConfirm ?? hideModal}
                conatinerStyle={{
                  marginVertical: 10,
                }}
                text="Okay"
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AppAlert;
