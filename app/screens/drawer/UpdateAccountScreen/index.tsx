import {SafeAreaView, ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import {useNavigation} from '@react-navigation/native';
// @ts-ignore
import Stripe from 'react-native-stripe-api';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {api_createCard} from '../../../api/payment';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {Formik} from 'formik';
import * as yup from 'yup';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';
import {STRIPE_PK} from '../../../../App';
import SelectInput from '../../../components/inputs/SelectInput';

type Values = {
  expirydate: string;
  cardName: string;
  name: string;
  CVV: string;
  number: string;
};

const expirydateRegx = /^\d{2}\/\d{2}$/;
const validationSchema = yup.object().shape({
  expirydate: yup
    .string()
    .matches(expirydateRegx, {
      message: 'expiry date must be in: MM/YY',
    })
    .required('expirydate is Required!'),
  cardName: yup.string().required('cardName is Required!'),
  name: yup.string().required('name is Required!'),
  number: yup
    .string()
    .min(16, ({min}) => `Number must be at least ${min} characters`)
    .max(16, ({min}) => `Number must be not be  longer than ${min} characters`)
    .required('number is Required!'),
  CVV: yup.number().required('CVV is Required!'),
});

const UpdateAccount = () => {
  const {user: auth, token: authToken} = useSelector((s: RootState) => s.auth);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const getToken = async (values: Values) => {
    console.log('HERE');
    const apiKey = STRIPE_PK;
    const [exm, exy] = values.expirydate.split('/');
    try {
      setLoading(true);
      const client = new Stripe(apiKey);
      const token = await client.createToken({
        name: values.name,
        number: values.number,
        exp_month: Number(exm),
        exp_year: Number(exy),
        cvc: values.CVV,
        address_zip: '12345',
      });
      if (token.error) {
        throw new Error(token.error.message);
      }
      const stripeCustomerId = auth?.stripeCustomerId;
      if (!stripeCustomerId) {
        throw new Error('this user have not stripeCustomerId');
      }
      const source = token.id;
      const res: any = await api_createCard(
        {
          customerId: stripeCustomerId,
          source,
        },
        authToken!,
      );
      console.log(res);
      ShowAlert({
        textBody: res?.message || 'success',
        type: ALERT_TYPE.SUCCESS,
      });
      navigation.goBack();
    } catch (error: any) {
      console.log(error);
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        cardName: '',
        CVV: '',
        expirydate: '',
        name: '',
        number: '',
      }}
      onSubmit={getToken}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={{flex: 1}}>
          {/* ------ */}
          <SafeAreaView />
          <SecondaryHeader onBack={navigation.goBack} title="Update Account" />
          <ScrollView contentContainerStyle={{padding: 20, marginTop: 10}}>
            <InputWrapper title="Bank Name">
              <MyInput
                placeholder="Type Here"
                hasError={Boolean(errors.cardName && touched.cardName)}
                onBlur={handleBlur('cardName')}
                onChangeText={handleChange('cardName')}
                value={values.cardName}
              />
              {errors.cardName && touched.cardName && (
                <InputErrorMsg msg={errors.cardName} />
              )}
            </InputWrapper>
            <InputWrapper title="Sekect AccountType">
              <SelectInput placeholder="Select from here" />
              {errors.name && touched.name && (
                <InputErrorMsg msg={errors.name} />
              )}
            </InputWrapper>
            <InputWrapper title="Account Number">
              <MyInput
                keyboardType="numeric"
                placeholder="Type Here"
                hasError={Boolean(errors.number && touched.number)}
                onBlur={handleBlur('number')}
                onChangeText={handleChange('number')}
                value={values.number}
              />
              {errors.number && touched.number && (
                <InputErrorMsg msg={errors.number} />
              )}
            </InputWrapper>
            <InputWrapper title="Routing Number">
              <MyInput
                keyboardType="numeric"
                placeholder="Type Here"
                hasError={Boolean(errors.CVV && touched.CVV)}
                onBlur={handleBlur('CVV')}
                onChangeText={handleChange('CVV')}
                value={values.CVV}
              />
              {errors.CVV && touched.CVV && <InputErrorMsg msg={errors.CVV} />}
            </InputWrapper>
          </ScrollView>
          <View style={{marginBottom: 30, gap: 10, marginHorizontal: 20}}>
            <PrimaryBtn text="Save" loading={loading} onPress={handleSubmit} />
          </View>
        </View>
      )}
    </Formik>
  );
};

export default UpdateAccount;
