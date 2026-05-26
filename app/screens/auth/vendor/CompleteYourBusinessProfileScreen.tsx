import {ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import LayoutBG from '../../../components/layout/LayoutBG';
import BackBtn from '../../../components/buttons/BackBtn';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../../naviagtion/types';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../redux/store';
import {api_createVendorProfile} from '../../../api/user';
import {updateUser} from '../../../redux/features/auth/authSlice';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';
import {
  pixelSizeVertical,
} from '../../../utils/sizeNormalization';

type FormValues = {
  fullname: string;
  companyName: string;
  phone: string;
  companyAddress: string;
};

const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .trim()
    .min(2, ({min}) => `Name must be at least ${min} characters`)
    .required('Full name is Required!'),
  companyName: Yup.string()
    .trim()
    .min(2, ({min}) => `Company name must be at least ${min} characters`)
    .required('Company name is Required!'),
  phone: Yup.string()
    .trim()
    .min(7, ({min}) => `Phone must be at least ${min} characters`)
    .required('Phone is Required!'),
  companyAddress: Yup.string().trim(),
});

const CompleteYourBusinessProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const params =
    useRoute<RouteProp<RootStackParams, 'CompleteYourBusinessProfile'>>()
      .params;
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const res = (await api_createVendorProfile(
        {
          fullname: values.fullname.trim(),
          phone: values.phone.trim(),
          companyName: values.companyName.trim(),
          companyAddress: values.companyAddress.trim() || undefined,
        },
        params.authToken,
      )) as any;
      if (res?.data) {
        dispatch(updateUser(res.data));
      }
      navigation.navigate('VendorOnboarding', {authToken: params.authToken});
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
          fullname: '',
          companyName: '',
          phone: '',
          companyAddress: '',
        }}
        onSubmit={onSubmit}>
        {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
          <ScrollView
            contentContainerStyle={{marginHorizontal: 20, paddingBottom: 50}}>
            <BackBtn onPress={navigation.goBack} />

            <MyText
              bold={FONT_WEIGHT.bold}
              size={FONT_SIZE['2xl']}
              center
              style={{
                marginTop: pixelSizeVertical(24),
                marginBottom: pixelSizeVertical(8),
              }}>
              Complete Your Account
            </MyText>
            <MyText
              center
              color={COLORS.grey}
              size={FONT_SIZE.sm}
              style={{marginBottom: pixelSizeVertical(24)}}>
              Tell us about yourself and your business
            </MyText>

            <View style={{marginTop: pixelSizeVertical(8)}}>
              <InputWrapper title="Full Name">
                <MyInput
                  hasError={Boolean(errors.fullname && touched.fullname)}
                  onBlur={handleBlur('fullname')}
                  onChangeText={handleChange('fullname')}
                  value={values.fullname}
                  placeholder="Your full name"
                />
              </InputWrapper>
              {errors.fullname && touched.fullname && (
                <InputErrorMsg msg={errors.fullname} />
              )}

              <InputWrapper title="Company Name">
                <MyInput
                  hasError={Boolean(errors.companyName && touched.companyName)}
                  onBlur={handleBlur('companyName')}
                  onChangeText={handleChange('companyName')}
                  value={values.companyName}
                  placeholder="Your business / company name"
                />
              </InputWrapper>
              {errors.companyName && touched.companyName && (
                <InputErrorMsg msg={errors.companyName} />
              )}

              <InputWrapper title="Mobile No">
                <MyInput
                  keyboardType="phone-pad"
                  hasError={Boolean(errors.phone && touched.phone)}
                  onBlur={handleBlur('phone')}
                  onChangeText={handleChange('phone')}
                  value={values.phone}
                  placeholder="+1234567890"
                />
              </InputWrapper>
              {errors.phone && touched.phone && (
                <InputErrorMsg msg={errors.phone} />
              )}

              <InputWrapper title="Company Address (Optional)">
                <MyInput
                  onBlur={handleBlur('companyAddress')}
                  onChangeText={handleChange('companyAddress')}
                  value={values.companyAddress}
                  placeholder="Street, city, country"
                />
              </InputWrapper>

              <PrimaryBtn
                loading={loading}
                onPress={handleSubmit}
                text="Next"
                conatinerStyle={{marginTop: pixelSizeVertical(10)}}
              />
            </View>
          </ScrollView>
        )}
      </Formik>
    </LayoutBG>
  );
};

export default CompleteYourBusinessProfileScreen;
