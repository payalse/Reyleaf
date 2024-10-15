import {SafeAreaView, ScrollView, View} from 'react-native';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import SelectInput from '../../../components/inputs/SelectInput';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import React, {useState} from 'react';
import {CountryType} from '../../../utils/countryTable';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';
import {SheetManager} from 'react-native-actions-sheet';
import {SHEETS} from '../../../sheets/sheets';
import {api_addUpdateAddress} from '../../../api/auth';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

type FormValues = {
  address: string;
  city: string;
  state: string;
  zipcode: string;
  title?: string;
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
    .max(10, ({max}) => `ZipCode must not exceed ${max} characters`)
    .required('ZipCode is Required!'),
  title: Yup.string().min(
    4,
    ({min}) => `Location title must be at least ${min} characters`,
  ),
});
const AddAddressScreen = () => {
  const navigation = useNavigation();

  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [country, setCoutry] = useState<null | CountryType>(null);
  const [extraErr, setExtraErr] = useState({
    country: '',
  });

  const onSubmit = async (values: FormValues) => {
    let isValid = true;
    if (country === null) {
      setExtraErr(e => ({...e, country: 'Please Choose Country!'}));
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    const payload = {
      address: values.address,
      city: values.city,
      state: values.state,
      country: country?.name,
      zipcode: values.zipcode,
      title: values.title,
    };
    console.log(payload);
    try {
      setLoading(true);
      const res = (await api_addUpdateAddress(payload, token!)) as any;
      navigation.goBack();
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        address: '',
        city: '',
        state: '',
        zipcode: '',
        title: '',
      }}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={{flex: 1}}>
          <SafeAreaView />
          <SecondaryHeader onBack={navigation.goBack} title="Add New Address" />

          <ScrollView contentContainerStyle={{padding: 20, marginTop: 10}}>
            <InputWrapper title="Address">
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
            <InputWrapper title="Location Title">
              <MyInput
                hasError={Boolean(errors.title && touched.title)}
                onBlur={handleBlur('title')}
                onChangeText={handleChange('title')}
                value={values.title}
                placeholder="Type Here ex. Home , Office"
              />
            </InputWrapper>
            <InputWrapper title="City">
              <MyInput
                hasError={Boolean(errors.city && touched.city)}
                onBlur={handleBlur('city')}
                onChangeText={handleChange('city')}
                value={values.city}
                placeholder="Type here"
              />
            </InputWrapper>
            {errors.city && touched.city && <InputErrorMsg msg={errors.city} />}
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
          </ScrollView>

          <View style={{marginBottom: 30, marginHorizontal: 20}}>
            <PrimaryBtn loading={loading} text="Save" onPress={handleSubmit} />
          </View>
        </View>
      )}
    </Formik>
  );
};

export default AddAddressScreen;
