import React, {useState, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../styles';
import {MyText} from './MyText';
import GradientBox from './GradientBox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParams} from '../navigation/types';
import {BUILD_IMAGE_URL} from '../api';
import DummyProductImage from '../../assets/img/productPlaceholder.jpeg';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {api_addProductToFavourite} from '../api/product';
import {Rating} from 'react-native-ratings';

type Props = {
  id: string;
  isFav?: boolean;
  title: string;
  rating?: number;
  oldPrice: string;
  price: string;
  category: string;
  photos?: {url: string}[];
  layout?: 'vertical' | 'horizontal';
  onValueChange?: (productId: string) => void;
};

const Product = ({
  id,
  isFav = false,
  title,
  rating = 0,
  oldPrice,
  price,
  category,
  photos,
  layout = 'vertical',
  onValueChange,
}: Props) => {
  const [isLiked, setIsLiked] = useState(isFav);
  const {token} = useSelector((state: RootState) => state.auth);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();
  const photo = photos?.[0]?.url ? BUILD_IMAGE_URL(photos[0].url) : '';

  const addToFavourite = async () => {
    try {
      if (!token) {
        navigation.navigate('Welcome');
        return;
      }
      setIsLiked(!isLiked);
      const res = await api_addProductToFavourite(token, id);
      if (onValueChange) onValueChange(id);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const containerStyle =
    layout === 'vertical'
      ? styles.verticalContainer
      : styles.horizontalContainer;

  const imageStyle =
    layout === 'vertical' ? styles.verticalImage : styles.horizontalImage;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductDetail', {
          productId: id,
          photos,
          title,
        })
      }
      style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.imageContainer,
          layout === 'horizontal' && {width: 100},
        ]}>
        <Image
          source={photo ? {uri: photo} : DummyProductImage}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
        />
        {layout === 'vertical' && (
          <TouchableOpacity onPress={addToFavourite} style={styles.likeButton}>
            <GradientBox conatinerStyle={styles.likeButtonContainer}>
              <AntDesign
                color={COLORS.white}
                style={{opacity: isLiked ? 1 : 0.3}}
                name="heart"
                size={18}
              />
            </GradientBox>
          </TouchableOpacity>
        )}
      </View>
      {layout === 'vertical' && (
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
            top: 10,
            left: 10,
          }}>
          <AntDesign size={15} name="star" color={'#FFC700'} />
          <MyText size={FONT_SIZE.xs} bold={FONT_WEIGHT.bold}>
            {Math.round(rating)}
          </MyText>
        </View>
      )}

      <View style={styles.details}>
        <View style={styles.header}>
          <View>
            <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.semibold}>
              {title}
            </MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              {category}
            </MyText>
          </View>
          {layout === 'horizontal' && (
            <TouchableOpacity onPress={addToFavourite}>
              <GradientBox conatinerStyle={styles.likeButtonContainer}>
                <AntDesign
                  color={COLORS.white}
                  style={{opacity: isLiked ? 1 : 0.3}}
                  name="heart"
                  size={14}
                />
              </GradientBox>
            </TouchableOpacity>
          )}
        </View>

        {rating > 0 && (
          <View style={styles.rating}>
            <Rating
              type="star"
              startingValue={rating}
              ratingCount={5}
              imageSize={15}
            />
            <MyText size={FONT_SIZE.xs}>
              {'   '} {Math.round(rating)} Reviews
            </MyText>
          </View>
        )}
        <View style={styles.priceContainer}>
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

export default Product;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 10,
    position: 'relative',
  },
  verticalContainer: {
    width: 210,
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: COLORS.grey,
    borderRadius: 20,
  },
  verticalImage: {
    height: 137,
  },
  horizontalImage: {
    height: 100,
  },
  image: {
    width: '100%',
    borderRadius: 20,
  },
  likeButton: {
    position: 'absolute',
    bottom: -10,
    right: 10,
    zIndex: 4,
  },
  likeButtonContainer: {
    width: 39,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    gap: 3,
    margin: 5,
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
});
