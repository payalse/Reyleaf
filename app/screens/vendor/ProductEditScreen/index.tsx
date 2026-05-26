import {Image, Platform, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
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
import {AllProductStackParams} from '../../../naviagtion/types';
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
import {SelectedImage, ProductType} from '../../../types';
import ImageCropPicker from 'react-native-image-crop-picker';
import {api_productUpdate} from '../../../api/product';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import {BUILD_IMAGE_URL} from '../../../api';
import {amountToCents, centsToAmount} from '../../../utils/currency';

type FormValues = {
  name: string;
  bio: string;
  price: string;
  discountPrice: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(4, ({min}) => `Name must be at least ${min} characters`)
    .required('Name is Required!'),
  bio: Yup.string()
    .trim()
    .min(10, ({min}) => `Bio must be at least ${min} characters`)
    .required('Description is Required!'),
  price: Yup.string().trim().required('Price is Required!'),
  discountPrice: Yup.string().trim().required('Discount Price is Required!'),
});

const getShippingMethodLabel = (value: string) => {
  const methods: {[key: string]: string} = {
    standard: 'Standard Delivery',
    express: 'Express Delivery',
    two_day: '2-Day Delivery',
    next_day: 'Next Day Delivery',
    pickup: 'Store Pickup',
  };
  return methods[value] || 'Standard Delivery';
};

