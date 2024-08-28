import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import GradientBox from '../../../components/GradientBox';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import DeleteSvg from '../../../../assets/svg/icons/trash.svg';
import {
  api_addToCart,
  api_deleteCartItem,
  api_updateCartItem,
} from '../../../api/cart';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {GetCartResponse} from '../../../types/apiResponse';
import {BUILD_IMAGE_URL} from '../../../api';
import DummyProductImage from '../../../../assets/img/productPlaceholder.jpeg';
import {Image} from 'react-native';

type Props = {
  id: string;
  title: string;
  category: string;
  price: string;
  oldPrice: string;
  qty: number;
  productId: string;
  setCartItems: any;
  photos: {url: string}[];
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
  const {token} = useSelector((s: RootState) => s.auth);

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
      console.log(res, 'api_updateCartItem - ');
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
      console.log(res, 'api_updateCartItem + ');
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
      console.log(res, 'api_deleteCartItem');
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
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        flexDirection: 'row',
      }}>
      <View
        style={{
          width: 95,
          height: 100,
          borderRadius: 20,
          backgroundColor: COLORS.grey,
        }}>
        <Image
          source={productImage ? {uri: productImage} : DummyProductImage}
          resizeMode="cover"
          style={{width: 95, height: 100, borderRadius: 20}}
        />
      </View>
      <View style={{flex: 1, padding: 10, justifyContent: 'space-between'}}>
        <View>
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            {title}
          </MyText>
          <MyText size={FONT_SIZE.xs} color={COLORS.grey}>
            {category}
          </MyText>
        </View>
        <View style={{flexDirection: 'row', gap: 10}}>
          <TouchableOpacity
            onPress={handleIncrementPress}
            disabled={incrementLoading}>
            <GradientBox
              conatinerStyle={{
                width: 23,
                height: 23,
                borderRadius: 23,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {incrementLoading ? (
                <ActivityIndicator />
              ) : (
                <AntDesgin name="plus" size={15} color={COLORS.white} />
              )}
            </GradientBox>
          </TouchableOpacity>
          <MyText>{qty}</MyText>
          <TouchableOpacity
            disabled={decrementLoading}
            onPress={handleDecrementPress}>
            <GradientBox
              conatinerStyle={{
                width: 23,
                height: 23,
                borderRadius: 23,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {decrementLoading ? (
                <ActivityIndicator />
              ) : (
                <AntDesgin name="minus" size={15} color={COLORS.white} />
              )}
            </GradientBox>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <TouchableOpacity
          onPress={deleteCartItem}
          style={{
            backgroundColor: 'rgba(234, 0, 27, 0.2)',
            width: 38,
            height: 38,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {deleteLoading ? <ActivityIndicator /> : <DeleteSvg />}
        </TouchableOpacity>
        <View style={{gap: 5, alignItems: 'flex-end'}}>
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            ${price}
          </MyText>
          <MyText
            size={FONT_SIZE.xs}
            color={COLORS.grey}
            style={{textDecorationLine: 'line-through'}}>
            ${price}
          </MyText>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
