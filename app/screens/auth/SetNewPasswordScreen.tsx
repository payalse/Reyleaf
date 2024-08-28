import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import LayoutBG from '../../components/layout/LayoutBG';
import BackBtn from '../../components/buttons/BackBtn';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import InputWrapper from '../../components/inputs/InputWrapper';
import MyInput from '../../components/inputs/MyInput';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PasswordUpdatedModel from '../../components/modal/PasswordUpdatedModel';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../naviagtion/types';

import {Formik} from 'formik';
import * as Yup from 'yup';
import InputErrorMsg from '../../components/inputs/InputErrorMsg';
import {ShowAlert} from '../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {api_setNewPassword} from '../../api/auth';

type FormValues = {
  password: string;
  confirmPassword: string;
};
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is Required!'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Retype Password is Required!'),
});

const SetNewPasswordScreen = () => {
  const params =
    useRoute<RouteProp<RootStackParams, 'SetNewPassword'>>().params;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const res = (await api_setNewPassword({
        refId: params.verifyToken,
        newPassword: values.password,
        otp: params.otp,
      })) as any;
      console.log(res);
      setIsModalOpen(true);
    } catch (error: any) {
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setLoading(false);
    }
  };
  return (
    <LayoutBG type="bg-leaf">
      <PasswordUpdatedModel
        onPress={() => navigation.navigate('Login')}
        visible={isModalOpen}
      />
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          password: '',
          confirmPassword: '',
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
                Set New Password
              </MyText>
              <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                Set your password here whatever you wanted
              </MyText>
            </View>
            <View style={{marginTop: 20}}>
              <InputWrapper title="New Password">
                <MyInput
                  hasError={Boolean(errors.password && touched.password)}
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                  value={values.password}
                  isPassword
                  placeholder="Type your password"
                  leftIcon={() => (
                    <AntDesign
                      size={24}
                      color={COLORS.lightgrey}
                      name="lock1"
                    />
                  )}
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
                  isPassword
                  placeholder="Retype Password"
                  leftIcon={() => (
                    <AntDesign
                      size={24}
                      color={COLORS.lightgrey}
                      name="lock1"
                    />
                  )}
                />
              </InputWrapper>
              {errors.confirmPassword && touched.confirmPassword && (
                <InputErrorMsg msg={errors.confirmPassword} />
              )}
              <PrimaryBtn
                loading={loading}
                onPress={handleSubmit}
                text="Submit"
                conatinerStyle={{marginTop: 10}}
              />
            </View>
          </ScrollView>
        )}
      </Formik>
    </LayoutBG>
  );
};

export default SetNewPasswordScreen;
