import {
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OrderStackParams } from '../../../naviagtion/DrawerNavigator';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { MyText } from '../../../components/MyText';
import { FlatList } from 'react-native-gesture-handler';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import { api_getOrderDetail } from '../../../api/order';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { OrderType } from '../../../types';
import moment from 'moment';
import { BUILD_IMAGE_URL } from '../../../api';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel } from '../../../utils/sizeNormalization';
import FastImage from 'react-native-fast-image';

const Steps = [
  'Order Placed on 10 Dec',
  'Order Accepted on 10 Dec',
  'Order Packed',
  'Order Ready to Dispatch',
  'Order Dispatched',
  'Order Deliverd',
];

const ListHeaderComponent = ({
  orderDate,
  orderId,
}: {
  orderDate: string;
  orderId: string;
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  return (
    <View style={{ marginTop: pixelSizeVertical(16) }}>
      <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
        Order ID - {orderId}
      </MyText>
      <View style={{ flexDirection: 'row', gap: 5, marginVertical: pixelSizeVertical(12) }}>
        <AntDesgin
          name="clockcircle"
          size={FONT_SIZE.base}
          color={COLORS.grey}
        />
        <MyText size={FONT_SIZE.base} color={COLORS.grey}>
          {moment(orderDate).format('MMMM Do, YYYY h:mm A')}
        </MyText>
      </View>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <MyText>Order Status</MyText>
        <MyText color={COLORS.greenDark} bold={FONT_WEIGHT.semibold}>
          Order Confirmed
        </MyText>
      </View>

      <View>
        {Steps.map((step: string, index: number) => {
          const isFirstSetp = index === 0;
          const isActive = currentStepIndex >= index;
          return (
            <Pressable
              onPress={() => setCurrentStepIndex(index)}
              key={step}
              style={{
                flexDirection: 'row',
                gap: 20,
                marginTop: pixelSizeVertical(isFirstSetp ? 24 : 34),
                marginLeft: pixelSizeHorizontal(12),
              }}>
              <View
                style={{
                  width: widthPixel(19),
                  height: heightPixel(20),
                  borderRadius: BORDER_RADIUS.Medium,
                  backgroundColor: isActive
                    ? COLORS.greenDark
                    : COLORS.lightgrey,
                }}>
                <View
                  style={{
                    display: isActive ? 'flex' : 'none',
                    backgroundColor: COLORS.greenDark,
                    width: widthPixel(34),
                    height: heightPixel(35),
                    borderRadius: BORDER_RADIUS.Circle,
                    position: 'absolute',
                    opacity: 0.3,
                    top: -7.5,
                    left: -7.5,
                  }}
                />
                <View
                  style={{
                    display: isFirstSetp ? 'none' : 'flex',
                    width: 1.5,
                    backgroundColor: isActive ? COLORS.greenDark : COLORS.grey,
                    height: heightPixel(34),
                    position: 'absolute',
                    left: 9,
                    bottom: pixelSizeVertical(20),
                  }} />
              </View>
              <MyText color={isActive ? COLORS.black : COLORS.grey}>
                {step}
              </MyText>
            </Pressable>
          );
        })}
      </View>
      <MyText bold={FONT_WEIGHT.semibold} style={{ marginTop: pixelSizeVertical(16) }}>
        Order Items
      </MyText>
    </View>
  );
};

const OrderDetailScreen = () => {
  const params = useRoute<RouteProp<OrderStackParams, 'OrderDetail'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();
  const { token } = useSelector((s: RootState) => s.auth);
  const [orderData, setOrderData] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);

      const res = (await api_getOrderDetail(token!, params.orderId)) as {
        data: OrderType;
      };

      setOrderData(res.data || null);
    } catch (error) {
      console.log(error);
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

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Order Summery" />

      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ListHeaderComponent
            orderId={orderData?.orderId || ''}
            orderDate={orderData?.createdAt || ''}
          />
        }
        style={{ marginTop: pixelSizeVertical(20) }}
        data={orderData?.items || []}
        contentContainerStyle={{
          marginHorizontal: pixelSizeHorizontal(20),
          gap: 10,
        }}
        renderItem={({ item }: any) => {
          return (
            <View
              style={{
                padding: heightPixel(8),
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
            </View>
          );
        }}
      />

      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 20,
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

export default OrderDetailScreen;
