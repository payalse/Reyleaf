import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../styles';
import { MyText } from './MyText';
import GradientBox from './GradientBox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BUILD_IMAGE_URL } from '../api';

import DummyProductImage from '../../assets/img/productPlaceholder.jpeg';
import { useNavigation } from '@react-navigation/native';

import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { api_addProductToFavourite } from '../api/product';
import { Rating } from 'react-native-ratings';

type Props = {
  id: string;
  isFav?: boolean;
  title: string;
  rating?: number;
  oldPrice: string;
  price: string;
  category: string;
  photos: { url: string }[] | undefined;
  onValueChange?: (productId: any) => void;
};

const ProductItem2 = ({
  isFav = false,
  title,
  oldPrice,
  id,
  price,
  category,
  photos,
  rating,
  onValueChange,
}: Props) => {
  const [isLiked, setIsLiked] = useState(isFav);
  const { token } = useSelector((s: RootState) => s.auth);
  const photo = photos ? photos[0]?.url || '' : '';
  const navigation = useNavigation();

  const addToFavourite = async (productId: any) => {
    try {
      setIsLiked(!isLiked);
      const res: any = await api_addProductToFavourite(token!, productId);
      handleValueChange(productId);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLiked(!isLiked);
    }
  };

  const handleValueChange = useCallback(
    (productId: any) => {
      if (onValueChange) {
        onValueChange(productId);
      } else {
      }
    },
    [onValueChange],
  );

  return (
    <TouchableOpacity
      onPress={() =>
        // @ts-ignore
        navigation.navigate('ProductDetail', {
          productId: id,
          photos: photos,
          title: title,
        })
      }
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 25,
        padding: 10,
        flexDirection: 'row',
      }}
    >
      <View
        style={{
          position: 'relative',
          backgroundColor: COLORS.grey,
          height: 100,
          borderRadius: 20,
          width: 100,
          overflow: 'hidden',
        }}
      >
        <Image
          source={photo ? { uri: BUILD_IMAGE_URL(photo) } : DummyProductImage}
          style={{ width: '100%', height: 107, borderRadius: 10 }}
          resizeMode="cover"
        />
      </View>

      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          gap: 3,
          margin: 5,
          marginLeft: 10,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.semibold}>
              {title}
            </MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              {category}
            </MyText>
          </View>
          <TouchableOpacity onPress={() => addToFavourite(id)}>
            <GradientBox
              conatinerStyle={{
                width: 30,
                height: 30,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AntDesign
                color={COLORS.white}
                style={{ opacity: isLiked ? 1 : 0.3 }}
                name="heart"
                size={14}
              />
            </GradientBox>
          </TouchableOpacity>
        </View>

        <View>
          <View
            style={{
              height: 29,
              alignItems: 'center',
              flexDirection: 'row',
              gap: 2,
            }}
          >
            <Rating type="star" startingValue={rating} ratingCount={5} imageSize={15}/>
            <MyText size={FONT_SIZE.xs}>
              {'   '} {rating} Reviews
            </MyText>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}
          >
            <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.semibold}>
              ${price}
            </MyText>
            <MyText
              size={FONT_SIZE.sm}
              color={COLORS.grey}
              style={{ textDecorationLine: 'line-through' }}
            >
              ${oldPrice}
            </MyText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem2;
