import { TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT } from '../styles';
import { MyText } from './MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FullScreenLoader from './FullScreenLoader';
import { api_sellerHomeOrderAction } from '../api/order';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VendorHomeStackParams } from '../naviagtion/types';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical } from '../utils/sizeNormalization';

type Props = {
  statusBgColor: string;
  statusTextColor?: string;
  statusText: string;
  orderId: string;
  date: string;
  total: string | number;
  numberOfItems: string | number;
  isActionNeeded: boolean;
};

const OrderStatus = ({
  statusText,
  orderId,
  date,
  total,
  numberOfItems,
  isActionNeeded,
}: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<VendorHomeStackParams>>();
  const [status, setStatus] = useState(statusText);
  const [actionNeeded, setActionNeeded] = useState(isActionNeeded);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((s: RootState) => s.auth);

  const handleChangeStatus = async (action: 'accepted' | 'declined') => {
    try {
      setLoading(true);
      await api_sellerHomeOrderAction(token!, orderId, action);
      setStatus(action);
      setActionNeeded(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusTag = () => {
    const statusStyles: any = {
      accepted: { bgColor: COLORS.greenDark, color: COLORS.white },
      completed: { bgColor: COLORS.greenDark, color: COLORS.white },
      declined: { bgColor: 'red', color: COLORS.white },
      pending: { bgColor: 'gold', color: COLORS.black },
      dispatched: { bgColor: 'gold', color: COLORS.black },
    };

    const { bgColor, color }: any = statusStyles[status] || {};

    if (actionNeeded || !bgColor) return null;

    return (
      <View
        style={{
          paddingVertical: pixelSizeVertical(10),
          paddingHorizontal: pixelSizeHorizontal(16),
          backgroundColor: bgColor,
          borderRadius: BORDER_RADIUS['Semi-Large'],
        }}>
        <MyText color={color} size={FONT_SIZE.base}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </MyText>
      </View>
    );
  };

  if (loading) return <FullScreenLoader />;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('VendorOrderDetail', { orderId })}
      style={{
        backgroundColor: COLORS.white,
        padding: heightPixel(20),
        borderRadius: BORDER_RADIUS.Medium,
        gap: 10,
        paddingBottom: pixelSizeVertical(20),
        marginVertical: pixelSizeVertical(8),
      }}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>Order id {orderId}</MyText>
        <MyText bold={FONT_WEIGHT.bold}>${total}</MyText>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <AntDesign name="clockcircle" size={FONT_SIZE.base} color={COLORS.grey} />
          <MyText size={FONT_SIZE.base} color={COLORS.grey}>
            {moment(new Date(date)).format('YYYY-MM-DD HH:mm')}
          </MyText>
        </View>
        <MyText size={FONT_SIZE.base} color={COLORS.grey}>Order Total</MyText>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={{
            paddingVertical: pixelSizeVertical(10),
            paddingHorizontal: pixelSizeHorizontal(16),
            backgroundColor: COLORS.darkBrown,
            borderRadius: BORDER_RADIUS['Semi-Large'],
          }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <FontAwesome5 name="shopping-bag" color={COLORS.white} size={FONT_SIZE.base} />
            <MyText size={FONT_SIZE.base} color={COLORS.white}>
              Total Order {numberOfItems || 0} Items
            </MyText>
          </View>
        </View>
        {renderStatusTag()}
      </View>

      {actionNeeded && (
        <View style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <TouchableOpacity
            onPress={() => handleChangeStatus('accepted')}
            style={{
              backgroundColor: COLORS.greenDark,
              flex: 1,
              height: heightPixel(40),
              borderRadius: BORDER_RADIUS['Semi-Large'],
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 10,
              marginRight: pixelSizeHorizontal(10),
            }}>
            <AntDesign name="checkcircle" size={FONT_SIZE.xl} color={COLORS.white} />
            <MyText color={COLORS.white}>Accept</MyText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleChangeStatus('declined')}
            style={{
              backgroundColor: 'red',
              flex: 1,
              height: heightPixel(40),
              borderRadius: BORDER_RADIUS['Semi-Large'],
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 10,
            }}>
            <AntDesign name="closecircle" size={FONT_SIZE.xl} color={COLORS.white} />
            <MyText color={COLORS.white}>Decline</MyText>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OrderStatus;
