import {
  ActivityIndicator,
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
import ProductItem from '../../components/ProductItem';
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
  apiSimilarProductList,
} from '../../api/product';
import {HomeStackParams, ProductDetailParams} from '../../naviagtion/types';
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
          onPress={() => navigation.navigate('SimilarProducts')}>
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
            <ProductItem
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
  const {token} = useSelector((s: RootState) => s.auth);
  const navigation = useNavigation();
  const [productImages, setProductImages] = useState<string[]>([]);
  const navigation1 =
    useNavigation<NativeStackNavigationProp<ProductDetailParams>>();
    const navigation2 =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();

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

  React.useEffect(() => {
    requestApi();
    requestReviewsApi();
    requestSimilarProductApi();
  }, []);

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
          {/* Like Btn */}
          <TouchableOpacity
            onPress={() => addToFavourite()}
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
            <HeartIconSvg opacity={liked ? 1 : 0.4} />
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
                <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.semibold}>
                  {product?.title || 'Product title'}
                </MyText>
                <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
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
                  <MyText size={FONT_SIZE.sm}>{product?.rating || '0'}</MyText>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}>
                <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.semibold}>
                  ${product?.discountedProce}
                </MyText>
                <MyText
                  size={FONT_SIZE.sm}
                  color={COLORS.grey}
                  style={{textDecorationLine: 'line-through'}}>
                  ${product?.price}
                </MyText>
              </View>
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <MyText size={FONT_SIZE.sm}>Select Total Item</MyText>
              <View
                style={{alignItems: 'center', flexDirection: 'row', gap: 10}}>
                <TouchableOpacity
                  style={styles.countBtn}
                  onPress={() => setQty(prev => prev + 1)}>
                  <AntDesgin
                    name="plus"
                    size={FONT_SIZE.sm}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
                <MyText size={FONT_SIZE['xl']}>{qty}</MyText>
                <TouchableOpacity
                  style={styles.countBtn}
                  onPress={() => {
                    if (qty >= 2) {
                      return setQty(prev => prev - 1);
                    }
                  }}>
                  <AntDesgin
                    name="minus"
                    size={FONT_SIZE.sm}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.line} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 5,
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
              size={FONT_SIZE.sm}>
              {product?.description}
            </MyText>
          ) : null}

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
              <MyText size={FONT_SIZE.sm}>View all</MyText>
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
        <SimilarList productList={similarProducts} />
      </MainLayout>
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
