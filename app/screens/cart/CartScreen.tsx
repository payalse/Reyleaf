import React, {useCallback, useEffect, useMemo, useState} from 'react';
import MainHeader from '../../components/header/MainHeader';
import MainLayout from '../../components/layout/MainLayout';
import {ActivityIndicator, FlatList, SafeAreaView, View} from 'react-native';
import CartItem from './components/CartItem';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CartStackParams} from '../../naviagtion/types';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {api_getCart} from '../../api/cart';
import {CartItemType} from '../../types';
import {GetCartResponse} from '../../types/apiResponse';
import FullScreenLoader from '../../components/FullScreenLoader';

const data = [
  {
    id: '1',
    qty: 1,
    title: 'Product title',
    category: 'Product Category',
    price: '$60.00',
    oldPrice: '$70.00',
  },
  {
    id: '2',
    qty: 1,
    title: 'Product title',
    category: 'Product Category',
    price: '$60.00',
    oldPrice: '$70.00',
  },

  {
    id: '3',
    qty: 1,
    title: 'Product title',
    category: 'Product Category',
    price: '$60.00',
    oldPrice: '$70.00',
  },
];

const CartScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CartStackParams>>();
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getCart(token!)) as GetCartResponse;
      setCartItems(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestApi();
  }, []);

  const total = useMemo(() => {
    return cartItems.reduce((acc, item: CartItemType) => {
      if (item.product) {
        return acc + item.quantity * item.product.discountedProce;
      } else {
        return acc;
      }
    }, 0);
  }, [cartItems]);

  const renderFooter = useCallback(() => {
    if (!cartItems.length) return null;
    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingHorizontal: 20,
          marginTop: 30,
          paddingBottom: 150,
        }}>
        <View
          style={{
            gap: 8,
            marginVertical: 30,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              Sub Total
            </MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              $ {total}
            </MyText>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              Shipping Fee
            </MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              $ 0.00
            </MyText>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MyText
              size={FONT_SIZE.lg}
              color={COLORS.black}
              bold={FONT_WEIGHT.bold}>
              Sub Total
            </MyText>
            <MyText
              size={FONT_SIZE.lg}
              color={COLORS.black}
              bold={FONT_WEIGHT.bold}>
              ${0 + total}
            </MyText>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <PrimaryBtn
              onPress={() => navigation.navigate('CheckOut', {total})}
              text="Check Out"
              conatinerStyle={{width: '90%', alignSelf: 'center'}}
            />
          </View>
        </View>
      </View>
    );
  }, [cartItems]);

  return (
    <FlatList
      ListHeaderComponent={() => {
        return (
          <View style={{marginBottom: 20, marginHorizontal: 20}}>
            <SafeAreaView />
            <MainHeader
              onMessagePress={() => navigation.navigate('ChatStack')}
              onNotiPress={() => navigation.navigate('AppNotification')}
            />
            <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
              My Cart
            </MyText>
          </View>
        );
      }}
      ListEmptyComponent={() => {
        return (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {loading ? <FullScreenLoader /> : <MyText>Cart is Empty</MyText>}
          </View>
        );
      }}
      data={cartItems}
      renderItem={({item}) => {
        if (item.product) {
          return (
            <View style={{marginHorizontal: 20}}>
              <CartItem
                setCartItems={setCartItems}
                qty={item.quantity}
                category={item.product.categoryId.name}
                oldPrice={String(item.product.price)}
                price={String(item.product.discountedProce)}
                productId={item.product._id}
                id={item._id}
                title={item.product.title}
                photos={item.product.photos}
              />
            </View>
          );
        } else {
          return null;
        }
      }}
      ListFooterComponent={renderFooter}
    />
  );
};

export default CartScreen;
