import {FlatList, Image, Platform, Pressable, View} from 'react-native';
import React, {useState} from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {COLORS, FONT_SIZE} from '../../../styles';
import {MyText} from '../../../components/MyText';
import InputWrapper from '../../../components/inputs/InputWrapper';
import TextArea from '../../../components/inputs/TextArea';
import {useNavigation} from '@react-navigation/native';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';

import {Formik} from 'formik';
import * as yup from 'yup';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';
import ImageCropPicker, {
  Image as ImageType,
} from 'react-native-image-crop-picker';
import {api_feedCreate} from '../../../api/feeds';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Values = {
  description: string;
};
const ValidationSchema = yup.object().shape({
  description: yup
    .string()
    .min(8, ({min}) => `Description must be at least ${min} characters`)
    .required('Description is Required!'),
});

const CreateFeedScreen = () => {
  useHideBottomBar({});
  const navigation = useNavigation();
  const {token} = useSelector((s: RootState) => s.auth);
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [extraErrors, setExtraErrors] = useState({
    image: '',
  });

  const openPicker = async () => {
    ImageCropPicker.openPicker({
      cropping: true,
      multiple: true,
      mediaType: 'photo',
    }).then(image => {
      setImages(image);
      setExtraErrors({...extraErrors, image: ''});
    });
  };
  const onSubmit = async (values: Values) => {
    console.log(values);
    if (!images.length) {
      setExtraErrors({...extraErrors, image: 'Atleast Select One Image'});
      return;
    }

    const formData = new FormData();
    formData.append('description', values.description);
    for (const i of images) {
      const imageObj = {
        name: Date.now().toString() + '.png',
        type: i?.mime,
        uri: Platform.OS !== 'android' ? 'file://' + i?.path : i?.path,
      };
      formData.append('photos', imageObj);
    }
    try {
      setLoading(true);
      const res = await api_feedCreate(token!, formData);
      console.log(res);
      ShowAlert({textBody: 'Feed Created!', type: ALERT_TYPE.SUCCESS});
      navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Formik
      validationSchema={ValidationSchema}
      initialValues={{
        description: '',
      }}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <MainLayout
          headerComp={
            <SecondaryHeader
              backBtnContainerStyle={{left: 0}}
              onBack={navigation.goBack}
              title="Create a Feed"
            />
          }>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={openPicker}
              style={{
                backgroundColor: COLORS.white,
                width: 100,
                height: 100,
                borderRadius: 100 / 2,
                alignSelf: 'center',
                marginTop: 50,
                marginBottom: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Entypo
                name="images"
                size={FONT_SIZE['3xl']}
                color={COLORS.grey}
              />

              <View
                style={{
                  backgroundColor: COLORS.greenDark,
                  width: 25,
                  height: 25,
                  borderRadius: 25 / 2,
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign
                  onPress={openPicker}
                  name="cloudupload"
                  size={FONT_SIZE.base}
                  color={COLORS.white}
                />
              </View>
            </TouchableOpacity>
            <MyText color={COLORS.grey} size={FONT_SIZE.sm} center>
              Upload your Images
            </MyText>
            {extraErrors.image && <InputErrorMsg msg={extraErrors.image} />}
            <FlatList
              horizontal
              contentContainerStyle={{
                paddingVertical: 20,
              }}
              data={images}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: COLORS.grey,
                      marginRight: 10,
                      borderRadius: 15,
                    }}>
                    <Image
                      source={{uri: item.path}}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 15,
                      }}
                    />
                    <Pressable
                      onPress={() => {
                        setImages(images.filter((_, idx) => idx !== index));
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 20 / 2,
                        backgroundColor: COLORS.red,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: -5,
                        zIndex: 1,
                        right: -5,
                      }}>
                      <AntDesign
                        name="close"
                        size={FONT_SIZE.base}
                        color={COLORS.white}
                      />
                    </Pressable>
                  </View>
                );
              }}
            />
            <InputWrapper title="Description">
              <TextArea
                hasError={Boolean(errors.description && touched.description)}
                onBlur={handleBlur('description')}
                onChangeText={handleChange('description')}
                value={values.description}
                placeholder="Type Here"
                inputStyle={{
                  height: 200,
                  fontSize: FONT_SIZE.base,
                }}
              />
            </InputWrapper>
            {errors.description && touched.description && (
              <InputErrorMsg msg={errors.description} />
            )}
            <PrimaryBtn
              loading={loading}
              onPress={handleSubmit}
              text="Create"
            />
          </View>
        </MainLayout>
      )}
    </Formik>
  );
};

export default CreateFeedScreen;
