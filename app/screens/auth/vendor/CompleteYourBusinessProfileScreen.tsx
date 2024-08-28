import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LayoutBG from '../../../components/layout/LayoutBG';
import BackBtn from '../../../components/buttons/BackBtn';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import TextArea from '../../../components/inputs/TextArea';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../../naviagtion/types';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../redux/store';
import {AvatarDefaultType} from '../../../utils/defaultAvatar';
import {Asset} from 'react-native-image-picker';
import {api_completeProfile} from '../../../api/auth';
import {updateUser} from '../../../redux/features/auth/authSlice';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import DatePicker from 'react-native-date-picker';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';

type FormValues = {
  name: string;
  bio: string;
  phone: string;
};
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, ({min}) => `Name must be at least ${min} characters`)
    .required('Required')
    .required('Name is Required!'),
  bio: Yup.string()
    .min(10, ({min}) => `Bio must be at least ${min} characters`)
    .required('Description is Required!'),
  phone: Yup.string()
    .min(10, ({min}) => `Phone must be at least ${min} characters`)
    .required('Phone is Required!'),
});

const CompleteYourBusinessProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const params =
    useRoute<RouteProp<RootStackParams, 'CompleteYourBusinessProfile'>>()
      .params;
  const dispatch = useDispatch<AppDispatch>();
  const [date, setDate] = useState<Date | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    Asset | AvatarDefaultType | null
  >(null);
  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append('fullname', values.name);
    formData.append('bio', values.bio);
    formData.append('phone', values.phone);
    // formData.append('dob', date?.toISOString());
    if (selectedImage !== null) {
      if (!selectedImage['isDefaultAvatar']) {
        const tempImg = {
          name: Date.now().toString() + '.png',
          type: selectedImage?.mime,
          uri:
            Platform.OS !== 'android'
              ? 'file://' + selectedImage?.path
              : selectedImage?.path,
        };
        formData.append('picture', tempImg);
      }
    }
    console.log({
      values,
      date,
      params,
    });

    try {
      setLoading(true);
      const res = (await api_completeProfile(
        formData,
        params.authToken,
      )) as any;
      console.log(res);
      dispatch(updateUser(res.data));
      navigation.navigate('AddYourBusinessAddress', {
        authToken: params.authToken,
      });
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
          bio: '',
          name: '',
          phone: '',
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
          <ScrollView
            contentContainerStyle={{marginHorizontal: 20, paddingBottom: 50}}>
            <BackBtn onPress={navigation.goBack} />

            <View>
              <MyText
                bold={FONT_WEIGHT.bold}
                size={FONT_SIZE['2xl']}
                center
                style={{marginTop: 50, marginBottom: 10}}>
                Complete Your Account
              </MyText>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  alignSelf: 'center',
                  marginVertical: 20,
                  position: 'relative',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {selectedImage === null ? (
                  <Feather size={35} name="image" color={COLORS.lightgrey} />
                ) : selectedImage['isDefaultAvatar'] ? (
                  <Image
                    source={selectedImage.img}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 100,
                      resizeMode: 'cover',
                    }}
                  />
                ) : (
                  <Image
                    source={{uri: selectedImage.path}}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 100,
                      resizeMode: 'cover',
                    }}
                  />
                )}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ChooseProfileImage', {
                      // @ts-ignore
                      setSelectedImage,
                    })
                  }
                  style={{
                    backgroundColor: COLORS.greenDark,
                    width: 28,
                    height: 28,
                    borderRadius: 28,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}>
                  <Ionicons
                    size={15}
                    name="cloud-upload"
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>
              <MyText center size={FONT_SIZE.sm} color={COLORS.grey}>
                Upload Business Profile
              </MyText>
            </View>
            <View style={{marginTop: 20}}>
              <InputWrapper title="Business Name">
                <MyInput
                  hasError={Boolean(errors.name && touched.name)}
                  onBlur={handleBlur('name')}
                  onChangeText={handleChange('name')}
                  value={values.name}
                  placeholder="Type your name"
                />
              </InputWrapper>
              {errors.name && touched.name && (
                <InputErrorMsg msg={errors.name} />
              )}
              <InputWrapper title="Description">
                <TextArea
                  hasError={Boolean(errors.bio && touched.bio)}
                  onBlur={handleBlur('bio')}
                  onChangeText={handleChange('bio')}
                  value={values.bio}
                  placeholder="Type here"
                />
              </InputWrapper>
              {errors.bio && touched.bio && <InputErrorMsg msg={errors.bio} />}

              <InputWrapper title="Mobile no">
                <MyInput
                  keyboardType="number-pad"
                  hasError={Boolean(errors.phone && touched.phone)}
                  onBlur={handleBlur('phone')}
                  onChangeText={handleChange('phone')}
                  value={values.phone}
                  placeholder="Type here"
                />
              </InputWrapper>
              {errors.phone && touched.phone && (
                <InputErrorMsg msg={errors.phone} />
              )}
              <PrimaryBtn
                loading={loading}
                onPress={handleSubmit}
                text="Next"
                conatinerStyle={{marginTop: 10}}
              />
            </View>
          </ScrollView>
        )}
      </Formik>
    </LayoutBG>
  );
};

export default CompleteYourBusinessProfileScreen;
