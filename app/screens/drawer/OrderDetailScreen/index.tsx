import {
  Image,
  Pressable,
  SafeAreaView,
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
import AntDesgin from 'react-native-vector-icons/AntDesign';
import {api_getOrderDetail} from '../../../api/order';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {OrderType} from '../../../types';
import moment from 'moment';
import {BUILD_IMAGE_URL} from '../../../api';
import DummyProductImage from '../../../../assets/img/productPlaceholder.jpeg';
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
    <View style={{marginTop: 15}}>
      <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
        Order ID - {orderId}
      </MyText>
      <View style={{flexDirection: 'row', gap: 5, marginVertical: 10}}>
        <AntDesgin
          name="clockcircle"
          size={FONT_SIZE.base}
          color={COLORS.grey}
        />
        <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
          {moment(orderDate).format('MMMM Do, YYYY h:mm A')}
        </MyText>
      </View>
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <MyText>Order Status</MyText>
        <MyText color={COLORS.greenDark} bold={FONT_WEIGHT.semibold}>
          Order Confirmed
        </MyText>
      </View>

      <View style={{}}>
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
                marginTop: isFirstSetp ? 20 : 30,
                marginLeft: 10,
              }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: isActive
                    ? COLORS.greenDark
                    : COLORS.lightgrey,
                }}>
                <View
                  style={{
                    display: isActive ? 'flex' : 'none',
                    backgroundColor: COLORS.greenDark,
                    width: 35,
                    height: 35,
                    borderRadius: 35 / 2,
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
                    height: 30,
                    position: 'absolute',
                    left: 9,
                    bottom: 20,
                  }}></View>
              </View>
              <MyText color={isActive ? COLORS.black : COLORS.grey}>
                {step}
              </MyText>
            </Pressable>
          );
        })}
      </View>
      <MyText bold={FONT_WEIGHT.semibold} style={{marginTop: 15}}>
        Order Items
      </MyText>
    </View>
  );
};

const OrderDetailScreen = () => {
  const params = useRoute<RouteProp<OrderStackParams, 'OrderDetail'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();
  const {token} = useSelector((s: RootState) => s.auth);
  const [orderData, setOrderData] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);

  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getOrderDetail(token!, params.orderId)) as {
        data: OrderType;
      };
      console.log(res, 'api_getOrderDetail');
      setOrderData(res.data);
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
        ListHeaderComponent={
          <ListHeaderComponent
            orderId={orderData?.orderId || ''}
            orderDate={orderData?.createdAt || ''}
          />
        }
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

export default OrderDetailScreen;
