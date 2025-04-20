import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useCallback, useState } from 'react';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { MyText } from '../../../components/MyText';
import GradientBox from '../../../components/GradientBox';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import DeleteSvg from '../../../../assets/svg/icons/trash.svg';
import {
  api_deleteCartItem,
  api_updateCartItem,
} from '../../../api/cart';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { GetCartResponse } from '../../../types/apiResponse';
import { BUILD_IMAGE_URL } from '../../../api';
import { heightPixel, pixelSizeVertical, widthPixel } from '../../../utils/sizeNormalization';
import FastImage from 'react-native-fast-image';

type Props = {
  id: string;
  title: string;
  category: string;
  price: string;
  oldPrice: string;
  qty: number;
  productId: string;
  setCartItems: any;
  photos: { url: string }[];
};

const CartItem = ({
  id,
  title,
  qty,
  category,
  price,
  oldPrice,
  setCartItems,
  productId,
  photos,
}: Props) => {
  const [decrementLoading, setDecrementLoading] = useState(false);
  const [incrementLoading, setIncrementLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { token } = useSelector((s: RootState) => s.auth);

  const productImage = photos?.[0]?.url
    ? BUILD_IMAGE_URL(photos?.[0]?.url)
    : null;

  const handleDecrementPress = useCallback(async () => {
    if (qty <= 1) {
      return;
    }
    try {
      setDecrementLoading(true);
      const res = (await api_updateCartItem(
        token!,
        id,
        qty - 1,
      )) as GetCartResponse;
      setCartItems(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setDecrementLoading(false);
    }
  }, [id, qty]);


  const handleIncrementPress = useCallback(async () => {
    try {
      setIncrementLoading(true);
      const res = (await api_updateCartItem(
        token!,
        id,
        qty + 1,
      )) as GetCartResponse;
      setCartItems(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIncrementLoading(false);
    }
  }, [id, qty]);

  const deleteCartItem = useCallback(async () => {
    try {
      setDeleteLoading(true);
      const res = (await api_deleteCartItem(token!, id)) as GetCartResponse;
      setCartItems(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  }, [id]);

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        padding: heightPixel(15),
        marginBottom: pixelSizeVertical(16),
        borderRadius: BORDER_RADIUS.Medium,
        flexDirection: 'row',
      }}>
      <View
        style={{
          width: widthPixel(100),
          height: heightPixel(110),
          borderRadius: BORDER_RADIUS.Large,
          backgroundColor: COLORS.grey,
        }}>
        <FastImage
          source={productImage ? { uri: productImage } : require("../../../../assets/img/productPlaceholder.jpeg")}
          style={{
            width: widthPixel(100),
            height: heightPixel(110),
            borderRadius: BORDER_RADIUS.Large,
          }}
          resizeMode={FastImage.resizeMode[productImage ? 'contain' : "stretch"]}
        />
      </View>
      <View style={{ flex: 1, padding: heightPixel(10), justifyContent: 'space-between' }}>
        <View>
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            {title.length > 28 ? `${title.substring(0, 28)}...` : title}
          </MyText>
          <MyText size={FONT_SIZE.base} color={COLORS.grey} style={{ marginVertical: pixelSizeVertical(4.4) }}>
            {category}
          </MyText>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleIncrementPress}
            disabled={incrementLoading}>
            <GradientBox
              conatinerStyle={{
                width: widthPixel(23),
                height: heightPixel(24),
                borderRadius: BORDER_RADIUS.Circle,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {incrementLoading ? (
                <ActivityIndicator />
              ) : (
                <AntDesgin name="plus" size={widthPixel(16)} color={COLORS.white} />
              )}
            </GradientBox>
          </TouchableOpacity>
          <MyText size={FONT_SIZE.xl}>{qty}</MyText>
          <TouchableOpacity
            disabled={decrementLoading}
            onPress={handleDecrementPress}>
            <GradientBox
              conatinerStyle={{
                width: widthPixel(23),
                height: heightPixel(24),
                borderRadius: BORDER_RADIUS.Circle,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {decrementLoading ? (
                <ActivityIndicator />
              ) : (
                <AntDesgin name="minus" size={widthPixel(16)} color={COLORS.white} />
              )}
            </GradientBox>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <TouchableOpacity
          onPress={deleteCartItem}
          style={{
            backgroundColor: 'rgba(234, 0, 27, 0.2)',
            width: widthPixel(40),
            height: heightPixel(40),
            borderRadius: BORDER_RADIUS.XMedium,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {deleteLoading ? <ActivityIndicator /> : <DeleteSvg />}
        </TouchableOpacity>
        <View style={{ gap: 4, alignItems: 'flex-end' }}>
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            ${price}
          </MyText>
          <MyText
            size={FONT_SIZE.base}
            color={COLORS.grey}
            style={{ textDecorationLine: 'line-through' }}>
            ${price}
          </MyText>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
