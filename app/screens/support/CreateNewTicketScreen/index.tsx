import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, FONT_SIZE, FONT_WEIGHT, hp, wp } from '../../../styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { useNavigation } from '@react-navigation/native';
import { MyText } from '../../../components/MyText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SupportStackParams } from '../../../naviagtion/DrawerNavigator';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import InputWrapper from '../../../components/inputs/InputWrapper';
import TextArea from '../../../components/inputs/TextArea';
import MyInput from '../../../components/inputs/MyInput';
import SelectInput from '../../../components/inputs/SelectInput';
import { SheetManager } from 'react-native-actions-sheet';
import { SHEETS } from '../../../sheets/sheets';
import { ShowAlert } from '../../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import { api_addSupportTicket } from '../../../api/support';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';

type FormValues = {
  title: string;
  description: string;
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Required').required('Title is Required!'),
  description: Yup.string()
    .required('Required')
    .required('Description is Required!'),
});

const CreateNewTicketScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SupportStackParams>>();
  const { token } = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState(null);
  const onSubmit = async (values: FormValues) => {
    if (!subject) {
      ShowAlert({ textBody: 'Select your subject', type: ALERT_TYPE.DANGER });
      return
    }
    const payload = {
      title: values.title,
      subject: subject,
      description: values.description,
    };

    try {
      setLoading(true);
      const res: any = await api_addSupportTicket(token!, payload);
      ShowAlert({
        textBody: 'Your support ticket has been added',
        type: ALERT_TYPE.SUCCESS,
      });
      navigation.navigate('SupportChat', { item :res?.data});
    } catch (error: any) {
      ShowAlert({ textBody: error.message, type: ALERT_TYPE.DANGER });
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Create Ticket" />
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          title: '',
          description: '',
        }}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={{ margin: 20 }}>
            <View style={{ height: 80 }}>
              <InputWrapper title="Ticket title">
                <MyInput
                  inputStyle={{ fontSize: FONT_SIZE.base }}
                  placeholder="Type here"
                  hasError={Boolean(errors.title && touched.title)}
                  onBlur={handleBlur('title')}
                  onChangeText={handleChange('title')}
                  value={values.title}
                />
              </InputWrapper>
            </View>
              {errors.title && touched.title && (
                <InputErrorMsg textStyle={{marginTop: 10, marginLeft: 10, textAlign: 'left'}} msg={errors.title} />
              )}
            <View style={{ height: 80, marginVertical: 10, marginBottom: 15 }}>
              <InputWrapper title="Select Subject">
                <SelectInput
                  placeholder="Select here"
                  value={subject !== null ? subject : ''}
                  onPress={() => {
                    SheetManager.show(SHEETS.SubjectSelectSheet, {
                      //@ts-ignore
                      payload: {
                        onSelect: (e: any) => {
                          setSubject(e);
                        },
                      },
                    });
                  }}
                />
              </InputWrapper>
            </View>
            <View style={{ height: 170 }}>
              <InputWrapper title="Description">
                <TextArea
                  inputStyle={{ fontSize: FONT_SIZE.base }}
                  placeholder="Type Here"
                  hasError={Boolean(errors.description && touched.description)}
                  onBlur={handleBlur('description')}
                  onChangeText={handleChange('description')}
                  value={values.description}
                />
              </InputWrapper>
            </View>
              {errors.description && touched.description && (
                <InputErrorMsg textStyle={{marginTop: -10, marginLeft: 10, textAlign: 'left'}} msg={errors.description} />
              )}
            <PrimaryBtn text="Send Message" conatinerStyle={{marginTop: 20}} onPress={handleSubmit}/>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default CreateNewTicketScreen;
