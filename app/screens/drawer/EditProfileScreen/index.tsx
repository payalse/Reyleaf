import { Alert, Image, Platform, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MyText } from '../../../components/MyText';
import { COLORS, FONT_SIZE } from '../../../styles';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import TextArea from '../../../components/inputs/TextArea';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ProfileEditStackParams,
  RootStackParams,
} from '../../../naviagtion/types';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { api_completeProfile } from '../../../api/auth';
import { logout, updateUser } from '../../../redux/features/auth/authSlice';
import { ShowAlert } from '../../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import DatePicker from 'react-native-date-picker';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';
import SelectInput from '../../../components/inputs/SelectInput';
import moment from 'moment';
import { SHEETS } from '../../../sheets/sheets';
import { SheetManager } from 'react-native-actions-sheet';
import { BUILD_IMAGE_URL } from '../../../api';
import { CountryType } from '../../../utils/countryTable';
import { api_deleteUserProfile } from '../../../api/user';
import { setFirstLaunched } from '../../../redux/features/app/appSlice';
import { pixelSizeVertical } from '../../../utils/sizeNormalization';
interface UserFormValues {
  name: string;
  bio: string;
  phone: string;
  bAddress: string;
}

interface VendorFormValues extends UserFormValues {
  city: string;
  state: string;
  zipcode: string;
}

const nameValidator = Yup.string()
  .trim()
  .min(4, ({ min }) => `Name must be at least ${min} characters`)
  .required('Name is Required!');

const bioValidator = Yup.string()
  .trim()
  .min(10, ({ min }) => `Bio must be at least ${min} characters`)
  .required('Bio is Required!');

const phoneValidator = Yup.string()
  .trim()
  .min(10, ({ min }) => `Phone must be at least ${min} characters`)
  .max(12, ({ max }) => `Phone must not exceed ${max} characters`);

const addressValidator = Yup.string()
  .trim()
  .min(10, ({ min }) => `Address must be at least ${min} characters`)
  .required('Address is Required!');

const cityValidator = Yup.string()
  .trim()
  .min(4, ({ min }) => `City must be at least ${min} characters`)
  .required('City is Required!');

const stateValidator = Yup.string()
  .trim()
  .min(4, ({ min }) => `State must be at least ${min} characters`)
  .required('State is Required!');

const zipValidator = Yup.string()
  .trim()
  .min(4, ({ min }) => `ZipCode must be at least ${min} characters`)
  .required('ZipCode is Required!');

// Validation Schemas
const validationSchema = Yup.object().shape({
  name: nameValidator,
  bio: bioValidator,
  phone: phoneValidator,
  bAddress: Yup.string(),
});

const VendorValidationSchema = Yup.object().shape({
  name: nameValidator,
  bio: bioValidator,
  phone: phoneValidator,
  bAddress: addressValidator,
  city: cityValidator,
  state: stateValidator,
  zipcode: zipValidator,
});

