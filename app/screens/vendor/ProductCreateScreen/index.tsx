import { Image, Platform, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MyText } from '../../../components/MyText';
import { COLORS, FONT_SIZE } from '../../../styles';
import InputWrapper from '../../../components/inputs/InputWrapper';
import MyInput from '../../../components/inputs/MyInput';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import TextArea from '../../../components/inputs/TextArea';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../../naviagtion/types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ShowAlert } from '../../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import InputErrorMsg from '../../../components/inputs/InputErrorMsg';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { TAB_BAR_BG_HEIGHT } from '../../../naviagtion/MainTab';
import SelectInput from '../../../components/inputs/SelectInput';
import { SheetManager } from 'react-native-actions-sheet';
import { SHEETS } from '../../../sheets/sheets';
import { CategoryType, SelectedImage } from '../../../types';
import ImageCropPicker from 'react-native-image-crop-picker';
import { api_productCreate } from '../../../api/product';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useHideBottomBar } from '../../../hook/useHideBottomBar';

type TaxEntry = {
  type: string;
  rate: string;
  region: string;
  zipCode: string;
};

type FormValues = {
  name: string;
  bio: string;
  price: string;
  discountPrice: string;
  shippingCost: string;
  freeShippingAbove: string;
};
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(4, ({ min }) => `Name must be at least ${min} characters`)
    .required('Required')
    .required('Name is Required!'),
  bio: Yup.string()
    .trim()
    .min(10, ({ min }) => `Bio must be at least ${min} characters`)
    .required('Description is Required!'),
  price: Yup.string().trim()
    .required('price is Required!'),
  discountPrice: Yup.string().trim()
    .required('Discount Price is Required!'),
  shippingCost: Yup.string()
    .trim()
    .required('Shipping Cost is Required!')
    .test('min', 'Shipping Cost must be 0 or greater', (value) => {
      const num = parseFloat(value || '0');
      return num >= 0;
    }),
  freeShippingAbove: Yup.string()
    .trim()
    .required('Free Shipping Above is Required!')
    .test('min', 'Free Shipping Above must be 0 or greater', (value) => {
      const num = parseFloat(value || '0');
      return num >= 0;
    }),
});

