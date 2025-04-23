import { ScrollView, View } from 'react-native';
import { useState } from 'react';
import LayoutBG from '../../components/layout/LayoutBG';
import BackBtn from '../../components/buttons/BackBtn';
import { useNavigation } from '@react-navigation/native';
import { MyText } from '../../components/MyText';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../styles';
import InputWrapper from '../../components/inputs/InputWrapper';
import MyInput from '../../components/inputs/MyInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../naviagtion/types';

import { Formik } from 'formik';
import * as Yup from 'yup';
import InputErrorMsg from '../../components/inputs/InputErrorMsg';
import { api_forgetPassword } from '../../api/auth';
import { ShowAlert } from '../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import { ForgetPasswordResponse } from '../../types/apiResponse';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../utils/sizeNormalization';

type FormValues = {
  email: string;
};
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Invalid email address')
    .required('Required')
    .required('Email is Required!'),
});

const ForgetPasswordScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const res = (await api_forgetPassword(
        values.email,
      )) as ForgetPasswordResponse;
      ShowAlert({ textBody: 'Otp Successfully Sent' });
      navigation.navigate('ForgetPasswordOtpVerification', {
        verifyToken: res.refData,
      });
    } catch (error: any) {
      ShowAlert({ textBody: error.message, type: ALERT_TYPE.DANGER });
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
          <ScrollView contentContainerStyle={{ marginHorizontal: pixelSizeHorizontal(20) }}>
            <BackBtn onPress={navigation.goBack} />
            <View>
              <MyText
                bold={FONT_WEIGHT.bold}
                size={FONT_SIZE['2xl']}
                style={{ marginTop: pixelSizeVertical(100), marginBottom: pixelSizeVertical(10) }}>
                Forgot Password
              </MyText>
              <MyText size={FONT_SIZE.lg} color={'grey'}>
                Enter your email we will send you a Code{' '}
              </MyText>
            </View>
            <View style={{ marginTop: pixelSizeVertical(20) }}>
              <InputWrapper title="Email">
                <MyInput
                  hasError={Boolean(errors.email && touched.email)}
                  onBlur={handleBlur('email')}
                  onChangeText={handleChange('email')}
                  value={values.email}
                  placeholder="Type your email"
                  leftIcon={() => (
                    <Ionicons
                      size={widthPixel(24)}
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
                conatinerStyle={{ marginTop: pixelSizeVertical(10) }}
              />
            </View>
          </ScrollView>
        )}
      </Formik>
    </LayoutBG>
  );
};

export default ForgetPasswordScreen;
