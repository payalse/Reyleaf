import { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../styles';
import { useNavigation } from '@react-navigation/native';

// COMPONENTS
import BackBtn from '../../components/buttons/BackBtn';
import { MyText } from '../../components/MyText';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import MyInput from '../../components/inputs/MyInput';
import InputWrapper from '../../components/inputs/InputWrapper';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import APPLOGO from '../../../assets/svg/icons/icon.svg';
import LayoutBG from '../../components/layout/LayoutBG';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../naviagtion/types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { login, setIsAuthenticated } from '../../redux/features/auth/authSlice';
import {
  changeAppMode,
  setFirstLaunched,
} from '../../redux/features/app/appSlice';
import { Formik } from 'formik';
import * as yup from 'yup';
import InputErrorMsg from '../../components/inputs/InputErrorMsg';
import { api_login } from '../../api/auth';
import { LoginResponseType } from '../../types/apiResponse';
import { ShowAlert } from '../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import { fetchFcmTokenFromLocal } from '../../utils/fetchFcmTokenFromLocal';
import { Text } from 'react-native';
import TnC from '../../components/modal/TnC';
import PrivacyPolicy from '../../components/modal/PrivacyPolicy';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../utils/sizeNormalization';
import { LOGO_HEIGHT, LOGO_WIDTH } from '../Welcome/WelcomeScreen';

type LoginValues = {
  email: string;
  password: string;
};
const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Required')
    .required('Email is Required!'),
  password: yup
    .string()
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is Required!'),
});

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const onSubmit = async (values: LoginValues) => {
    try {
      setLoading(true);
      let fcmToken = await fetchFcmTokenFromLocal();
      const res: any = (await api_login({
        ...values,
        email: values.email.toLocaleLowerCase(),
        fcmToken,
      })) as LoginResponseType;
      // ShowAlert({textBody: res.message});
      dispatch(login({ ...res.data, token: res.token }));
      // not verfied
      if (res.data.account_status === 1) {
        navigation.navigate('OtpVerification', {
          verifyToken: res.data._id,
          authToken: res.token,
        });
      }
      // verfied or active
      if (res.data.account_status === 2) {
        dispatch(changeAppMode('USER'));
        dispatch(setIsAuthenticated(true));
        dispatch(setFirstLaunched(false));
      }
      if (res.data.account_status === 3) {
        ShowAlert({ textBody: 'Account is Blocked!', type: ALERT_TYPE.DANGER });
      }
      if (res.data.account_status === 4) {
        ShowAlert({ textBody: 'Account is Deleted!', type: ALERT_TYPE.DANGER });
      }
    } catch (error: any) {
      ShowAlert({ textBody: error.message, type: ALERT_TYPE.DANGER });
    } finally {
      setLoading(false);
    }
  };



  return (
    <LayoutBG type="bg-tl">
      <Formik
        validationSchema={loginValidationSchema}
        initialValues={{
          email: '',
          password: '',
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              marginHorizontal: pixelSizeHorizontal(20),
              paddingBottom: pixelSizeVertical(26),
            }}>
            <View>
              <BackBtn onPress={navigation.goBack} />
              <View
                style={{
                  alignItems: 'center',
                }}>
                <APPLOGO width={LOGO_WIDTH} height={LOGO_HEIGHT} />
              </View>
            </View>

            <View style={{ width: '90%' }}>
              <MyText
                style={{
                  fontSize: FONT_SIZE['3xl'],
                  fontWeight: FONT_WEIGHT.bold,
                  marginVertical: pixelSizeVertical(6),
                }}>
                Let's get Started
              </MyText>
              <MyText color={'grey'}>
                Give credentails to sign in your Account
              </MyText>
            </View>
            <View
              style={{
                marginTop: pixelSizeVertical(20),
              }}>
              <InputWrapper title="Email">
                <MyInput
                  keyboardType="email-address"
                  hasError={Boolean(errors.email && touched.email)}
                  onBlur={handleBlur('email')}
                  onChangeText={handleChange('email')}
                  value={values.email.toLocaleLowerCase()}
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
              <InputWrapper title="Password">
                <MyInput
                  hasError={Boolean(errors.password && touched.password)}
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                  value={values.password}
                  leftIcon={() => (
                    <AntDesign
                      size={widthPixel(24)}
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
            </View>

            <TouchableOpacity
              style={{ alignSelf: 'flex-end' }}
              onPress={() => navigation.navigate('ForgetPassword')}>
              <MyText
                color={COLORS.greenDark}
                bold={FONT_WEIGHT.medium}>
                Forget Password ?
              </MyText>
            </TouchableOpacity>
            <View
              style={{
                paddingVertical: pixelSizeVertical(16),
              }}>
              <PrimaryBtn
                loading={loading}
                text="Sign in"
                onPress={handleSubmit}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 4,
                marginVertical: pixelSizeVertical(36),
              }}>
              <MyText
                center
                style={{ color: 'grey', width: 'auto' }}>
                Don’t have an account?
              </MyText>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <MyText
                  bold={FONT_WEIGHT.medium}
                  style={{ color: COLORS.greenDark }}>
                  Signup
                </MyText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MyText>
                I agree to the{' '}
                <Text
                  onPress={() => {
                    setShowTerms(true);
                  }}
                  style={{ color: '#056145', fontWeight: '600' }}>
                  Terms & Conditions
                </Text>{' '}
                and{' '}
                <Text
                  onPress={() => {
                    setShowPrivacy(true);
                  }}
                  style={{ color: '#056145', fontWeight: '600' }}>
                  Privacy Policy
                </Text>
              </MyText>
            </View>
          </ScrollView>
        )}
      </Formik>

      <TnC open={showTerms} handleClose={() => setShowTerms(!showTerms)} />
      <PrivacyPolicy
        open={showPrivacy}
        handleClose={() => setShowPrivacy(!showPrivacy)}
      />
    </LayoutBG>
  );
};

export default LoginScreen;
