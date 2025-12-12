import {Image, Platform, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
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
import {CategoryType, SelectedImage, ProductType} from '../../../types';
import ImageCropPicker from 'react-native-image-crop-picker';
import {api_productUpdate, api_productGetById} from '../../../api/product';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import {BUILD_IMAGE_URL} from '../../../api';

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
    .min(4, ({min}) => `Name must be at least ${min} characters`)
    .required('Required')
    .required('Name is Required!'),
  bio: Yup.string()
    .trim()
    .min(10, ({min}) => `Bio must be at least ${min} characters`)
    .required('Description is Required!'),
  price: Yup.string().trim().required('price is Required!'),
  discountPrice: Yup.string().trim().required('Discount Price is Required!'),
  shippingCost: Yup.string()
    .trim()
    .required('Shipping Cost is Required!')
    .test('min', 'Shipping Cost must be 0 or greater', value => {
      const num = parseFloat(value || '0');
      return num >= 0;
    }),
  freeShippingAbove: Yup.string()
    .trim()
    .required('Free Shipping Above is Required!')
    .test('min', 'Free Shipping Above must be 0 or greater', value => {
      const num = parseFloat(value || '0');
      return num >= 0;
    }),
});

const ProductEditScreen = () => {
  useHideBottomBar({});
  const navigation =
    useNavigation<NativeStackNavigationProp<AllProductStackParams>>();
  const route = useRoute();
  const {product} = route.params as {product: ProductType};
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [productData, setproductData] = useState(product);
  const [selectCategory, setSelectCategory] = useState<any>(
    productData.categoryId || null,
  );
  const [extraErr, setExtraErr] = useState({
    category: '',
    shippingMethod: '',
    tax: '',
  });

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    productData.photos && Array.isArray(productData.photos)
      ? productData.photos
          .map((photo: any) => photo.url)
          .filter((url: string) => url)
      : [],
  );

  // Initialize shipping method from productData or default to 'standard'
  const getShippingMethodLabel = (value: string) => {
    const methods: {[key: string]: string} = {
      standard: 'Standard',
      express: 'Express',
      two_day: 'Two Day',
      next_day: 'Next Day',
      pickup: 'Pickup',
    };
    return methods[value] || 'Standard';
  };

  const [shippingMethod, setShippingMethod] = useState<{
    value: string;
    label: string;
  }>({
    value: (productData as any).shippingMethod || 'standard',
    label: getShippingMethodLabel(
      (productData as any).shippingMethod || 'standard',
    ),
  });

  // Initialize tax entries from productData
  const initializeTaxEntries = (): TaxEntry[] => {
    if ((productData as any).tax && Array.isArray((productData as any).tax)) {
      return (productData as any).tax.map((tax: any) => ({
        type: tax.type || 'SalesTax',
        rate: tax.rate?.toString() || '',
        region: tax.region || '',
        zipCode: tax.zipCode || '',
      }));
    }
    return [];
  };

  const [taxEntries, setTaxEntries] = useState<TaxEntry[]>(
    initializeTaxEntries(),
  );

  // Helper function to get image URL
  const getImageUrl = (url: string) => {
    if (!url) return '';
    // If URL already starts with http, return as is, otherwise use BUILD_IMAGE_URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return BUILD_IMAGE_URL(url);
  };

  // Store initial values for dirty checking
  const initialValues = React.useMemo(
    () => ({
      name: productData.title || '',
      bio: productData.description || '',
      price: productData.price?.toString() || '0',
      discountPrice: (productData as any).discountedPrice?.toString() || '0',
      shippingCost: (productData as any).shippingCost?.toString() || '0',
      freeShippingAbove:
        (productData as any).freeShippingAbove?.toString() || '0',
      categoryId: selectCategory?._id || null,
      shippingMethod: shippingMethod.value,
      existingImages: existingImages.slice(),
      taxEntries: initializeTaxEntries(),
    }),
    [],
  );

  // Comprehensive dirty check function
  const isFormDirty = (formikDirty: boolean, formikValues: FormValues) => {
    // Check Formik form values
    if (formikDirty) return true;

    // Check category
    const currentCategoryId = selectCategory?._id || null;
    if (currentCategoryId !== initialValues.categoryId) return true;

    // Check shipping method
    if (shippingMethod.value !== initialValues.shippingMethod) return true;

    // Check images
    if (selectedImages.length > 0) return true;

    // Check if existing images were removed
    if (existingImages.length !== initialValues.existingImages.length)
      return true;
    const existingImagesChanged = existingImages.some(
      (img, idx) => img !== initialValues.existingImages[idx],
    );
    if (existingImagesChanged) return true;

    // Check tax entries
    if (taxEntries.length !== initialValues.taxEntries.length) return true;
    const taxEntriesChanged = taxEntries.some((tax, idx) => {
      const initialTax = initialValues.taxEntries[idx];
      if (!initialTax) return true;
      return (
        tax.type !== initialTax.type ||
        tax.rate !== initialTax.rate ||
        tax.region !== initialTax.region ||
        tax.zipCode !== initialTax.zipCode
      );
    });
    if (taxEntriesChanged) return true;

    return false;
  };

  // useEffect(() => {
  //   loadProductData();
  // }, []);

  const loadProductData = async () => {
    try {
      const res: any = await api_productGetById(token!, product._id);

      // Set form data
      const productData = res.data;
      setSelectCategory(productData.category);

      // Set existing images
      if (productData.photos && productData.photos.length > 0) {
        setExistingImages(productData.photos.map((photo: any) => photo.url));
      }
    } catch (error: any) {
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    }
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

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const addTaxEntry = () => {
    setTaxEntries([
      ...taxEntries,
      {type: 'SalesTax', rate: '', region: '', zipCode: ''},
    ]);
  };

  const removeTaxEntry = (index: number) => {
    setTaxEntries(taxEntries.filter((_, idx) => idx !== index));
  };

  const updateTaxEntry = (
    index: number,
    field: keyof TaxEntry,
    value: string,
  ) => {
    const updated = [...taxEntries];
    updated[index] = {...updated[index], [field]: value};
    setTaxEntries(updated);
  };

  const onSubmit = async (values: any) => {
    let isValid = true;
    const newErrors = {category: '', shippingMethod: '', tax: ''};

    if (selectCategory === null) {
      newErrors.category = 'please Select Category';
      isValid = false;
    }

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
      formData.append(
        'tax',
        JSON.stringify(
          taxEntries.map(tax => ({
        type: tax.type,
        rate: parseFloat(tax.rate),
        region: tax.region || undefined,
        zipCode: tax.zipCode || undefined,
          })),
        ),
      );
    }

    // Add existing images that weren't removed
    existingImages.forEach((imageUrl, index) => {
      formData.append('existingPhotos', imageUrl);
    });

    // Add new images
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
        price: values.price,
        discountedProce: values.discountPrice,
        description: values.bio,
        categoryId: selectCategory?._id,
        shippingMethod: shippingMethod.value,
        shippingCost: values.shippingCost,
        freeShippingAbove: values.freeShippingAbove,
        tax:
          taxEntries.length > 0
            ? taxEntries.map(tax => ({
          type: tax.type,
          rate: parseFloat(tax.rate),
          region: tax.region || undefined,
          zipCode: tax.zipCode || undefined,
              }))
            : undefined,
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
          textBody: res.data.message || 'Failed to update product!',
          type: ALERT_TYPE.DANGER,
        });
      }
    } catch (error: any) {
      console.log(error, 'error in product update');
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
        price: productData.price?.toString() || '0',
        discountPrice: (productData as any).discountedPrice?.toString() || '0',
        category: productData.categoryId?.name || '',
        shippingCost: (productData as any).shippingCost?.toString() || '0',
        freeShippingAbove:
          (productData as any).freeShippingAbove?.toString() || '0',
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
            {/* Existing Images */}
                {existingImages?.map((imageUrl, index) => {
              if (!imageUrl) return null;
                  return (
                    <View
                  style={{
                    marginRight: 10,
                    marginBottom: 10,
                    position: 'relative',
                  }}
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
                    onError={error => {
                      console.log(
                        'Image load error:',
                        error.nativeEvent.error,
                        imageUrl,
                      );
                    }}
                      />
                    </View>
                  );
                })}

          {/* New Images */}
                {selectedImages?.map((item, index) => {
              if (!item?.path) return null;
                  return (
                    <View
                  style={{
                    marginRight: 10,
                    marginBottom: 10,
                    position: 'relative',
                  }}
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
                    onError={error => {
                      console.log(
                        'Image load error:',
                        error.nativeEvent.error,
                        item.path,
                      );
                    }}
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
              <InputErrorMsg msg={errors.shippingCost as string} />
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
              <InputErrorMsg msg={errors.freeShippingAbove as string} />
            )}

            <View style={{marginTop: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <MyText size={FONT_SIZE.lg} style={{fontWeight: 'bold'}}>
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
                    <MyText size={FONT_SIZE.lg} style={{fontWeight: 'bold'}}>
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
                            onSelect: (data: {
                              value: string;
                              label: string;
                            }) => {
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
                      onChangeText={value =>
                        updateTaxEntry(index, 'rate', value)
                      }
                      value={tax.rate}
                      placeholder="0.00"
                    />
                  </InputWrapper>

                  <InputWrapper title="Region (Optional)">
                    <MyInput
                      onChangeText={value =>
                        updateTaxEntry(index, 'region', value)
                      }
                      value={tax.region}
                      placeholder="State/Province"
                    />
                  </InputWrapper>

                  <InputWrapper title="Zip Code (Optional)">
                    <MyInput
                      onChangeText={value =>
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
              disabled={!isFormDirty(dirty, values)}
              onPress={handleSubmit}
              text="Update Product"
              conatinerStyle={{
                marginTop: 10,
                marginBottom: TAB_BAR_BG_HEIGHT * 0.5,
                opacity: !isFormDirty(dirty, values) ? 0.5 : 1,
              }}
            />
          </View>
        </MainLayout>
      )}
    </Formik>
  );
};

export default ProductEditScreen;
