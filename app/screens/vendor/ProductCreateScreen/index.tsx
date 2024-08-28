import {Image, Platform, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE} from '../../../styles';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import TextArea from '../../../components/inputs/TextArea';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../../naviagtion/types';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {TAB_BAR_BG_HEIGHT} from '../../../naviagtion/MainTab';
import SelectInput from '../../../components/inputs/SelectInput';
import {SheetManager} from 'react-native-actions-sheet';
import {SHEETS} from '../../../sheets/sheets';
import {CategoryType, SelectedImage} from '../../../types';
import ImageCropPicker from 'react-native-image-crop-picker';
import {api_productCreate} from '../../../api/product';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';

type FormValues = {
  name: string;
  bio: string;
  price: string;
  discountPrice: string;
};
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, ({min}) => `Name must be at least ${min} characters`)
    .required('Required')
    .required('Name is Required!'),
  bio: Yup.string()
    .min(10, ({min}) => `Bio must be at least ${min} characters`)
    .required('Description is Required!'),
  price: Yup.string().required('price is Required!'),
  discountPrice: Yup.string().required('Discount Price is Required!'),
});

const ProductCreateScreen = () => {
  useHideBottomBar({});
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);

  const [selectCategory, setSelectCategory] = useState<null | CategoryType>(
    null,
  );
  const [extraErr, setExtraErr] = useState({
    category: '',
  });

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);

  const pickImages = async () => {
    try {
      const res = await ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        multiple: true,
        mediaType: 'photo',
      });
      console.log(res);
      // @ts-ignore
      setSelectedImages(prev => [...prev, ...res]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const onSubmit = async (values: FormValues) => {
    let isValid = true;

    if (selectCategory === null) {
      setExtraErr({...extraErr, category: 'please Select Category'});
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const formData = new FormData();
    formData.append('categoryId', selectCategory?._id);
    formData.append('title', values.name);
    formData.append('price', values.price);
    formData.append('discountedProce', values.discountPrice);
    formData.append('description', values.bio);

    if (selectedImages.length) {
      for (const i of selectedImages) {
        const temp = {
          name: Date.now().toString() + '.png',
          type: i?.mime,
          uri: Platform.OS !== 'android' ? 'file://' + i?.path : i?.path,
        };
        formData.append('photos', temp);
      }
    }
    try {
      setLoading(true);
      const res = await api_productCreate(formData, token!);
      console.log(res);
      navigation.goBack();
    } catch (error: any) {
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        bio: '',
        name: '',
        price: '',
        discountPrice: '',
      }}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <MainLayout
          headerComp={
            <SecondaryHeader
              onBack={navigation.goBack}
              backBtnContainerStyle={{left: 0}}
              title="Create New Product"
            />
          }>
          <View>
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
              <Feather size={35} name="image" color={COLORS.lightgrey} />
              <TouchableOpacity
                onPress={pickImages}
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
                <Ionicons size={15} name="cloud-upload" color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <MyText center size={FONT_SIZE.sm} color={COLORS.grey}>
              Upload Product Profile
            </MyText>
          </View>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            {selectedImages?.map((item, index) => {
              return (
                <View style={{marginRight: 10}} key={index}>
                  <TouchableOpacity
                    onPress={() => removeSelectedImage(index)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      backgroundColor: COLORS.white,
                      position: 'absolute',
                      zIndex: 1,
                      top: -10,
                      right: -10,
                    }}>
                    <AntDesign
                      name="closecircle"
                      size={FONT_SIZE.xl}
                      color={COLORS.red}
                    />
                  </TouchableOpacity>
                  <Image
                    source={{uri: item.path}}
                    style={{width: 50, height: 50, borderRadius: 5}}
                  />
                </View>
              );
            })}
          </View>
          <View style={{marginTop: 20}}>
            <InputWrapper title="Product Title">
              <MyInput
                hasError={Boolean(errors.name && touched.name)}
                onBlur={handleBlur('name')}
                onChangeText={handleChange('name')}
                value={values.name}
                placeholder="Type your name"
              />
            </InputWrapper>
            {errors.name && touched.name && <InputErrorMsg msg={errors.name} />}

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
                        setExtraErr({...extraErr, category: ''});
                      },
                    },
                  });
                }}
              />
            </InputWrapper>
            {extraErr?.category && <InputErrorMsg msg={extraErr?.category} />}

            <InputWrapper title="Price">
              <MyInput
                keyboardType="number-pad"
                hasError={Boolean(errors.price && touched.price)}
                onBlur={handleBlur('price')}
                onChangeText={handleChange('price')}
                value={values.price}
                placeholder="Type here"
              />
            </InputWrapper>
            {errors.price && touched.price && (
              <InputErrorMsg msg={errors.price} />
            )}

            <InputWrapper title="Discount Price">
              <MyInput
                keyboardType="number-pad"
                hasError={Boolean(
                  errors.discountPrice && touched.discountPrice,
                )}
                onBlur={handleBlur('discountPrice')}
                onChangeText={handleChange('discountPrice')}
                value={values.discountPrice}
                placeholder="Type here"
              />
            </InputWrapper>
            {errors.discountPrice && touched.discountPrice && (
              <InputErrorMsg msg={errors.discountPrice} />
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

            <PrimaryBtn
              loading={loading}
              onPress={handleSubmit}
              text="Add Product"
              conatinerStyle={{
                marginTop: 10,
                marginBottom: TAB_BAR_BG_HEIGHT * 0.5,
              }}
            />
          </View>
        </MainLayout>
      )}
    </Formik>
  );
};

export default ProductCreateScreen;
