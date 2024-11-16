import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useState, useCallback} from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../styles';
import {MyText} from './MyText';
import GradientBox from './GradientBox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BUILD_IMAGE_URL} from '../api';
import DummyProductImage from '../../assets/img/productPlaceholder.jpeg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParams} from '../naviagtion/types';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {api_addProductToFavourite} from '../api/product';
import {Rating} from 'react-native-ratings';
import {Product as IProduct} from '../types/index';

export interface ProductProps {
  product: IProduct;
  type?: 'Horizontal' | 'Vertical';
  onValueChange?: (productId: any) => void;
}
// type Props = {
//   id: string;
//   showFav?: boolean;
//   isFav?: boolean;
//   title: string;
//   rating?: number;
//   oldPrice: string;
//   price: string;
//   category: string;
//   photos?: {url: string}[];
// };

// {
//   id,
//   isFav = false,
//   title,
//   price,
//   rating = 0,
//   oldPrice,
//   category,
//   photos,
//   onValueChange,
// }
const Product = (props: ProductProps) => {
  const {type = 'Vertical', product, onValueChange} = props;
  const {
    _id,
    title,
    photos,
    isFavourite,
    categoryId,
    rating = 0,
    price,
    discountedPrice,
  } = product;
  const [isLiked, setIsLiked] = useState(isFavourite);
  const {token} = useSelector((state: RootState) => state.auth);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();

  const photoUrl = photos?.[0]?.url ? BUILD_IMAGE_URL(photos[0].url) : '';
  const handleAddToFavourite = useCallback(async () => {
    if (!token) {
      navigation.navigate('Welcome');
      return;
    }
    setIsLiked(prev => !prev);
    try {
      await api_addProductToFavourite(token!, _id);
      onValueChange?.(_id);
    } catch (error) {
      console.error(error);
    }
  }, [token, _id, onValueChange, navigation]);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductDetail', {productId: _id, photos, title})
      }
      style={[
        styles.container,
        {flexDirection: type === 'Horizontal' ? 'row' : 'column'},
      ]}>
      <View
        style={[
          styles.imageContainer,
          type === 'Horizontal' && styles.imageHorizontal,
          type === 'Vertical' && styles.imageVertical,
        ]}>
        <Image
          source={photoUrl ? {uri: photoUrl} : DummyProductImage}
          resizeMode="cover"
          style={{
            width: '100%',
            borderRadius: type === 'Horizontal' ? 10 : 20,
            height: type === 'Horizontal' ? 107 : 137,
          }}
        />
        {/* rating */}
        {rating > 0 && (
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
              {Math.round(rating)}
            </MyText>
          </View>
        )}
        {/* Like button */}
        <TouchableOpacity
          onPress={handleAddToFavourite}
          style={styles.likeButton}>
          <GradientBox conatinerStyle={styles.gradientBox}>
            <AntDesign
              color={COLORS.white}
              style={{opacity: isLiked ? 1 : 0.3}}
              name="heart"
              size={18}
            />
          </GradientBox>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.semibold}>
            {title}
          </MyText>
          <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            {categoryId.name}
          </MyText>
        </View>
        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Rating
            type="star"
            startingValue={rating}
            ratingCount={5}
            imageSize={15}
          />
          <MyText size={FONT_SIZE.xs}>{Math.round(rating || 0)} Reviews</MyText>
        </View>
        {/* Price */}
        <View style={styles.priceContainer}>
          <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.semibold}>
            ${price}
          </MyText>
          <MyText
            size={FONT_SIZE.sm}
            color={COLORS.grey}
            style={styles.strikethrough}>
            ${discountedPrice}
          </MyText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 10,
  },
  // Common Image Container
  imageContainer: {
    position: 'relative',
    backgroundColor: COLORS.grey,
    borderRadius: 20,
  },
  // Vertical Image Style
  imageVertical: {
    height: 137,
    width: '100%',
  },
  // Horizontal Image Style
  imageHorizontal: {
    height: 100,
    width: 100,
    overflow: 'hidden',
  },
  thumbnail: {},
  likeButton: {
    position: 'absolute',
    bottom: -10,
    right: 10,
  },
  gradientBox: {
    width: 39,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    backgroundColor: 'white',
    flex: 1,
    gap: 3,
    margin: 5,
  },
  // Title container to adapt to the direction
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Rating container (flexible direction)
  ratingContainer: {
    height: 29,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  // Price container
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  // Horizontal layout specific styles
  horizontalContainer: {
    flexDirection: 'row',
  },
  horizontalInfoContainer: {
    marginLeft: 10,
  },
  // Vertical layout specific styles
  verticalContainer: {
    width: 210,
  },
  verticalInfoContainer: {
    marginTop: 10,
  },
});

export default Product;
