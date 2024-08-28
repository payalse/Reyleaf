import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../styles';
import { useNavigation } from '@react-navigation/native';

// COMPONENTS
import { MyText } from '../../components/MyText';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import MyInput from '../../components/inputs/MyInput';
import InputWrapper from '../../components/inputs/InputWrapper';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BackBtn from '../../components/buttons/BackBtn';
import APPLOGO from '../../../assets/svg/icons/icon.svg';
import LayoutBG from '../../components/layout/LayoutBG';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../naviagtion/types';

import { Formik } from 'formik';
import * as Yup from 'yup';
import InputErrorMsg from '../../components/inputs/InputErrorMsg';
import { api_signup } from '../../api/auth';
import { SignupResponse } from '../../types/apiResponse';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { login } from '../../redux/features/auth/authSlice';
import { ALERT_TYPE } from 'react-native-alert-notification';
import { ShowAlert } from '../../utils/alert';
import { fetchFcmTokenFromLocal } from '../../utils/fetchFcmTokenFromLocal';

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .required('Email is Required!'),
  password: Yup.string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is Required!'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is Required!'),
});

const SignupScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: FormValues) => {
    let fcmToken = await fetchFcmTokenFromLocal();
    const payload = {
      email: values.email,
      password: values.password,
      role: 1,
      fcmToken,
    };

    try {
      setLoading(true);

      const res = (await api_signup(payload)) as SignupResponse;
      ShowAlert({ textBody: 'OTP sent successfully, Please check your inbox!', type: ALERT_TYPE.SUCCESS });
      dispatch(login({ ...res.data, token: res.token }));
      navigation.navigate('OtpVerification', {
        verifyToken: res.data._id,
        authToken: res.token,
      });
    } catch (error: any) {
      ShowAlert({ textBody: error.message, type: ALERT_TYPE.DANGER });
    } finally {
      setLoading(false);
    }
  };
  return (
    <LayoutBG type="bg-tr">
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, marginHorizontal: 20 }}
          >
            <View>
              <BackBtn onPress={navigation.goBack} />
              <View style={{ alignItems: 'center' }}>
                <APPLOGO width={100} height={200} />
              </View>
            </View>

            <View style={{ width: '100%' }}>
              <MyText
                style={{
                  fontSize: FONT_SIZE['2xl'],
                  fontWeight: FONT_WEIGHT.bold,
                  marginVertical: 5,
                }}
              >
                Let’s Open your Account
              </MyText>
              <MyText size={FONT_SIZE.sm} color={'grey'}>
                Enter your information to create a new account
              </MyText>
            </View>
            <View
              style={{
                marginTop: 20,
              }}
            >
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
              <InputWrapper title="Password">
                <MyInput
                  hasError={Boolean(errors.password && touched.password)}
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                  value={values.password}
                  leftIcon={() => (
                    <AntDesign
                      size={24}
                      color={COLORS.lightgrey}
                      name="lock1"
                    />
                  )}
                  isPassword
                  placeholder="Type your Password"
                />
              </InputWrapper>
              {errors.password && touched.password && (
                <InputErrorMsg msg={errors.password} />
              )}
              <InputWrapper title="Retype Password">
                <MyInput
                  hasError={Boolean(
                    errors.confirmPassword && touched.confirmPassword,
                  )}
                  onBlur={handleBlur('confirmPassword')}
                  onChangeText={handleChange('confirmPassword')}
                  value={values.confirmPassword}
                  leftIcon={() => (
                    <AntDesign
                      size={24}
                      color={COLORS.lightgrey}
                      name="lock1"
                    />
                  )}
                  isPassword
                  placeholder="Retype Password"
                />
              </InputWrapper>
              {errors.confirmPassword && touched.confirmPassword && (
                <InputErrorMsg msg={errors.confirmPassword} />
              )}
            </View>

            <View
              style={{
                paddingVertical: 20,
                gap: 20,
              }}
            >
              <PrimaryBtn
                loading={loading}
                onPress={handleSubmit}
                text="Sign Up"
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 6,
                marginTop: 'auto',
              }}
            >
              <MyText center size={FONT_SIZE.sm} style={{ color: 'grey' }}>
                Already have an account?
              </MyText>
              <TouchableOpacity onPress={navigation.goBack}>
                <MyText
                  bold={FONT_WEIGHT.medium}
                  size={FONT_SIZE.sm}
                  style={{ color: COLORS.greenDark }}
                >
                  Signin
                </MyText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Formik>
    </LayoutBG>
  );
};

export default SignupScreen;
