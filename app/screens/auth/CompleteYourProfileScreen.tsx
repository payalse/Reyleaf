import {
  Alert,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import LayoutBG from '../../components/layout/LayoutBG';
import BackBtn from '../../components/buttons/BackBtn';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import InputWrapper from '../../components/inputs/InputWrapper';
import MyInput from '../../components/inputs/MyInput';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import TextArea from '../../components/inputs/TextArea';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../naviagtion/types';
import DatePicker from 'react-native-date-picker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import InputErrorMsg from '../../components/inputs/InputErrorMsg';
import SelectInput from '../../components/inputs/SelectInput';
import {api_completeProfile} from '../../api/auth';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store';
import {updateUser} from '../../redux/features/auth/authSlice';
import {ShowAlert} from '../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {Asset} from 'react-native-image-picker';
import {AvatarDefaultType} from '../../utils/defaultAvatar';
import moment from 'moment';
import {SelectedImage} from '../../types';
import {SHEETS} from '../../sheets/sheets';
import {SheetManager} from 'react-native-actions-sheet';

type FormValues = {
  name: string;
  bio: string;
  phone: string;
  // pronouns: string;
};
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, ({min}) => `Name must be at least ${min} characters`)
    .required('Required')
    .required('Name is Required!'),
  bio: Yup.string()
    .min(10, ({min}) => `Bio must be at least ${min} characters`)
    .required('Bio is Required!'),
  phone: Yup.string()
    .min(10, ({min}) => `Phone must be at least ${min} characters`)
    .max(12, ({max}) => `Phone must not exceed ${max} characters`)
    .required('Phone is Required!'),
  // pronouns: Yup.string(),
});

const CompleteYourProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const params =
    useRoute<RouteProp<RootStackParams, 'CompleteYourProfile'>>().params;
  const dispatch = useDispatch<AppDispatch>();
  const [date, setDate] = useState<Date | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [extraError, setExtraError] = useState({date: ''});
  const [pronoun, setPronoun] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    SelectedImage | AvatarDefaultType | null
  >(null);

  const onSubmit = async (values: FormValues) => {
    let isValid = true;

    if (date === null) {
      setExtraError(prev => ({...prev, date: 'Please Pick Date!'}));
      isValid = false;
    } else {
      setExtraError(prev => ({...prev, date: ''}));
    }

    if (isValid) {
      const formData = new FormData();
      formData.append('fullname', values.name);
      formData.append('bio', values.bio);
      formData.append('phone', values.phone);
      formData.append('dob', date?.toISOString());
      // formData.append('pronouns', pronoun);

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
      console.log(pronoun)

      try {
        setLoading(true);
        const res = (await api_completeProfile(
          formData,
          params.authToken,
        )) as any;
        console.log(res);
        dispatch(updateUser(res.data));
        navigation.navigate('AddYourAddress', {authToken: params.authToken});
      } catch (error: any) {
        ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
      } finally {
        setLoading(false);
      }
      // navigation.navigate('ChooseProfileImage');
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
          // pronouns: '',
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
            <DatePicker
              modal
              mode="date"
              open={isDateModalOpen}
              locale="en"
              minimumDate={new Date(String(new Date().getFullYear() - 60))}
              maximumDate={new Date(String(new Date().getFullYear() - 12))}
              date={date === null ? new Date() : date}
              onConfirm={date => {
                setDate(() => date);
                setIsDateModalOpen(false);
                setExtraError(prev => ({...prev, date: ''}));
              }}
              onCancel={() => setIsDateModalOpen(false)}
            />
            <View>
              <MyText
                bold={FONT_WEIGHT.bold}
                size={FONT_SIZE['2xl']}
                center
                style={{marginTop: 50, marginBottom: 10}}>
                Complete Your Profile
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
                  <FontAwesome
                    size={35}
                    name="user-circle-o"
                    color={COLORS.lightgrey}
                  />
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
                  <MaterialIcons size={15} name="edit" color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <MyText center size={FONT_SIZE.sm} color={COLORS.grey}>
                Upload profile or Choose avatar
              </MyText>
            </View>
            <View style={{marginTop: 20}}>
              <InputWrapper title="Name">
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
              <InputWrapper title="Profile Bio">
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
              <InputWrapper title="Date of Birth">
                <SelectInput
                  value={date === null ? '' : moment(date).format('MM/DD/YYYY')}
                  onPress={() => setIsDateModalOpen(true)}
                  hasError={!!extraError.date}
                  hideRightIcon
                  placeholder="Choose Date"
                />
              </InputWrapper>
              {extraError.date && <InputErrorMsg msg={extraError.date} />}
              {/* <InputWrapper title="Your Pronouns">
                <SelectInput
                  value={pronoun}
                  placeholder="Pick One"
                  onPress={() => {
                    SheetManager.show(SHEETS.PronounSelectSheet, {
                      payload: {
                        onSelect: setPronoun,
                      },
                    });
                  }}
                />
              </InputWrapper>
              {errors.pronouns && touched.pronouns && (
                <InputErrorMsg msg={errors.pronouns} />
              )} */}
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

export default CompleteYourProfileScreen;
