import {View, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../styles';
import {MyText} from './MyText';
import GradientBox from './GradientBox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParams} from '../naviagtion/types';
import {BUILD_IMAGE_URL} from '../api';
import DummyProductImage from '../../assets/img/productPlaceholder.jpeg';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {api_addProductToFavourite} from '../api/product';

type Props = {
  id: string;
  isFav?: boolean;
  title: string;
  rating: number;
  oldPrice: string;
  price: string;
  category: string;
  photos?: {url: string}[];
};

const ProductItem = ({
  id,
  isFav,
  title,
  price,
  rating,
  oldPrice,
  photos,
  category,
}: Props) => {
  const [isLiked, setIsLiked] = useState(isFav);
  const {token} = useSelector((s: RootState) => s.auth);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();

  const productImage = photos?.[0]?.url
    ? BUILD_IMAGE_URL(photos?.[0]?.url)
    : null;

  const addToFavourite = async (productId: any) => {
    try {
      if (!token) {
        navigation.navigate('Welcome');
        return;
      }
      setIsLiked(!isLiked);
      const res: any = await api_addProductToFavourite(token!, productId);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLiked(!isLiked);
    }
  };
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductDetail', {productId: id, photos, title})
      }
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 25,
        width: 210,
        padding: 10,
      }}>
      <View
        style={{
          position: 'relative',
          backgroundColor: COLORS.grey,
          height: 137,
          borderRadius: 20,
        }}>
        <Image
          source={productImage ? {uri: productImage} : DummyProductImage}
          resizeMode="cover"
          style={{width: '100%', height: 137, borderRadius: 20}}
        />
        {/* rating */}
        <View
          style={{
            height: 28,
            backgroundColor: COLORS.white,
            width: 42,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            flexDirection: 'row',
            gap: 2,
            margin: 10,
            position: 'absolute',
          }}>
          <AntDesign size={15} name="star" color={'#FFC700'} />
          <MyText size={FONT_SIZE.xs} bold={FONT_WEIGHT.bold}>
            {Math.round(rating) }
          </MyText>
        </View>
        {/* liked */}
        <TouchableOpacity
          onPress={() => addToFavourite(id)}
          style={{position: 'absolute', bottom: -10, right: 10}}>
          <GradientBox
            conatinerStyle={{
              width: 39,
              height: 38,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign
              color={COLORS.white}
              style={{opacity: isLiked ? 1 : 0.3}}
              name="heart"
              size={18}
            />
          </GradientBox>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          gap: 3,
          margin: 5,
          marginTop: 10,
        }}>
        <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.semibold}>
          {title}
        </MyText>
        <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
          {category}
        </MyText>
        <View style={{flexDirection: 'row', alignItems: 'baseline', gap: 5}}>
          <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.semibold}>
            ${price}
          </MyText>
          <MyText
            size={FONT_SIZE.sm}
            color={COLORS.grey}
            style={{textDecorationLine: 'line-through'}}>
            ${oldPrice}
          </MyText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;