const ProductCreateScreen = () => {
  useHideBottomBar({});
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const { token } = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);

  const [selectCategory, setSelectCategory] = useState<null | CategoryType>(
    null,
  );
  const [extraErr, setExtraErr] = useState({
    category: '',
    shippingMethod: '',
    tax: '',
  });

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [shippingMethod, setShippingMethod] = useState<{value: string; label: string}>({
    value: 'standard',
    label: 'Standard',
  });
  const [taxEntries, setTaxEntries] = useState<TaxEntry[]>([]);

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

  const addTaxEntry = () => {
    setTaxEntries([
      ...taxEntries,
      { type: 'SalesTax', rate: '', region: '', zipCode: '' },
    ]);
  };

  const removeTaxEntry = (index: number) => {
    setTaxEntries(taxEntries.filter((_, idx) => idx !== index));
  };

  const updateTaxEntry = (index: number, field: keyof TaxEntry, value: string) => {
    const updated = [...taxEntries];
    updated[index] = { ...updated[index], [field]: value };
    setTaxEntries(updated);
  };

  const onSubmit = async (values: FormValues) => {
    let isValid = true;
    const newErrors = { category: '', shippingMethod: '', tax: '' };

    if (selectCategory === null) {
      newErrors.category = 'please Select Category';
      isValid = false;
    }

    console.log(values, 'values');
    // Shipping method defaults to 'standard' if not set

    // Validate tax entries
    for (let i = 0; i < taxEntries.length; i++) {
      const tax = taxEntries[i];
      if (!tax.rate || parseFloat(tax.rate) < 0 || parseFloat(tax.rate) > 1) {
        newErrors.tax = `Tax rate at entry ${i + 1} must be between 0 and 1`;
        isValid = false;
        break;
      }
    }

    setExtraErr(newErrors);

    if (!isValid) {
      return;
    }

    const formData = new FormData();
    formData.append('categoryId', selectCategory?._id);
    formData.append('title', values.name);
    formData.append('price', values.price);
    formData.append('discountedProce', values.discountPrice);
    formData.append('description', values.bio);
    formData.append('shippingMethod', shippingMethod.value);
    formData.append('shippingCost', values.shippingCost);
    formData.append('freeShippingAbove', values.freeShippingAbove);

    if (taxEntries.length > 0) {
      formData.append('tax', JSON.stringify(taxEntries.map(tax => ({
        type: tax.type,
        rate: parseFloat(tax.rate),
        region: tax.region || undefined,
        zipCode: tax.zipCode || undefined,
      }))));
    }

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
      ShowAlert({ textBody: error.message, type: ALERT_TYPE.DANGER });
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
        shippingCost: '0',
        freeShippingAbove: '0',
      }}
      onSubmit={onSubmit}>
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <MainLayout
          headerComp={
            <SecondaryHeader
              onBack={navigation.goBack}
              backBtnContainerStyle={{ left: 0 }}
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

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            {selectedImages?.map((item, index) => {
              return (
                <View style={{ marginRight: 10 }} key={index}>
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
                    source={{ uri: item.path }}
                    style={{ width: 50, height: 50, borderRadius: 5 }}
                  />
                </View>
              );
            })}
          </View>
          <View style={{ marginTop: 20 }}>
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
                        setExtraErr({ ...extraErr, category: '' });
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
                        setExtraErr({ ...extraErr, shippingMethod: '' });
                      },
                    },
                  });
                }}
              />
            </InputWrapper>
            {extraErr?.shippingMethod && (
              <InputErrorMsg msg={extraErr?.shippingMethod} />
            )}

            <InputWrapper title="Shipping Cost">
              <MyInput
                keyboardType="decimal-pad"
                hasError={Boolean(errors.shippingCost && touched.shippingCost)}
                onBlur={handleBlur('shippingCost')}
                onChangeText={handleChange('shippingCost')}
                value={values.shippingCost}
                placeholder="0.00"
              />
            </InputWrapper>
            {errors.shippingCost && touched.shippingCost && (
              <InputErrorMsg msg={errors.shippingCost} />
            )}

            <InputWrapper title="Free Shipping Above">
              <MyInput
                keyboardType="decimal-pad"
                hasError={Boolean(
                  errors.freeShippingAbove && touched.freeShippingAbove,
                )}
                onBlur={handleBlur('freeShippingAbove')}
                onChangeText={handleChange('freeShippingAbove')}
                value={values.freeShippingAbove}
                placeholder="0.00"
              />
            </InputWrapper>
            {errors.freeShippingAbove && touched.freeShippingAbove && (
              <InputErrorMsg msg={errors.freeShippingAbove} />
            )}

            <View style={{ marginTop: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <MyText size={FONT_SIZE.lg} style={{ fontWeight: 'bold' }}>
                  Tax Information
                </MyText>
                <TouchableOpacity
                  onPress={addTaxEntry}
                  style={{
                    backgroundColor: COLORS.greenDark,
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    borderRadius: 20,
                  }}>
                  <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                    + Add Tax
                  </MyText>
                </TouchableOpacity>
              </View>
              {extraErr?.tax && <InputErrorMsg msg={extraErr?.tax} />}

              {taxEntries.map((tax, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 15,
                    borderWidth: 1,
                    borderColor: COLORS.lightgrey,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <MyText size={FONT_SIZE.lg} style={{ fontWeight: 'bold' }}>
                      Tax Entry {index + 1}
                    </MyText>
                    <TouchableOpacity onPress={() => removeTaxEntry(index)}>
                      <AntDesign
                        name="closecircle"
                        size={FONT_SIZE.xl}
                        color={COLORS.red}
                      />
                    </TouchableOpacity>
                  </View>

                  <InputWrapper title="Tax Type">
                    <SelectInput
                      value={
                        tax.type === 'SalesTax'
                          ? 'Sales Tax'
                          : tax.type === 'GST'
                          ? 'GST'
                          : tax.type === 'PST'
                          ? 'PST'
                          : tax.type === 'HST'
                          ? 'HST'
                          : 'VAT'
                      }
                      placeholder="Select tax type"
                      onPress={() => {
                        SheetManager.show(SHEETS.TaxTypeSelectSheet, {
                          // @ts-ignore
                          payload: {
                            onSelect: (data: {value: string; label: string}) => {
                              updateTaxEntry(index, 'type', data.value);
                            },
                          },
                        });
                      }}
                    />
                  </InputWrapper>

                  <InputWrapper title="Tax Rate (0-1)">
                    <MyInput
                      keyboardType="decimal-pad"
                      onChangeText={(value) => updateTaxEntry(index, 'rate', value)}
                      value={tax.rate}
                      placeholder="0.00"
                    />
                  </InputWrapper>

                  <InputWrapper title="Region (Optional)">
                    <MyInput
                      onChangeText={(value) =>
                        updateTaxEntry(index, 'region', value)
                      }
                      value={tax.region}
                      placeholder="State/Province"
                    />
                  </InputWrapper>

                  <InputWrapper title="Zip Code (Optional)">
                    <MyInput
                      onChangeText={(value) =>
                        updateTaxEntry(index, 'zipCode', value)
                      }
                      value={tax.zipCode}
                      placeholder="Zip Code"
                    />
                  </InputWrapper>
                </View>
              ))}
            </View>

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

