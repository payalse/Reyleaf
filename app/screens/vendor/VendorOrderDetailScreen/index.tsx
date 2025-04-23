import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OrderStackParams } from '../../../naviagtion/DrawerNavigator';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT, hp, wp } from '../../../styles';
import { MyText } from '../../../components/MyText';
import { FlatList } from 'react-native-gesture-handler';
import {
  api_getOrderDetail,
  api_sellerHomeOrderAction,
} from '../../../api/order';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { OrderType } from '../../../types';
import { BUILD_IMAGE_URL } from '../../../api';
import { useHideBottomBar } from '../../../hook/useHideBottomBar';
import CartSvg from '../../../../assets/svg/tab/icons/CartFill.svg';
import { Dropdown } from 'react-native-element-dropdown';
import { ShowAlert } from '../../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import { fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel } from '../../../utils/sizeNormalization';
import FastImage from 'react-native-fast-image';

// const Steps = [
//   'Order Placed on 10 Dec',
//   'Order Accepted on 10 Dec',
//   'Order Packed',
//   'Order Ready to Dispatch',
//   'Order Dispatched',
//   'Order Deliverd',
// ];

const data = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'packedlabele', label: 'Packed' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const VendorOrderDetailScreen = () => {
  useHideBottomBar({});
  const params = useRoute<RouteProp<OrderStackParams, 'OrderDetail'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();
  const { token } = useSelector((s: RootState) => s.auth);
  const [orderData, setOrderData] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropValue, setDropValue] = useState('');

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);

      const res = await api_getOrderDetail(token!, params.orderId) as {
        status: number;
        data: OrderType;
        message?: string;
      };

      if (!res || res.status !== 200 || !res.data) {
        throw new Error(res?.message || 'Invalid response received.');
      }

      setOrderData(res.data);
      setDropValue(res.data.status);
    } catch (error: any) {
      console.error('Error fetching order details:', error?.message || error);
      ShowAlert({
        textBody: error?.message || 'Failed to load order details.',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [params]);

  if (loading) {
    return <FullScreenLoader />;
  }

  const handleStatusUpdate = async (action: string) => {
    setLoading(true);
    try {
      const res = await api_sellerHomeOrderAction(token!, params.orderId, action) as {
        status: number;
        message?: string;
      };

      if (!res || res.status !== 200) {
        throw new Error(res?.message || 'Failed to update order status.');
      }

      ShowAlert({ textBody: 'Status Updated', type: ALERT_TYPE.SUCCESS });
    } catch (error: any) {
      console.error('Error updating status:', error?.message || error);
      ShowAlert({
        textBody: error?.message || 'Failed to update status.',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Order Summery" />

      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => {
          return (
            <View style={{ marginTop: pixelSizeVertical(15) }}>
              <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
                Order ID - {orderData?.orderId || params.orderId || ''}
              </MyText>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  marginVertical: pixelSizeVertical(10),
                  backgroundColor: COLORS.darkBrown,
                  alignSelf: 'flex-start',
                  flex: 0,
                  padding: heightPixel(10),
                  borderRadius: BORDER_RADIUS.Circle,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CartSvg width={widthPixel(30)} />
                <MyText size={FONT_SIZE.base} color={COLORS.white}>
                  Total Order item {orderData?.items.length || 0} Items
                </MyText>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <MyText>Order Status</MyText>
                <View style={{ width: widthPixel(200) }}>
                  <Dropdown
                    itemTextStyle={{ color: 'black' }}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={[styles.inputSearchStyle]}
                    iconStyle={styles.iconStyle}
                    data={data}
                    maxHeight={heightPixel(300)}
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

              <MyText bold={FONT_WEIGHT.semibold} style={{ marginTop: 15 }}>
                Order Items
              </MyText>
            </View>
          );
        }}
        style={{ marginTop: pixelSizeVertical(20) }}
        data={orderData?.items || []}
        contentContainerStyle={{
          marginHorizontal: pixelSizeHorizontal(20),
          gap: 10,
        }}
        renderItem={({ item }: any) => {
          return (
            <TouchableOpacity
              style={{
                padding: heightPixel(11),
                maxHeight: heightPixel(74),
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: COLORS.white,
                borderRadius: BORDER_RADIUS.Medium,
                justifyContent: 'center',
                marginBottom: pixelSizeVertical(6),
              }}>
              <View
                style={{
                  backgroundColor: COLORS.grey,
                  width: widthPixel(56),
                  height: heightPixel(60),
                  borderRadius: BORDER_RADIUS.Medium,
                }}>
                <FastImage
                  source={
                    item?.product?.photos[0]?.url
                      ? { uri: BUILD_IMAGE_URL(item.product.photos[0].url) }
                      : require('../../../../assets/img/productPlaceholder.jpeg')
                  }
                  style={{
                    width: widthPixel(56),
                    height: heightPixel(60),
                    borderRadius: BORDER_RADIUS.Medium,
                  }}
                  resizeMode={
                    item?.product?.photos[0]?.url
                      ? FastImage.resizeMode.contain
                      : FastImage.resizeMode.stretch
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
                  <MyText bold={FONT_WEIGHT.semibold}>
                    {item?.product?.title.length > 30 ? `${item?.product?.title.substring(0, 30)}...` : item?.product?.title}
                  </MyText>
                  <MyText bold={FONT_WEIGHT.semibold}>
                    ${item?.product?.discountedProce}
                  </MyText>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <MyText size={FONT_SIZE.base}>Qty</MyText>
                  <MyText size={FONT_SIZE.base}>{item?.quantity}</MyText>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <MyText size={FONT_SIZE.base}>
                    {item?.product?.categoryId?.name}
                  </MyText>
                  <MyText
                    style={{ textDecorationLine: 'line-through' }}
                    size={FONT_SIZE.base}>
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
          marginVertical: pixelSizeVertical(20),
          borderRadius: BORDER_RADIUS.XMedium,
          padding: heightPixel(20),
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: widthPixel(58),
              height: heightPixel(60),
              backgroundColor: COLORS.lightgrey,
              borderRadius: BORDER_RADIUS.Circle,
              overflow: 'hidden',
            }}>
            {orderData?.user?.picture && (
              <FastImage
                source={{ uri: BUILD_IMAGE_URL(orderData?.user?.picture) }}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: pixelSizeHorizontal(20) }}>
            <MyText>{orderData?.user?.fullname}</MyText>
            <MyText style={{ marginTop: pixelSizeVertical(2) }} size={FONT_SIZE.base} color={COLORS.grey}>
              {orderData?.user?.email}
            </MyText>
          </View>
          {/* <View
            style={{
              width: widthPixel(40),
              height:heightPixel(40),
              borderRadius: 10,
              backgroundColor: COLORS.greenDark,
            }}></View> */}
        </View>
        <View style={{ marginVertical: pixelSizeVertical(10) }}>
          <MyText bold={FONT_WEIGHT.black}>Shipping Address</MyText>
          <MyText color={COLORS.black}
            style={{
              opacity: .5,
              marginTop: pixelSizeVertical(4)
            }}>
            {orderData?.address?.address}, {orderData?.address?.city}, {orderData?.address?.state}, {orderData?.address?.country}
          </MyText>
        </View>
      </View>

      <View
        style={{
          backgroundColor: COLORS.white,
          padding: heightPixel(20),
          height: "18%",
          marginTop: 'auto',
          gap: 8,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <MyText color={COLORS.grey} size={FONT_SIZE.base}>
            Sub total
          </MyText>
          <MyText color={COLORS.grey} size={FONT_SIZE.base}>
            ${orderData?.totalAmount}
          </MyText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <MyText color={COLORS.grey} size={FONT_SIZE.base}>
            Shipping fee
          </MyText>
          <MyText color={COLORS.grey} size={FONT_SIZE.base}>
            ${0}
          </MyText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
    width: widthPixel(150),
    alignSelf: 'flex-end',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: BORDER_RADIUS.Circle,
    paddingHorizontal: pixelSizeHorizontal(10),
    paddingVertical: pixelSizeVertical(6),
  },
  icon: {
    marginRight: pixelSizeHorizontal(6),
  },
  placeholderStyle: {
    fontSize: FONT_SIZE.base,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: fontPixel(16),
    color: COLORS.greenDark,
  },
  iconStyle: {
    width: widthPixel(20),
    height: heightPixel(20),
    color: 'black',
  },
  inputSearchStyle: {
    height: heightPixel(40),
    fontSize: fontPixel(16),
    color: 'black',
  },
});
