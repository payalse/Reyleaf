import React, {useState} from 'react';
import {ScrollView, View, SafeAreaView} from 'react-native';
import LayoutBG from '../../../components/layout/LayoutBG';
import BackBtn from '../../../components/buttons/BackBtn';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import PasswordUpdatedModel from '../../../components/modal/PasswordUpdatedModel';
import SelectInput from '../../../components/inputs/SelectInput';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../../naviagtion/types';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {updateUser} from '../../../redux/features/auth/authSlice';
import {ShowAlert} from '../../../utils/alert';
import {api_addUpdateAddress} from '../../../api/auth';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../redux/store';
import {CountryType} from '../../../utils/countryTable';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';
import {SheetManager} from 'react-native-actions-sheet';
import {SHEETS} from '../../../sheets/sheets';

type FormValues = {
  address: string;
  city: string;
  state: string;
  zipcode: string;
};
const validationSchema = Yup.object().shape({
  address: Yup.string()
    .min(10, ({min}) => `Address must be at least ${min} characters`)
    .required('Address is Required!'),
  city: Yup.string()
    .min(4, ({min}) => `City must be at least ${min} characters`)
    .required('City is Required!'),
  state: Yup.string()
    .min(4, ({min}) => `State must be at least ${min} characters`)
    .required('State is Required!'),
  zipcode: Yup.string()
    .min(4, ({min}) => `ZipCode must be at least ${min} characters`)
    .required('ZipCode is Required!'),
});

const AddYourBusinessAddressScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const params =
    useRoute<RouteProp<RootStackParams, 'AddYourBusinessAddress'>>().params;
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [country, setCoutry] = useState<null | CountryType>(null);
  const [extraErr, setExtraErr] = useState({
    country: '',
  });
  console.log({country});
  const onSubmit = async (values: FormValues) => {
    let isValid = true;
    if (country === null) {
      setExtraErr(e => ({...e, country: 'Please Choose Country!'}));
      isValid = false;
    }

    if (!isValid) return;
    const payload = {
      address: values.address,
      city: values.city,
      state: values.state,
      country: country?.name,
      zipcode: values.zipcode,
    };
    console.log(payload, params);
    try {
      setLoading(true);
      const res = (await api_addUpdateAddress(
        payload,
        params.authToken,
      )) as any;
      dispatch(updateUser(res));
      navigation.navigate('AccountCreatedSuccess')
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
          address: '',
          city: '',
          state: '',
          zipcode: '',
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
                Add your Business Address
              </MyText>
              <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              Enter your business address to help customers find you easily.
              </MyText>
            </View>
            <View style={{marginTop: 20}}>
              <InputWrapper title="Business Address">
                <MyInput
                  hasError={Boolean(errors.address && touched.address)}
                  onBlur={handleBlur('address')}
                  onChangeText={handleChange('address')}
                  value={values.address}
                  placeholder="Type here"
                />
              </InputWrapper>
              {errors.address && touched.address && (
                <InputErrorMsg msg={errors.address} />
              )}
              <InputWrapper title="City">
                <MyInput
                  hasError={Boolean(errors.city && touched.city)}
                  onBlur={handleBlur('city')}
                  onChangeText={handleChange('city')}
                  value={values.city}
                  placeholder="Type here"
                />
              </InputWrapper>
              {errors.city && touched.city && (
                <InputErrorMsg msg={errors.city} />
              )}
              <InputWrapper title="State">
                <MyInput
                  hasError={Boolean(errors.state && touched.state)}
                  onBlur={handleBlur('state')}
                  onChangeText={handleChange('state')}
                  value={values.state}
                  placeholder="Type here"
                />
              </InputWrapper>
              {errors.state && touched.state && (
                <InputErrorMsg msg={errors.state} />
              )}
              <InputWrapper title="Country">
                <SelectInput
                  placeholder="Select from here"
                  value={country !== null ? country.name : ''}
                  onPress={() => {
                    SheetManager.show(SHEETS.CountrySelectSheet, {
                      //@ts-ignore
                      payload: {
                        onSelect: (e: CountryType) => {
                          setCoutry(e);
                          setExtraErr(prev => ({...prev, country: ''}));
                        },
                      },
                    });
                  }}
                />
              </InputWrapper>
              {extraErr.country && <InputErrorMsg msg={extraErr.country} />}
              <InputWrapper title="Zip Code">
                <MyInput
                  keyboardType="numeric"
                  hasError={Boolean(errors.zipcode && touched.zipcode)}
                  onBlur={handleBlur('zipcode')}
                  onChangeText={handleChange('zipcode')}
                  value={values.zipcode}
                  placeholder="Type here"
                />
              </InputWrapper>
              {errors.zipcode && touched.zipcode && (
                <InputErrorMsg msg={errors.zipcode} />
              )}
              <PrimaryBtn
                loading={loading}
                onPress={handleSubmit}
                text="Next"
                conatinerStyle={{marginTop: 10, marginBottom: 40}}
              />
            </View>
          </ScrollView>
        )}
      </Formik>
      <SafeAreaView />
    </LayoutBG>
  );
};

export default AddYourBusinessAddressScreen;
