import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import MainLayout from '../../components/layout/MainLayout';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT, hp, wp} from '../../styles';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {FlatList} from 'react-native';
import Product from '../../components/Product';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import ProductShow from './components/ProductShow';
import CartSvg from '../../../assets/svg/tab/icons/CartFill.svg';
import HeartIconSvg from '../../../assets/svg/icons/heart.svg';
import {ShowAlert} from '../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {api_addToCart} from '../../api/cart';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {ProductType, Reviews} from '../../types';
import {
  api_addProductToFavourite,
  api_getReviewList,
  api_productGetById,
  api_productDelete,
  apiSimilarProductList,
} from '../../api/product';
import {
  HomeStackParams,
  ProductDetailParams,
  AllProductStackParams,
} from '../../naviagtion/types';
import {BASE_URL, BUILD_IMAGE_URL} from '../../api';
import FullScreenLoader from '../../components/FullScreenLoader';
import {
  GetHomeProductResponse,
  GetProductByIdResponse,
  GetReviewsResponse,
  GetSimilarProductResponse,
} from '../../types/apiResponse';
import moment from 'moment';
import {
  setSimilarProduct,
  setProductReview,
} from '../../redux/features/product/productSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Review from '../../components/Reviews';
import {Rating} from 'react-native-ratings';
import {pixelSizeVertical} from '../../utils/sizeNormalization';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useIsFocused} from '@react-navigation/native';

const SimilarList = ({productList}: any) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();
  return (
    <View style={{marginVertical: 20}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 10,
          marginHorizontal: 20,
        }}>
        <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
          Similar Items
        </MyText>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AllProductList', {
              title: 'Similar Items',
              productData: productList,
            })
          }>
          <MyText>View all</MyText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={productList}
        contentContainerStyle={{gap: 25, marginLeft: 20}}
        showsHorizontalScrollIndicator={false}
        horizontal
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <Product
              photos={item?.photos}
              id={item?._id}
              title={item?.title}
              rating={item?.rating}
              price={String(item?.discountedProce)}
              oldPrice={String(item?.price)}
              category={item?.categoryId?.name}
              isFav={item.isFavourite}
            />
          );
        }}
      />
    </View>
  );
};

