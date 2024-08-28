import {View} from 'react-native';
import React, {useState} from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {useNavigation} from '@react-navigation/native';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import InputWrapper from '../../components/inputs/InputWrapper';
import TextArea from '../../components/inputs/TextArea';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {Formik} from 'formik';
import * as yup from 'yup';
import {ShowAlert} from '../../utils/alert';
import InputErrorMsg from '../../components/inputs/InputErrorMsg';
import {ALERT_TYPE} from 'react-native-alert-notification';

type Values = {
  content: string;
};
const validationSchema = yup.object().shape({
  content: yup.string().required('Content is Required!').min(10),
});

const AddContentScreen = () => {
  useHideBottomBar({unSubDisable: false});
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const onSubmit = async (values: Values) => {
    console.log(values);
    try {
      setLoading(true);
      // const res = await api_
    } catch (error: any) {
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setTimeout(() => {
        setLoading(false);
        navigation.goBack();
      }, 1000);
    }
  };
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        content: '',
      }}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <MainLayout
          headerComp={
            <SecondaryHeader
              backBtnContainerStyle={{left: 0}}
              onBack={navigation.goBack}
              title="Add a Content"
            />
          }>
          <View style={{marginVertical: 40}}>
            <InputWrapper title="Type Content">
              <TextArea
                placeholder="Type Here"
                inputStyle={{height: 200, marginVertical: 5}}
                hasError={Boolean(errors.content && touched.content)}
                onBlur={handleBlur('content')}
                onChangeText={handleChange('content')}
                value={values.content}
              />
            </InputWrapper>
            {errors.content && touched.content && (
              <InputErrorMsg msg={errors.content} />
            )}
            <PrimaryBtn loading={loading} text="Post" onPress={handleSubmit} />
          </View>
        </MainLayout>
      )}
    </Formik>
  );
};

export default AddContentScreen;
