import {View} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../../naviagtion/types';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {api_chnagePassword} from '../../../api/user';
import {RootState} from '../../../redux/store';
import {useSelector} from 'react-redux';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';
import {useAppAlert} from '../../../context/AppAlertContext';

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required('Required')
    .required('Old Password is Required!'),
  newPassword: Yup.string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .oneOf([Yup.ref('confirmPassword')], 'Passwords must match')
    .required('Password is Required!'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm Password is Required!'),
});
const ChangePasswordScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const {showModal} = useAppAlert()!;
  const formRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const res = (await api_chnagePassword(values, token!)) as any;
      console.log(res);
      // ShowAlert({textBody: res.message, type: ALERT_TYPE.SUCCESS});
      showModal({text: res.message});
      formRef.current.handleReset();
      navigation.goBack();
    } catch (error: any) {
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setLoading(false);
    }
  };
  return (
    <MainLayout
      headerComp={
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{left: 0}}
          title="Change Password"
        />
      }>
      <Formik
        innerRef={formRef}
        validationSchema={validationSchema}
        initialValues={{
          oldPassword: '',
          newPassword: '',
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
          <View style={{marginTop: 20}}>
            <InputWrapper title="Old Password">
              <MyInput
                placeholder="Type here"
                hasError={Boolean(errors.oldPassword && touched.oldPassword)}
                onBlur={handleBlur('oldPassword')}
                onChangeText={handleChange('oldPassword')}
                value={values.oldPassword}
              />
            </InputWrapper>
            {errors.oldPassword && touched.oldPassword && (
              <InputErrorMsg msg={errors.oldPassword} />
            )}
            <InputWrapper title="New Password">
              <MyInput
                placeholder="Type here"
                hasError={Boolean(errors.newPassword && touched.newPassword)}
                onBlur={handleBlur('newPassword')}
                onChangeText={handleChange('newPassword')}
                value={values.newPassword}
              />
            </InputWrapper>
            {errors.newPassword && touched.newPassword && (
              <InputErrorMsg msg={errors.newPassword} />
            )}
            <InputWrapper title="New Password Confirm">
              <MyInput
                placeholder="Type here"
                hasError={Boolean(
                  errors.confirmPassword && touched.confirmPassword,
                )}
                onBlur={handleBlur('confirmPassword')}
                onChangeText={handleChange('confirmPassword')}
                value={values.confirmPassword}
              />
            </InputWrapper>
            {errors.confirmPassword && touched.confirmPassword && (
              <InputErrorMsg msg={errors.confirmPassword} />
            )}
            <PrimaryBtn
              loading={loading}
              onPress={handleSubmit}
              text="Update"
              conatinerStyle={{marginTop: 10, marginBottom: 20}}
            />
          </View>
        )}
      </Formik>
    </MainLayout>
  );
};

export default ChangePasswordScreen;