const EditProfileScreen = () => {
  const { mode, defaultAvatar } = useSelector((s: RootState) => s.app);
  const authUser = useSelector((s: RootState) => s.auth.user);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const [date, setDate] = useState<Date | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [extraError, setExtraError] = useState({ date: '' });
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [country, setCoutry] = useState<null | CountryType>(null);
  const [extraErr, setExtraErr] = useState({
    country: '',
  });

  const onSubmit = async (values: UserFormValues) => {
    let isValid = true;
    // if (date === null) {
    //   setExtraError(prev => ({...prev, date: 'Please Pick Date!'}));
    //   isValid = false;
    // } else {
    //   setExtraError(prev => ({...prev, date: ''}));
    // }

    if (isValid) {
      const formData = new FormData();
      formData.append('fullname', values?.name);
      formData.append('bio', values.bio);
      formData.append('phone', values.phone);
      formData.append('dob', date?.toISOString());
      // formData.append('pronouns', pronoun);

      if (selectedImage !== null) {
        const img = selectedImage as any;
        if (img.isDefaultAvatar && img.img) {
          const resolved = Image.resolveAssetSource(img.img);
          if (resolved?.uri) {
            formData.append('picture', {
              name: `avatar-${img.id}.png`,
              type: 'image/png',
              uri: resolved.uri,
            });
          }
        } else if (!img.isDefaultAvatar && img.path) {
          const tempImg = {
            name: Date.now().toString() + '.png',
            type: img.mime || 'image/png',
            uri:
              Platform.OS !== 'android'
                ? 'file://' + img.path
                : img.path,
          };
          formData.append('picture', tempImg);
        }
      }

      try {
        setLoading(true);
        const res = (await api_completeProfile(
          formData,
          authUser?.token!,
        )) as any;
        // console.log(res.data, 'res');
        ShowAlert({ textBody: res?.message, type: ALERT_TYPE.SUCCESS });
        dispatch(updateUser(res.data));
      } catch (error: any) {
        console.log(error);
        ShowAlert({ textBody: error.message, type: ALERT_TYPE.DANGER });
      } finally {
        setLoading(false);
      }
    }
  };

  const onVendorSubmit = async (values: VendorFormValues) => {
    if (country === null) {
      ShowAlert({
        textBody: 'Please select a country',
        type: ALERT_TYPE.SUCCESS,
      });
      return;
    }
    const formData = new FormData();
    formData.append('fullname', values.name);
    formData.append('bio', values.bio);
    formData.append('phone', values.phone);
    formData.append('city', values.city);
    formData.append('country', country);
    formData.append('state', values.state);
    formData.append('zipcode', values.zipcode);
    formData.append('address', values.bAddress);
    // formData.append('pronouns', pronoun);

    if (selectedImage !== null) {
      const img = selectedImage as any;
      if (img.isDefaultAvatar && img.img) {
        const resolved = Image.resolveAssetSource(img.img);
        if (resolved?.uri) {
          formData.append('picture', {
            name: `avatar-${img.id}.png`,
            type: 'image/png',
            uri: resolved.uri,
          });
        }
      } else if (!img.isDefaultAvatar && img.path) {
        const tempImg = {
          name: Date.now().toString() + '.png',
          type: img.mime || 'image/png',
          uri:
            Platform.OS !== 'android'
              ? 'file://' + img.path
              : img.path,
        };
        formData.append('picture', tempImg);
      }
    }

    try {
      setLoading(true);
      const res = (await api_completeProfile(
        formData,
        authUser?.token!,
      )) as any;
      ShowAlert({
        textBody: 'profile updated successfully',
        type: ALERT_TYPE.SUCCESS,
      });
      dispatch(updateUser(res.data));
    } catch (error: any) {
      console.log(error);
      ShowAlert({ textBody: error.message, type: ALERT_TYPE.DANGER });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCoutry(authUser?.data?.country);
    if (authUser?.dob && authUser?.dob != 'undefined') {
      console.log(authUser?.dob);
      setDate(new Date(authUser?.dob));
      // setPronoun(authUser?.pronouns)
    }
  }, []);


  const deleteProfile = async () => {
    try {
      if (isDeleting) return;

      setIsDeleting(true);
      await api_deleteUserProfile(authUser?.token!);
      dispatch(setFirstLaunched(false));
      dispatch(logout());
      navigation.navigate('Login');
      ShowAlert({
        textBody: 'Profile Deleted Successfully!',
        type: ALERT_TYPE.SUCCESS,
      });

    } catch (error: any) {
      ShowAlert({ textBody: error.message || "Error While Deleting Your Profile!", type: ALERT_TYPE.DANGER });
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  console.log(authUser?.data?.country, 'country');
  return (
    <MainLayout
      headerComp={
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{ left: 0 }}
          title="Edit Profile"
        />
      }>
      {mode == 'VENDOR' ? (
        <Formik
          validationSchema={VendorValidationSchema}
          initialValues={{
            bio: authUser?.bio || '',
            name: authUser?.fullname || '',
            phone: authUser?.phone || '',
            bAddress: authUser?.data?.address || '',
            city: authUser?.data?.city || '',
            state: authUser?.data?.state || '',
            zipcode: authUser?.data?.zipcode || '',
          }}
          onSubmit={onVendorSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View>
                <DatePicker
                  modal
                  mode="date"
                  maximumDate={new Date(String(new Date().getFullYear() - 12))}
                  open={isDateModalOpen}
                  date={date === null ? new Date() : date}
                  onConfirm={date => {
                    setDate(() => date);
                    setIsDateModalOpen(false);
                    setExtraError(prev => ({ ...prev, date: '' }));
                  }}
                  onCancel={() => setIsDateModalOpen(false)}
                />
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
                    authUser?.picture ? (
                      <Image
                        source={{ uri: BUILD_IMAGE_URL(authUser.picture) }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 100,
                          resizeMode: 'cover',
                        }}
                      />
                    ) : (
                      <Image
                        source={defaultAvatar.img}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 100,
                          resizeMode: 'cover',
                        }}
                      />
                    )
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
                      source={{ uri: selectedImage.path }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 100,
                        resizeMode: 'cover',
                      }}
                    />
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ChooseProfileImage', {
                        // @ts-ignore
                        setSelectedImage,
                      });
                    }}
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
                  Upload Business Profile
                </MyText>
              </View>
              <View style={{ marginTop: 20 }}>
                <InputWrapper title="Business Name">
                  <MyInput
                    hasError={Boolean(errors?.name && touched?.name)}
                    onBlur={handleBlur('name')}
                    onChangeText={handleChange('name')}
                    value={values?.name}
                    placeholder="Type your name"
                  />
                </InputWrapper>
                {errors?.name && touched?.name && (
                  <InputErrorMsg msg={errors.name} />
                )}
                <InputWrapper title="Description">
                  <TextArea
                    hasError={Boolean(errors?.bio && touched?.bio)}
                    onBlur={handleBlur('bio')}
                    onChangeText={handleChange('bio')}
                    value={values?.bio}
                    placeholder="Type here"
                  />
                </InputWrapper>
                {errors?.bio && touched?.bio && (
                  <InputErrorMsg msg={errors.bio} />
                )}

                <InputWrapper title="Mobile no optional*">
                  <MyInput
                    keyboardType="number-pad"
                    hasError={Boolean(errors.phone && touched.phone)}
                    onBlur={handleBlur('phone')}
                    onChangeText={handleChange('phone')}
                    value={values.phone}
                    placeholder="Type here"
                  />
                </InputWrapper>
                <InputWrapper title="Business Address">
                  <MyInput
                    hasError={Boolean(errors.bAddress && touched.bAddress)}
                    onBlur={handleBlur('bAddress')}
                    onChangeText={handleChange('bAddress')}
                    value={values.bAddress}
                    placeholder="Type here"
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
                {errors.city && touched.city && (
                  <InputErrorMsg msg={errors.city as string} />
                )}
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
                  <InputErrorMsg msg={errors.state as string} />
                )}
                <InputWrapper title="Country">
                  <SelectInput
                    placeholder={authUser?.data?.country || 'Select from here'}
                    value={country ? country?.name : ''}
                    onPress={() => {
                      SheetManager.show(SHEETS.CountrySelectSheet, {
                        //@ts-ignore
                        payload: {
                          onSelect: (e: CountryType) => {
                            setCoutry(e);
                            setExtraErr(prev => ({ ...prev, country: '' }));
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
                  <InputErrorMsg msg={errors.zipcode as string} />
                )}

                <PrimaryBtn
                  loading={loading}
                  onPress={handleSubmit}
                  text="Update"
                  conatinerStyle={{ marginTop: 10, marginBottom: 20 }}
                />
              </View>
            </>
          )}
        </Formik>
      ) : (
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            bio: authUser?.bio || '',
            name: authUser?.fullname || '',
            phone: authUser?.phone || '',
            bAddress: authUser?.data?.address || '',
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
            <>
              <View>
                <DatePicker
                  modal
                  mode="date"
                  maximumDate={new Date(String(new Date().getFullYear() - 12))}
                  open={isDateModalOpen}
                  date={date === null ? new Date() : date}
                  onConfirm={date => {
                    setDate(() => date);
                    setIsDateModalOpen(false);
                    setExtraError(prev => ({ ...prev, date: '' }));
                  }}
                  onCancel={() => setIsDateModalOpen(false)}
                />
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
                    authUser?.picture ? (
                      <Image
                        source={{ uri: BUILD_IMAGE_URL(authUser.picture) }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 100,
                          resizeMode: 'cover',
                        }}
                      />
                    ) : (
                      <Image
                        source={defaultAvatar.img}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 100,
                          resizeMode: 'cover',
                        }}
                      />
                    )
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
                      source={{ uri: selectedImage.path }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 100,
                        resizeMode: 'cover',
                      }}
                    />
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ChooseProfileImage', {
                        // @ts-ignore
                        setSelectedImage,
                      });
                    }}
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
              <View style={{ marginTop: 20 }}>
                <InputWrapper title="Name">
                  <MyInput
                    hasError={Boolean(errors?.name && touched?.name)}
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
                {errors.bio && touched.bio && (
                  <InputErrorMsg msg={errors.bio} />
                )}
                <InputWrapper title="Mobile no optional*">
                  <MyInput
                    keyboardType="number-pad"
                    hasError={Boolean(errors.phone && touched.phone)}
                    onBlur={handleBlur('phone')}
                    onChangeText={handleChange('phone')}
                    value={values.phone}
                    placeholder="Type here"
                  />
                </InputWrapper>
                <InputWrapper title="Date of Birth optional*">
                  <SelectInput
                    value={
                      date === null ? '' : moment(date).format('MM/DD/YYYY')
                    }
                    onPress={() => setIsDateModalOpen(true)}
                    hasError={!!extraError.date}
                    hideRightIcon
                    placeholder="Choose Date"
                  />
                </InputWrapper>

                <PrimaryBtn
                  loading={loading}
                  onPress={handleSubmit}
                  text="Update"
                  conatinerStyle={{ marginVertical: pixelSizeVertical(10) }}
                />
              </View>
            </>
          )}
        </Formik>
      )}
      <PrimaryBtn
        loading={isDeleting}
        onPress={() => {
          Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                onPress: () => deleteProfile(),
                style: "destructive",
              },
            ]
          );
        }}
        text="Delete Account"
        conatinerStyle={{ marginBottom: pixelSizeVertical(20) }}
        colors={['#8B0000', '#B22222']}
      />

    </MainLayout>
  );
};

export default EditProfileScreen;
