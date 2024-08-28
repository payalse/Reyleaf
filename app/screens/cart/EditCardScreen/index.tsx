import {SafeAreaView, ScrollView, View} from 'react-native';
import React from 'react';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import {useNavigation} from '@react-navigation/native';
import MyButton from '../../../components/buttons/MyButton';
import {COLORS} from '../../../styles';

const EditCardScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Edit Card" />
      <ScrollView contentContainerStyle={{padding: 20, marginTop: 10}}>
        <InputWrapper title="Card Number">
          <MyInput placeholder="Type Here" />
        </InputWrapper>
        <InputWrapper title="Cardholder Name">
          <MyInput placeholder="Type Here" />
        </InputWrapper>
        <InputWrapper title="Expiry Dare">
          <MyInput placeholder="Type Here" />
        </InputWrapper>
        <InputWrapper title="CVV">
          <MyInput placeholder="Type Here" />
        </InputWrapper>
      </ScrollView>
      <View style={{marginBottom: 30, gap: 10, marginHorizontal: 20}}>
        <PrimaryBtn text="Save" />
        <MyButton
          text="Delete Card"
          containerStyle={{backgroundColor: COLORS.transparent}}
          textStyle={{color: COLORS.red}}
        />
      </View>
    </View>
  );
};

export default EditCardScreen;