const ProductDetailScreen = () => {
  useHideBottomBar({});
  const params = useRoute<RouteProp<HomeStackParams, 'ProductDetail'>>().params;
  const [product, setProduct] = useState<ProductType | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [reviews, setProductReviews] = useState<Reviews[]>([]);
  const [similarProducts, setSimilarProducts] = useState<ProductType[]>([]);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const {token, user} = useSelector((s: RootState) => s.auth);
  const navigation = useNavigation();
  const [productImages, setProductImages] = useState<string[]>([]);
  const navigation1 = useNavigation<any>();
  const navigation2 =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();
  const isVendor = user?.role === 2;
  const isFocused = useIsFocused();

  const getShippingMethodLabel = (method: string): string => {
    const methodMap: {[key: string]: string} = {
      standard: 'Standard',
      express: 'Express',
      two_day: 'Two Day',
      next_day: 'Next Day',
      pickup: 'Pickup',
    };
    return methodMap[method] || method;
  };
  const addToCartPress = async () => {
    try {
      if (!token) {
        navigation2.navigate('Welcome');
        return;
      }
      setLoading(true);
      const res = await api_addToCart(token!, {
        product: params.productId,
        quantity: qty,
      });
      ToastAndroid.show('added to cart!', ToastAndroid.SHORT);
      setQty(1);
      // @ts-ignore
      navigation.navigate('CartTab');
    } catch (error: any) {
      ShowAlert({
        textBody: error.message,
        title: 'Alert',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setLoading(false);
    }
  };

  const requestApi = async () => {
    try {
      setLoading2(true);
      const res = (await api_productGetById(
        token!,
        params.productId,
      )) as GetProductByIdResponse;
      setProduct(res?.data);
      setLiked(res?.data?.isFavourite);
    } catch (error: any) {
      ShowAlert({
        textBody: error.message,
        title: 'Alert',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setLoading2(false);
    }
  };
  console.log(product);
  const requestReviewsApi = async () => {
    try {
      setLoading2(true);
      const res = (await api_getReviewList(
        token!,
        params.productId,
      )) as GetReviewsResponse;
      if (res?.data) {
        dispatch(setProductReview(res?.data));
      }
      setProductReviews(res?.data);
    } catch (error: any) {
      ShowAlert({
        textBody: error.message,
        title: 'Alert',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setLoading2(false);
    }
  };

  const requestSimilarProductApi = async () => {
    try {
      const res = (await apiSimilarProductList(
        token!,
        params.productId,
      )) as GetSimilarProductResponse;
      if (res?.data) {
        dispatch(setSimilarProduct(res?.data));
      }
      setSimilarProducts(res?.data);
    } catch (error: any) {
      ShowAlert({
        textBody: error.message,
        title: 'Alert',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setLoading2(false);
    }
  };

  useEffect(() => {
    requestApi();
    requestReviewsApi();
    requestSimilarProductApi();
  }, [isFocused]);

  useEffect(() => {
    if (product?.photos?.length) {
      setProductImages(product.photos.map(i => BUILD_IMAGE_URL(i.url)));
    }
  }, [product]);

  if (loading2) {
    return <FullScreenLoader />;
  }
  const addToFavourite = async () => {
    try {
      if (!token) {
        navigation2.navigate('Welcome');
        return;
      }
      setLiked(!liked);
      const res: any = await api_addProductToFavourite(
        token!,
        params.productId,
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLiked(!liked);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: deleteProduct, style: 'destructive'},
      ],
    );
  };

  const deleteProduct = async () => {
    try {
      const res: any = await api_productDelete(token!, params.productId);

      if (res.status === 200) {
        ShowAlert({
          textBody: 'Product deleted successfully!',
          type: ALERT_TYPE.SUCCESS,
        });
        navigation.goBack();
      } else {
        ShowAlert({
          textBody: res.data.message || 'Failed to delete product!',
          type: ALERT_TYPE.DANGER,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
      }}>
      <MainLayout
        contentContainerStyle={{marginHorizontal: 0}}
        headerComp={
          <SecondaryHeader onBack={navigation.goBack} title="Product Detail" />
        }>
        <ProductShow images={productImages} />
        <View
          style={{
            backgroundColor: COLORS.white,
            marginTop: 45,
            padding: 20,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (isVendor) {
                navigation1.navigate('ProductEdit', {
                  product: product as ProductType,
                });
              } else {
                addToFavourite();
              }
            }}
            style={{
              backgroundColor: COLORS.greenDark,
              width: wp(18),
              height: wp(18),
              borderRadius: wp(18) / 2,
              position: 'absolute',
              zIndex: 1,
              borderColor: '#F5F5F5',
              borderWidth: 5,
              top: -35,
              right: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isVendor ? (
              <AntDesgin name="edit" size={24} color={COLORS.white} />
            ) : (
              <HeartIconSvg opacity={liked ? 1 : 0.4} />
            )}
          </TouchableOpacity>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: 10,
              }}>
              <View style={{gap: 5}}>
                <MyText
                  size={FONT_SIZE.xl}
                  bold={FONT_WEIGHT.semibold}
                  style={{width: '90%', flexWrap: 'wrap'}}>
                  {product?.title || 'Product title'}
                </MyText>

                <MyText
                  size={FONT_SIZE.lg}
                  color={COLORS.grey}
                  style={{width: '90%', flexWrap: 'wrap'}}>
                  {product?.categoryId?.name || 'Product Category'}
                </MyText>
                <View
                  style={{
                    gap: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Rating
                    type="star"
                    ratingCount={5}
                    imageSize={15}
                    readonly
                    startingValue={product?.rating}
                  />
                  {product?.rating !== undefined && product?.rating > 0 && (
                    <MyText size={FONT_SIZE.lg}>
                      {product?.rating || '0'}
                    </MyText>
                  )}
                </View>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  marginTop: 5,
                }}>
                {product?.discountedProce !== product?.price &&
                  product?.discountedProce !== 0 && (
                    <MyText
                      size={FONT_SIZE.lg}
                      color={COLORS.grey}
                      style={{marginBottom: 5}}>
                      Discounted Price
                    </MyText>
                  )}
                {product?.discountedProce !== product?.price &&
                  product?.discountedProce !== 0 && (
                    <MyText
                      size={FONT_SIZE['1.5xl']}
                      bold={FONT_WEIGHT.semibold}>
                      ${product?.discountedProce}
                    </MyText>
                  )}
                <MyText
                  size={FONT_SIZE.lg}
                  color={COLORS.grey}
                  style={{marginBottom: 5}}>
                  Price
                </MyText>

                <MyText size={FONT_SIZE.xl} color={COLORS.grey}>
                  ${product?.price}
                </MyText>
              </View>
            </View>
            {!isVendor && (
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <MyText size={FONT_SIZE.lg}>Select Total Item</MyText>
                <View
                  style={{alignItems: 'center', flexDirection: 'row', gap: 10}}>
                  <TouchableOpacity
                    style={styles.countBtn}
                    onPress={() => {
                      if (qty >= 2) {
                        return setQty(prev => prev - 1);
                      }
                    }}>
                    <AntDesgin
                      name="minus"
                      size={FONT_SIZE.base}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                  <MyText size={FONT_SIZE['xl']}>{qty}</MyText>

                  <TouchableOpacity
                    style={styles.countBtn}
                    onPress={() => setQty(prev => prev + 1)}>
                    <AntDesgin
                      name="plus"
                      size={FONT_SIZE.base}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          <View style={styles.line} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: pixelSizeVertical(4),
            }}>
            <MyText>Description</MyText>
            <TouchableOpacity
              onPress={() => setIsDescriptionOpen(!isDescriptionOpen)}>
              <Entypo
                color={COLORS.black}
                name="chevron-down"
                size={FONT_SIZE['xl']}
                style={{
                  transform: [{rotate: !isDescriptionOpen ? '180deg' : '0deg'}],
                }}
              />
            </TouchableOpacity>
          </View>
          {isDescriptionOpen ? (
            <MyText
              color={COLORS.grey}
              style={{lineHeight: 18}}
              size={FONT_SIZE.base}>
              {product?.description}
            </MyText>
          ) : null}

          {/* Shipping Information */}
          {((product as any)?.shippingMethod ||
            (product as any)?.shippingCost !== undefined) && (
            <>
              <View style={styles.line} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: pixelSizeVertical(4),
                }}>
                <MyText bold={FONT_WEIGHT.semibold}>
                  Shipping Information
                </MyText>
              </View>
              <View style={{gap: 8, marginTop: 10}}>
                {(product as any)?.shippingMethod && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <MyText color={COLORS.grey} size={FONT_SIZE.base}>
                      Shipping Method:
                    </MyText>
                    <MyText size={FONT_SIZE.base}>
                      {getShippingMethodLabel(
                        (product as any).shippingMethod,
                      ) || 'Standard'}
                    </MyText>
                  </View>
                )}
                {(product as any)?.shippingCost !== undefined && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <MyText color={COLORS.grey} size={FONT_SIZE.base}>
                      Shipping Cost:
                    </MyText>
                    <MyText size={FONT_SIZE.base}>
                      {(product as any).shippingCost === 0
                        ? 'Free'
                        : '$' + (product as any).shippingCost}
                    </MyText>
                  </View>
                )}
                {(product as any)?.freeShippingAbove !== undefined &&
                  (product as any).freeShippingAbove > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <MyText color={COLORS.grey} size={FONT_SIZE.base}>
                        Free Shipping Above:
                      </MyText>
                      <MyText size={FONT_SIZE.base} color={COLORS.greenDark}>
                        ${(product as any).freeShippingAbove}
                      </MyText>
                    </View>
                  )}
              </View>
            </>
          )}

          {/* Tax Included */}
          {(product as any)?.tax &&
            Array.isArray((product as any).tax) &&
            (product as any).tax.length > 0 && (
              <>
                <View style={styles.line} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                  <MyText color={COLORS.grey} size={FONT_SIZE.base}>
                    Tax Included
                  </MyText>
                </View>
              </>
            )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
              marginTop: 20,
            }}>
            <MyText>Rating & Reviews</MyText>
            <TouchableOpacity onPress={() => navigation1.navigate('Reviews')}>
              <MyText size={FONT_SIZE.lg}>View all</MyText>
            </TouchableOpacity>
          </View>
          <View>
            {reviews &&
              reviews.map((item, idx) => {
                return (
                  <Review
                    id={item?._id}
                    user={item?.user}
                    updateAt={item.updateAt}
                    review={String(item?.review)}
                    value={String(item?.review)}
                  />
                );
              })}
          </View>
        </View>
        {!isVendor && <SimilarList productList={similarProducts} />}
      </MainLayout>
      {isVendor ? (
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            backgroundColor: COLORS.white,
          }}>
          <TouchableOpacity
            onPress={confirmDelete}
            style={{
              width: '95%',
              gap: 5,
              alignSelf: 'center',
              marginBottom: 15,
              backgroundColor: '#f3c4c9',
              padding: 10,
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
            }}>
            <MaterialCommunityIcons name="delete" color={'#EA001B'} size={20} />
            <MyText color={'#EA001B'} size={FONT_SIZE.lg}>
              Delete Product
            </MyText>
          </TouchableOpacity>
        </View>
      ) : (
        <PrimaryBtn
          loading={loading}
          onPress={addToCartPress}
          leftComp={() => {
            return <CartSvg />;
          }}
          conatinerStyle={{
            width: '95%',
            gap: 10,
            alignSelf: 'center',
            marginBottom: 15,
          }}
          text="Add to Cart"
        />
      )}
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  countBtn: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: COLORS.greenDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    height: 1,
    backgroundColor: COLORS.lightgrey,
    marginVertical: 20,
  },
});