const ProductEditScreen = () => {
  useHideBottomBar({});
  const navigation =
    useNavigation<NativeStackNavigationProp<AllProductStackParams>>();
  const route = useRoute();
  const {product} = route.params as {product: ProductType};
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [productData] = useState(product);
  const [selectCategory, setSelectCategory] = useState<any>(
    productData.categoryId || null,
  );
  const [extraErr, setExtraErr] = useState({category: '', shippingMethod: ''});
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    productData.photos && Array.isArray(productData.photos)
      ? productData.photos
          .map((photo: any) => photo.url)
          .filter((url: string) => url)
      : [],
  );

  const [shippingMethod, setShippingMethod] = useState<{
    value: string;
    label: string;
  }>({
    value: productData.shippingMethod || 'standard',
    label: getShippingMethodLabel(productData.shippingMethod || 'standard'),
  });

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return BUILD_IMAGE_URL(url);
  };

  const initialValues = React.useMemo(
    () => ({
      name: productData.title || '',
      bio: productData.description || '',
      price: centsToAmount(productData.price || 0),
      discountPrice: centsToAmount((productData as any).discountedProce || 0),
      categoryId: selectCategory?._id || null,
      shippingMethod: shippingMethod.value,
      existingImages: existingImages.slice(),
    }),
    [],
  );

  const isFormDirty = (formikDirty: boolean) => {
    if (formikDirty) return true;
    if ((selectCategory?._id || null) !== initialValues.categoryId) return true;
    if (shippingMethod.value !== initialValues.shippingMethod) return true;
    if (selectedImages.length > 0) return true;
    if (existingImages.length !== initialValues.existingImages.length) return true;
    if (existingImages.some((img, idx) => img !== initialValues.existingImages[idx])) return true;
    return false;
  };

  const pickImages = async () => {
    try {
      const res = await ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        multiple: true,
        mediaType: 'photo',
      });
      // @ts-ignore
      setSelectedImages(prev => [...prev, ...res]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const onSubmit = async (values: any) => {
    let isValid = true;
    const newErrors = {category: '', shippingMethod: ''};

    if (selectCategory === null) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }

    setExtraErr(newErrors);
    if (!isValid) return;

    const formData = new FormData();
    formData.append('categoryId', selectCategory?._id);
    formData.append('title', values.name);
    formData.append('price', String(amountToCents(values.price)));
    formData.append('discountedProce', String(amountToCents(values.discountPrice)));
    formData.append('description', values.bio);
    formData.append('shippingMethod', shippingMethod.value);

    existingImages.forEach(imageUrl => {
      formData.append('existingPhotos', imageUrl);
    });

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
      const isFormData = selectedImages.length > 0 || existingImages.length > 0;
      const valuesFormData = {
        title: values.name,
        price: amountToCents(values.price),
        discountedProce: amountToCents(values.discountPrice),
        description: values.bio,
        categoryId: selectCategory?._id,
        shippingMethod: shippingMethod.value,
      };

      const res: any = await api_productUpdate(
        isFormData,
        isFormData ? formData : (valuesFormData as any),
        token!,
        product._id,
      );

      if (res.status === 200) {
        ShowAlert({
          textBody: 'Product updated successfully!',
          type: ALERT_TYPE.SUCCESS,
        });
      } else {
        ShowAlert({
          textBody: res.data?.message || 'Failed to update product!',
          type: ALERT_TYPE.DANGER,
        });
      }
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
        bio: productData.description || '',
        name: productData.title || '',
        price: centsToAmount(productData.price || 0),
        discountPrice: centsToAmount((productData as any).discountedProce || 0),
        category: productData.categoryId?.name || '',
      }}
      onSubmit={onSubmit}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        dirty,
      }) => (
        <MainLayout
          headerComp={
            <SecondaryHeader
              onBack={navigation.goBack}
              backBtnContainerStyle={{left: 0}}
              title="Edit Product"
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
              Upload Product Images
            </MyText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 24,
              gap: 10,
            }}>
            {existingImages?.map((imageUrl, index) => {
              if (!imageUrl) return null;
              return (
                <View
                  style={{marginRight: 10, marginBottom: 10, position: 'relative'}}
                  key={`existing-${index}`}>
                  <TouchableOpacity
                    onPress={() => removeExistingImage(index)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      backgroundColor: COLORS.white,
                      position: 'absolute',
                      zIndex: 1,
                      top: -10,
                      right: -10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <AntDesign
                      name="closecircle"
                      size={FONT_SIZE.xl}
                      color={COLORS.red}
                    />
                  </TouchableOpacity>
                  <Image
                    source={{uri: getImageUrl(imageUrl)}}
                    style={{width: 50, height: 50, borderRadius: 5}}
                    resizeMode="cover"
                  />
                </View>
              );
            })}

            {selectedImages?.map((item, index) => {
              if (!item?.path) return null;
              return (
                <View
                  style={{marginRight: 10, marginBottom: 10, position: 'relative'}}
                  key={`new-${index}`}>
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
                      justifyContent: 'center',
                      alignItems: 'center',
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
                    resizeMode="cover"
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
                value={selectCategory ? selectCategory?.name : values.category}
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
              <InputErrorMsg msg={errors.price as string} />
            )}

            <InputWrapper title="Discount Price">
              <MyInput
                keyboardType="number-pad"
                hasError={Boolean(errors.discountPrice && touched.discountPrice)}
                onBlur={handleBlur('discountPrice')}
                onChangeText={handleChange('discountPrice')}
                value={values.discountPrice}
                placeholder="Type here"
              />
            </InputWrapper>
            {errors.discountPrice && touched.discountPrice && (
              <InputErrorMsg msg={errors.discountPrice as string} />
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

            <InputWrapper title="Shipping Method">
              <SelectInput
                value={shippingMethod.label}
                placeholder="Select shipping method"
                hasError={Boolean(extraErr.shippingMethod)}
                onPress={() => {
                  SheetManager.show(SHEETS.ShippingMethodSelectSheet, {
                    // @ts-ignore
                    payload: {
                      onSelect: (data: {value: string; label: string}) => {
                        setShippingMethod(data);
                        setExtraErr({...extraErr, shippingMethod: ''});
                      },
                    },
                  });
                }}
              />
            </InputWrapper>
            {extraErr?.shippingMethod && (
              <InputErrorMsg msg={extraErr?.shippingMethod} />
            )}

            <PrimaryBtn
              loading={loading}
              disabled={!isFormDirty(dirty)}
              onPress={handleSubmit}
              text="Update Product"
              conatinerStyle={{
                marginTop: 10,
                marginBottom: TAB_BAR_BG_HEIGHT * 0.5,
                opacity: !isFormDirty(dirty) ? 0.5 : 1,
              }}
            />
          </View>
        </MainLayout>
      )}
    </Formik>
  );
};

export default ProductEditScreen;
