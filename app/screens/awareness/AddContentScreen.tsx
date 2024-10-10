import {View} from 'react-native';
import React, {useState} from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import InputWrapper from '../../components/inputs/InputWrapper';
import TextArea from '../../components/inputs/TextArea';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {Formik} from 'formik';
import * as yup from 'yup';
import {ShowAlert} from '../../utils/alert';
import InputErrorMsg from '../../components/inputs/InputErrorMsg';
import {ALERT_TYPE} from 'react-native-alert-notification';
import { api_forumContent } from '../../api/forum';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { AwarenessStackParams } from '../../naviagtion/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Values = {
  content: string;
};
const validationSchema = yup.object().shape({
  content: yup.string().required('Content is Required!').min(10),
});

const AddContentScreen = () => {
  const params =
  useRoute<RouteProp<AwarenessStackParams, 'AddContent'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();
  useHideBottomBar({unSubDisable: false});
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);

  const onSubmit = async (values: Values) => {
    try {
      const data = {
        content: values.content
      }
      setLoading(true);
      const res: any = await api_forumContent(token!, data, params.id);
    } catch (error: any) {
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('JoinedForumDetail', {
          id: params.id,
        })
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
