import {
  Image,
  Platform,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import InputWrapper from '../../components/inputs/InputWrapper';
import MyInput from '../../components/inputs/MyInput';
import TextArea from '../../components/inputs/TextArea';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import {COLORS, FONT_SIZE} from '../../styles';
import {MyText} from '../../components/MyText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {Formik} from 'formik';
import * as yup from 'yup';
import {ShowAlert} from '../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import InputErrorMsg from '../../components/inputs/InputErrorMsg';
import ImageCropPicker, {
  Image as ImageType,
} from 'react-native-image-crop-picker';
import FullScreenLoader from '../../components/FullScreenLoader';
import {api_addResource} from '../../api/awareness';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {useAppAlert} from '../../context/AppAlertContext';

type Values = {
  description: string;
  title: string;
};
const validationSchema = yup.object().shape({
  description: yup.string().required('Description is Required!'),
  title: yup.string().required('Title is Required!'),
});

const AddResourceScreen = () => {
  useHideBottomBar({});
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [extraError, setExtraError] = useState({image: ''});
  const {showModal} = useAppAlert()!;

  const handlePickImage = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true,
    })
      .then(res => {
        console.log(res);
        setSelectedImage(res);
      })
      .catch(err => console.log(err))
      .finally(() => setExtraError({...extraError, image: ''}));
  };

  const onSubmit = async (values: Values) => {
    if (!selectedImage) {
      setExtraError({...extraError, image: 'Please select image'});
      return;
    }
    console.log(values);
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

    try {
      setLoading(true);
      const res = await api_addResource(token!, formData);
      console.log(res);
      navigation.goBack();
      showModal({text: 'Resource Created!'});
    } catch (error: any) {
      showModal({text: error.message, isError: true});
      // ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        description: '',
        title: '',
      }}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <MainLayout
          headerComp={
            <SecondaryHeader
              backBtnContainerStyle={{left: 0}}
              onBack={navigation.goBack}
              title="Add New Resource"
            />
          }>
          {loading && <FullScreenLoader />}
          <View style={{marginVertical: 30}}>
            <View style={{marginVertical: 20}}>
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
                }}>
                {selectedImage ? (
                  <Image
                    source={{uri: selectedImage.path}}
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
                  }}>
                  <Ionicons
                    name="cloud-upload-sharp"
                    size={15}
                    color={COLORS.white}
                  />
                </View>
              </TouchableOpacity>
              <MyText color={COLORS.grey} size={FONT_SIZE.sm} center>
                Upload Your Image
              </MyText>
              {extraError.image && <InputErrorMsg msg={extraError.image} />}
            </View>
            <InputWrapper title="Resource Title">
              <MyInput
                placeholder="Type Here"
                hasError={Boolean(errors.title && touched.title)}
                onBlur={handleBlur('title')}
                onChangeText={handleChange('title')}
                value={values.title}
              />
            </InputWrapper>
            {errors.title && touched.title && (
              <InputErrorMsg msg={errors.title} />
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
          <PrimaryBtn onPress={handleSubmit} text="Create" />
        </MainLayout>
      )}
    </Formik>
  );
};

export default AddResourceScreen;

const styles = StyleSheet.create({});
