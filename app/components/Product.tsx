import { memo, useCallback, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT } from '../styles';
import { MyText } from './MyText';
import GradientBox from './GradientBox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BUILD_IMAGE_URL } from '../api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { api_addProductToFavourite } from '../api/product';
import { Rating } from 'react-native-ratings';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel } from '../utils/sizeNormalization';
import FastImage from 'react-native-fast-image';

type Props = {
  id: string;
  isFav?: boolean;
  title: string;
  rating?: number;
  oldPrice: string;
  price: string;
  category: string;
  photos?: { url: string }[];
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
  const { token } = useSelector((state: RootState) => state.auth);
  const navigation =
    useNavigation<NativeStackNavigationProp<any>>();
  const photo = photos?.[0]?.url ? BUILD_IMAGE_URL(photos[0].url) : '';

  const addToFavourite = useCallback(async () => {
    try {
      if (!token) {
        navigation.navigate('Welcome');
        return;
      }
      setIsLiked((prev) => !prev);
      const res = (await api_addProductToFavourite(token, id) as any)
      if (res?.status === 200) {
        onValueChange?.(id);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error?.message)
    }
  }, [token, id, navigation, onValueChange]);

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
          layout === 'horizontal' && { width: widthPixel(100) },
        ]}>
        <FastImage
          source={photo ? { uri: photo } : require("../../assets/img/productPlaceholder.jpeg")}
          style={[styles.image, imageStyle]}
          resizeMode={FastImage.resizeMode[photo ? 'contain' : "stretch"]}
        />
        {layout === 'vertical' && (
          <TouchableOpacity onPress={addToFavourite} style={styles.likeButton}>
            <GradientBox conatinerStyle={styles.likeButtonContainer}>
              <AntDesign
                color={COLORS.white}
                style={{ opacity: isLiked ? 1 : 0.3 }}
                name="heart"
                size={widthPixel(FONT_SIZE.xl)}
              />
            </GradientBox>
          </TouchableOpacity>
        )}
      </View>
      {layout === 'vertical' && (
        <View
          style={{
            height: heightPixel(28),
            backgroundColor: COLORS.white,
            width: widthPixel(42),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: BORDER_RADIUS.XMedium,
            flexDirection: 'row',
            gap: 2,
            margin: heightPixel(10),
            position: 'absolute',
            top: pixelSizeVertical(10),
            left: pixelSizeHorizontal(10),
          }}>
          <AntDesign size={widthPixel(FONT_SIZE.xl)} name="star" color={'#FFC700'} />
          <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
            {Math.round(rating)}
          </MyText>
        </View>
      )}

      <View style={styles.details}>
        <View style={styles.header}>
          <View>
            <MyText size={FONT_SIZE.lg}
              bold={FONT_WEIGHT.semibold}
              style={{
                maxWidth: "90%",
                lineHeight: FONT_SIZE['1.5xl']
              }}>
              {title.length > 28 ? `${title.substring(0, 28)}...` : title}
            </MyText>
            <MyText
              size={FONT_SIZE.base}
              color={COLORS.grey}
              style={{ opacity: 0.8, marginTop: pixelSizeVertical(3) }}
            >
              {category}
            </MyText>
          </View>
          {layout === 'horizontal' && (
            <TouchableOpacity onPress={addToFavourite}>
              <GradientBox conatinerStyle={styles.likeButtonContainer}>
                <AntDesign
                  color={COLORS.white}
                  style={{ opacity: isLiked ? 1 : 0.3 }}
                  name="heart"
                  size={widthPixel(FONT_SIZE.lg)}
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
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.semibold}>
            ${price}
          </MyText>
          <MyText
            size={FONT_SIZE.base}
            color={COLORS.grey}
            style={{ textDecorationLine: 'line-through' }}>
            ${oldPrice}
          </MyText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(Product);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.Large,
    padding: heightPixel(10),
    position: 'relative',
  },
  verticalContainer: {
    width: widthPixel(200),
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: COLORS.grey,
    borderRadius: BORDER_RADIUS['Semi-Large'],
  },
  verticalImage: {
    height: heightPixel(142),
  },
  horizontalImage: {
    height: heightPixel(100),
  },
  image: {
    width: '100%',
    borderRadius: BORDER_RADIUS['Semi-Large'],
  },
  likeButton: {
    position: 'absolute',
    bottom: pixelSizeVertical(-14),
    right: pixelSizeHorizontal(10),
    zIndex: 4,
  },
  likeButtonContainer: {
    width: widthPixel(40),
    height: heightPixel(40),
    borderRadius: BORDER_RADIUS.XMedium,
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
