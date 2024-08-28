import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import React, {useState} from 'react';
import LayoutBG from '../../../components/layout/LayoutBG';
import BackBtn from '../../../components/buttons/BackBtn';
import {useNavigation} from '@react-navigation/native';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../../naviagtion/types';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {api_forgetPassword} from '../../../api/auth';
import {ForgetPasswordResponse} from '../../../types/apiResponse';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';

type FormValues = {
  email: string;
};
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .required('Email is Required!'),
});
const VendorForgetPasswordScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const res = (await api_forgetPassword(
        values.email,
      )) as ForgetPasswordResponse;
      ShowAlert({textBody: res?.message});
      navigation.navigate('VendorForgetPasswordOtpVerification', {
        verifyToken: res.refData,
      });
    } catch (error: any) {
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setLoading(false);
    }
  };
  return (
    <LayoutBG type="bg-leaf">
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: '',
        }}
        onSubmit={onSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <ScrollView contentContainerStyle={{marginHorizontal: 20}}>
            <BackBtn onPress={navigation.goBack} />
            <View>
              <MyText
                bold={FONT_WEIGHT.bold}
                size={FONT_SIZE['2xl']}
                style={{marginTop: 100, marginBottom: 10}}>
                Forgot Password
              </MyText>
              <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                Enter your email we will send you a Code{' '}
              </MyText>
            </View>
            <View style={{marginTop: 20}}>
              <InputWrapper title="Email">
                <MyInput
                  hasError={Boolean(errors.email && touched.email)}
                  onBlur={handleBlur('email')}
                  onChangeText={handleChange('email')}
                  value={values.email}
                  placeholder="Type your email"
                  leftIcon={() => (
                    <Ionicons
                      size={24}
                      color={COLORS.lightgrey}
                      name="mail-outline"
                    />
                  )}
                />
              </InputWrapper>
              {errors.email && touched.email && (
                <InputErrorMsg msg={errors.email} />
              )}
              <PrimaryBtn
                loading={loading}
                onPress={handleSubmit}
                text="Send Code"
                conatinerStyle={{marginTop: 10}}
              />
            </View>
          </ScrollView>
        )}
      </Formik>
    </LayoutBG>
  );
};

export default VendorForgetPasswordScreen;
