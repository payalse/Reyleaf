import {
  Image,
  Platform,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import InputWrapper from '../../components/inputs/InputWrapper';
import MyInput from '../../components/inputs/MyInput';
import TextArea from '../../components/inputs/TextArea';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import { COLORS, FONT_SIZE } from '../../styles';
import { MyText } from '../../components/MyText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useHideBottomBar } from '../../hook/useHideBottomBar';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ShowAlert } from '../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import InputErrorMsg from '../../components/inputs/InputErrorMsg';
import ImageCropPicker, {
  Image as ImageType,
} from 'react-native-image-crop-picker';
import FullScreenLoader from '../../components/FullScreenLoader';
import { api_addResource } from '../../api/awareness';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useAppAlert } from '../../context/AppAlertContext';
import SelectInput from '../../components/inputs/SelectInput';
import { SHEETS } from '../../sheets/sheets';
import { SheetManager } from 'react-native-actions-sheet';
import { CategoryType } from '../../types';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { api_addEvent } from '../../api/event';

type Values = {
  description: string;
  title: string;
  location: string;
};
const validationSchema = yup.object().shape({
  description: yup.string().required('Description is Required!'),
  title: yup.string().required('Title is Required!'),
  location: yup.string().required('Location is Required!'),
});

const AddEventScreen = () => {
  useHideBottomBar({});
  const { token } = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectCategory, setSelectCategory] = useState<null | CategoryType>(
    null,
  );
  const [extraError, setExtraError] = useState({ image: '', date: '' });
  const { showModal } = useAppAlert()!;

  const handlePickImage = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true,
    })
      .then(res => {
        setSelectedImage(res);
      })
      .catch(err => console.log(err))
      .finally(() => setExtraError({ ...extraError, image: '' }));
  };

  const onSubmit = async (values: Values) => {
    console.log(date, 'dat');  
    if (!selectedImage) {
      setExtraError({ ...extraError, image: 'Please select image' });
      return;
    }

    if (selectCategory === null) {
      showModal({ text: 'Please select a category' });
      return;
    }

   

    const imagePayload = {
      name: Date.now().toString() + '.png',
      type: selectedImage?.mime,
      uri:
        Platform.OS !== 'android'
          ? 'file://' + selectedImage?.path
          : selectedImage?.path,
    };
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('picture', imagePayload);
    formData.append('category', selectCategory?._id);
    formData.append('address', values.location);
    formData.append('eventDate', date);

    try {
      setLoading(true);
      const res = await api_addEvent(token!, formData);
      navigation.goBack();
      showModal({ text: 'Event Created!' });
    } catch (error: any) {
      showModal({ text: error.message, isError: true });
    } finally {
      setLoading(false)
    }
  };
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        description: '',
        title: '',
        location: '',
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
        <MainLayout
          headerComp={
            <SecondaryHeader
              backBtnContainerStyle={{ left: 0 }}
              onBack={navigation.goBack}
              title="Create New Event"
            />
          }
        >
          {loading && <FullScreenLoader />}
          <DatePicker
            modal
            mode="date"
            open={isDateModalOpen}
            locale="en"
            minimumDate={new Date(String(new Date().getFullYear() - 60))}
            maximumDate={new Date()}
            date={date === null ? new Date() : date}
            onConfirm={date => {
              setDate(() => date);
              setIsDateModalOpen(false);
              setExtraError(prev => ({ ...prev, date: '' }));
            }}
            onCancel={() => setIsDateModalOpen(false)}
          />
          {loading && <FullScreenLoader />}
          <View style={{ marginVertical: 30 }}>
            <View style={{ marginVertical: 20 }}>
              <TouchableOpacity
                onPress={handlePickImage}
                style={{
                  backgroundColor: COLORS.white,
                  width: 100,
                  height: 100,
                  alignSelf: 'center',
                  borderRadius: 100,
                  marginBottom: 10,
                  position: 'relative',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage.path }}
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: COLORS.white,
                      width: 100,
                      height: 100,
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <MaterialIcons
                    name="image"
                    size={40}
                    color={COLORS.lightgrey}
                  />
                )}
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 28,
                    backgroundColor: COLORS.greenDark,
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons
                    name="cloud-upload-sharp"
                    size={15}
                    color={COLORS.white}
                  />
                </View>
              </TouchableOpacity>
              <MyText color={COLORS.grey} size={FONT_SIZE.sm} center>
                Upload Event Image
              </MyText>
              {extraError.image && <InputErrorMsg msg={extraError.image} />}
            </View>
            <InputWrapper title="Event Title">
              <MyInput
                placeholder="Event Title"
                hasError={Boolean(errors.title && touched.title)}
                onBlur={handleBlur('title')}
                onChangeText={handleChange('title')}
                value={values.title}
              />
            </InputWrapper>
            {errors.title && touched.title && (
              <InputErrorMsg msg={errors.title} />
            )}
            <InputWrapper title="Product Category">
              <SelectInput
                value={selectCategory !== null ? selectCategory?.name : ''}
                placeholder="Select from here"
                onPress={() => {
                  SheetManager.show(SHEETS.CategorySelectSheet, {
                    // @ts-ignore
                    payload: {
                      onSelect: (data: any) => {
                        setSelectCategory(data);
                      },
                    },
                  });
                }}
              />
            </InputWrapper>
            <InputWrapper title="Date">
              <SelectInput
                value={date === null ? '' : moment(date).format('MM/DD/YYYY')}
                onPress={() => setIsDateModalOpen(true)}
                hasError={!!extraError.date}
                hideRightIcon
                placeholder="Choose Date"
              />
            </InputWrapper>
            <InputWrapper title="Location">
              <MyInput
                placeholder="Type Here"
                hasError={Boolean(errors.location && touched.location)}
                onBlur={handleBlur('location')}
                onChangeText={handleChange('location')}
                value={values.location}
              />
            </InputWrapper>
            {errors.location && touched.location && (
              <InputErrorMsg msg={errors.location} />
            )}
            <InputWrapper title="Description">
              <TextArea
                placeholder="Type Here"
                hasError={Boolean(errors.description && touched.description)}
                onBlur={handleBlur('description')}
                onChangeText={handleChange('description')}
                value={values.description}
              />
            </InputWrapper>
            {errors.description && touched.description && (
              <InputErrorMsg msg={errors.description} />
            )}
          </View>
          <PrimaryBtn
            onPress={handleSubmit}
            conatinerStyle={{ marginBottom: 50 }}
            text="Create"
          />
        </MainLayout>
      )}
    </Formik>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({});
