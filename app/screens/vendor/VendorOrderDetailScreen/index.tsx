import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OrderStackParams} from '../../../naviagtion/DrawerNavigator';
import {COLORS, FONT_SIZE, FONT_WEIGHT, hp, wp} from '../../../styles';
import {MyText} from '../../../components/MyText';
import {FlatList} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  api_getOrderDetail,
  api_sellerHomeOrderAction,
} from '../../../api/order';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {OrderType} from '../../../types';
import moment from 'moment';
import {BUILD_IMAGE_URL} from '../../../api';
import DummyProductImage from '../../../../assets/img/productPlaceholder.jpeg';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import CartSvg from '../../../../assets/svg/tab/icons/CartFill.svg';
import {Dropdown} from 'react-native-element-dropdown';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
const Steps = [
  'Order Placed on 10 Dec',
  'Order Accepted on 10 Dec',
  'Order Packed',
  'Order Ready to Dispatch',
  'Order Dispatched',
  'Order Deliverd',
];

const data = [
  {value: 'pending', label: 'pending'},
  {value: 'accepted', label: 'accepted'},
  {value: 'declined', label: 'declined'},
  {value: 'packedlabele', label: 'packed'},
  {value: 'dispatched', label: 'dispatched'},
  {value: 'completed', label: 'completed'},
  {value: 'cancelled', label: 'cancelled'},
];

const VendorOrderDetailScreen = () => {
  useHideBottomBar({});
  const params = useRoute<RouteProp<OrderStackParams, 'OrderDetail'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();
  const {token} = useSelector((s: RootState) => s.auth);
  const [orderData, setOrderData] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropValue, setDropValue] = useState('');
  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getOrderDetail(token!, params.orderId)) as {
        data: OrderType;
      };
      console.log(res, 'api_getOrderDetail');
      setOrderData(res.data);
      setDropValue(res.data.status);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (action: string) => {
    setLoading(true);
    try {
      const res = await api_sellerHomeOrderAction(
        token!,
        params.orderId,
        action,
      );
      console.log(res);
      ShowAlert({textBody: 'Status Updated', type: ALERT_TYPE.SUCCESS});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestApi();
  }, [params]);

  if (loading) {
    return <FullScreenLoader />;
  }
  return (
    <View style={{flex: 1}}>
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Order Summery" />

      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => {
          return (
            <View style={{marginTop: 15}}>
              <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
                Order ID - {orderData?.orderId || params.orderId || ''}
              </MyText>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  marginVertical: 10,
                  backgroundColor: COLORS.darkBrown,
                  alignSelf: 'flex-start',
                  flex: 0,
                  padding: 10,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CartSvg width={30} />
                <MyText size={FONT_SIZE.sm} color={COLORS.white}>
                  Total Order item 3 Items
                </MyText>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <MyText>Order Status</MyText>
                <View style={{width: 200}}>
                  <Dropdown
                    itemTextStyle={{color: 'black'}}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={[styles.inputSearchStyle]}
                    iconStyle={styles.iconStyle}
                    data={data}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Change Status"
                    searchPlaceholder="Search..."
                    value={dropValue}
                    onChange={item => {
                      setDropValue(item.value);
                      handleStatusUpdate(item.value);
                    }}
                    renderLeftIcon={() => null}
                  />
                </View>
              </View>

              <MyText bold={FONT_WEIGHT.semibold} style={{marginTop: 15}}>
                Order Items
              </MyText>
            </View>
          );
        }}
        style={{marginTop: 20}}
        data={orderData?.items || []}
        contentContainerStyle={{
          marginHorizontal: 20,
          gap: 10,
        }}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={{
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: COLORS.white,
                borderRadius: 15,
                justifyContent: 'center',
                marginBottom: 5,
              }}>
              <View
                style={{
                  backgroundColor: COLORS.grey,
                  width: wp(15),
                  height: wp(15),
                  borderRadius: 15,
                }}>
                <Image
                  style={{
                    width: wp(15),
                    height: wp(15),
                    borderRadius: 15,
                  }}
                  source={
                    item?.product?.photos[0]?.url
                      ? {uri: BUILD_IMAGE_URL(item?.product?.photos[0].url)}
                      : DummyProductImage
                  }
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.semibold}>
                    {item?.product?.title}
                  </MyText>
                  <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.semibold}>
                    ${item?.product?.discountedProce}
                  </MyText>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <MyText size={FONT_SIZE.sm}>Qty</MyText>
                  <MyText size={FONT_SIZE.sm}>{item?.quantity}</MyText>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <MyText size={FONT_SIZE.sm}>
                    {item?.product?.categoryId?.name}
                  </MyText>
                  <MyText
                    style={{textDecorationLine: 'line-through'}}
                    size={FONT_SIZE.sm}>
                    ${item?.product?.price}
                  </MyText>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View
        style={{
          backgroundColor: COLORS.white,
          width: '90%',
          alignSelf: 'center',
          marginVertical: 20,
          borderRadius: 10,
          padding: 20,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: wp(15),
              height: wp(15),
              backgroundColor: COLORS.lightgrey,
              borderRadius: wp(15) / 2,
              overflow: 'hidden',
            }}>
            {orderData?.user?.picture && (
              <Image
                source={{uri: BUILD_IMAGE_URL(orderData?.user?.picture)}}
                style={{width: '100%', height: '100%'}}
              />
            )}
          </View>
          <View style={{flex: 1, marginLeft: 20}}>
            <MyText>{orderData?.user?.fullname}</MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              {orderData?.user?.email}
            </MyText>
          </View>
          <View
            style={{
              width: wp(12),
              height: wp(12),
              borderRadius: 10,
              backgroundColor: COLORS.greenDark,
            }}></View>
        </View>
        <View style={{marginVertical: 10}}>
          <MyText>Shipping Address</MyText>
          <MyText color={COLORS.lightgrey}>
            {orderData?.address?.address}
          </MyText>
        </View>
      </View>

      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 20,
          height: hp(18),
          marginTop: 'auto',
          gap: hp(1.5),
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyText color={COLORS.grey} size={FONT_SIZE.base}>
            Sub total
          </MyText>
          <MyText color={COLORS.grey} size={FONT_SIZE.base}>
            ${orderData?.totalAmount}
          </MyText>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyText color={COLORS.grey} size={FONT_SIZE.base}>
            Shipping fee
          </MyText>
          <MyText color={COLORS.grey} size={FONT_SIZE.base}>
            ${0}
          </MyText>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyText
            color={COLORS.black}
            bold={FONT_WEIGHT.bold}
            size={FONT_SIZE.xl}>
            Total
          </MyText>
          <MyText
            color={COLORS.black}
            bold={FONT_WEIGHT.bold}
            size={FONT_SIZE.xl}>
            ${orderData?.totalAmount}
          </MyText>
        </View>
      </View>
    </View>
  );
};

export default VendorOrderDetailScreen;
const styles = StyleSheet.create({
  dropdown: {
    width: 150,
    alignSelf: 'flex-end',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: FONT_SIZE.sm,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.greenDark,
  },
  iconStyle: {
    width: 20,
    height: 20,
    color: 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
});
