import React, {useState} from 'react';
import {View, TouchableOpacity, ScrollView, Image} from 'react-native';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {useNavigation} from '@react-navigation/native';

// COMPONENTS
import BackBtn from '../../../components/buttons/BackBtn';
import {MyText} from '../../../components/MyText';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import MyInput from '../../../components/inputs/MyInput';
import InputWrapper from '../../../components/inputs/InputWrapper';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import APPLOGO from '../../../../assets/svg/icons/icon.svg';
import LayoutBG from '../../../components/layout/LayoutBG';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../../naviagtion/types';
import {AuthUserType} from '../../../types';
import {AppDispatch} from '../../../redux/store';
import {useDispatch} from 'react-redux';
import {
  login,
  setIsAuthenticated,
} from '../../../redux/features/auth/authSlice';
import {
  changeAppMode,
  setFirstLaunched,
} from '../../../redux/features/app/appSlice';
import {Formik} from 'formik';
import * as yup from 'yup';
import {api_login} from '../../../api/auth';
import {LoginResponseType} from '../../../types/apiResponse';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';

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
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is Required!'),
});
const VendorLoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: LoginValues) => {
    console.log(values);

    try {
      setLoading(true);
      const res = (await api_login({
        ...values,
        email: values.email.toLocaleLowerCase(),
      })) as LoginResponseType;
      // ShowAlert({textBody: res.message});
      dispatch(login({...res.data, token: res.token}));
      // not verfied
      if (res.data.account_status === 1) {
        navigation.navigate('VendorOtpVerification', {
          verifyToken: res.data._id,
          authToken: res.token,
        });
        return;
      }
      // if (res.data.profile_status === 1) {
      //   navigation.navigate('CompleteYourBusinessProfile', {
      //     authToken: res.token,
      //   });
      //   return;
      // }
      // verfied or active
      if (res.data.account_status === 2) {
        dispatch(changeAppMode('VENDOR'));
        dispatch(setIsAuthenticated(true));
        dispatch(setFirstLaunched(false));
      }
      if (res.data.account_status === 3) {
        ShowAlert({textBody: 'Account is Blocked!', type: ALERT_TYPE.DANGER});
      }
      if (res.data.account_status === 4) {
        ShowAlert({textBody: 'Account is Deleted!', type: ALERT_TYPE.DANGER});
      }
    } catch (error: any) {
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
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
            style={{flex: 1, marginHorizontal: 20}}
            showsVerticalScrollIndicator={false}>
            <View>
              <BackBtn onPress={navigation.goBack} />
              <View
                style={{
                  alignItems: 'center',
                }}>
                <APPLOGO width={120} height={200} />
              </View>
            </View>

            <View style={{width: '90%'}}>
              <MyText
                style={{
                  fontSize: FONT_SIZE['3xl'],
                  fontWeight: FONT_WEIGHT.bold,
                  marginVertical: 10,
                }}>
                Let's get Started
              </MyText>
              <MyText size={FONT_SIZE.sm} color={'grey'}>
                Give credentails to sign in your Account
              </MyText>
            </View>
            <View
              style={{
                marginTop: 20,
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
                  placeholder="Type Your Password"
                />
              </InputWrapper>
              {errors.password && touched.password && (
                <InputErrorMsg msg={errors.password} />
              )}
            </View>

            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              onPress={() => navigation.navigate('VendorForgetPassword')}>
              <MyText
                size={FONT_SIZE.sm}
                color={COLORS.greenDark}
                bold={FONT_WEIGHT.medium}>
                Forget Password ?
              </MyText>
            </TouchableOpacity>
            <View
              style={{
                paddingVertical: 20,
                gap: 20,
              }}>
              <PrimaryBtn
                loading={loading}
                onPress={handleSubmit}
                text="Sign in"
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 6,
                marginVertical: 50,
              }}>
              <MyText center size={FONT_SIZE.sm} style={{color: 'grey'}}>
                Don’t have an Business account?
              </MyText>
              <TouchableOpacity
                onPress={() => navigation.navigate('VendorSignup')}>
                <MyText
                  bold={FONT_WEIGHT.medium}
                  size={FONT_SIZE.sm}
                  style={{color: COLORS.greenDark}}>
                  Signup
                </MyText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Formik>
    </LayoutBG>
  );
};

export default VendorLoginScreen;
