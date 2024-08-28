import {TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../styles';
import {MyText} from './MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FullScreenLoader from './FullScreenLoader';
import {api_sellerHomeOrderAction} from '../api/order';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {VendorHomeStackParams} from '../naviagtion/types';
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

const OrderStatus = (props: Props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<VendorHomeStackParams>>();
  const [iProps, setIprops] = useState(props);
  const [propValue, setPropValue] = useState(props);
  const {statusBgColor, statusText, statusTextColor} = propValue;
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);

  const requestApi = async (action: 'accepted' | 'declined') => {
    try {
      setLoading(true);
      const res = await api_sellerHomeOrderAction(
        token!,
        props.orderId,
        action,
      );
      console.log(res);
      setIprops({...props, isActionNeeded: false, statusText: action});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleAccept = () => {
    requestApi('accepted');
  };
  const handleDecline = () => {
    requestApi('declined');
  };
  if (loading) {
    return <FullScreenLoader />;
  }
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('VendorOrderDetail', {orderId: props.orderId})
      }
      style={{
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 15,
        gap: 10,
        paddingBottom: iProps.isActionNeeded ? 30 : 20,
        marginBottom: iProps.isActionNeeded ? 30 : 0,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <MyText bold={FONT_WEIGHT.bold}>Order id {iProps.orderId}</MyText>
        <MyText bold={FONT_WEIGHT.bold}>${iProps.total}</MyText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <AntDesign
            name="clockcircle"
            size={FONT_SIZE.sm}
            color={COLORS.grey}
          />
          <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            {moment(new Date(iProps.date), 'DD MMM, YYYY hh:mm A').format(
              'YYYY-MM-DD HH:mm',
            )}
          </MyText>
        </View>
        <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
          Order Total
        </MyText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: COLORS.darkBrown,
            borderRadius: 20,
          }}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <FontAwesome5
              name="shopping-bag"
              color={COLORS.white}
              size={FONT_SIZE.sm}
            />
            <MyText size={FONT_SIZE.sm} color={COLORS.white}>
              Total Order {iProps.numberOfItems || 0} Items
            </MyText>
          </View>
        </View>
        {iProps.statusText === 'accepted' && (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: COLORS.greenDark,
              borderRadius: 20,
              display: iProps.isActionNeeded ? 'none' : 'flex',
            }}>
            <MyText color={COLORS.white} size={FONT_SIZE.sm}>
              {'accepted'}
            </MyText>
          </View>
        )}
        {iProps.statusText === 'completed' && (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: COLORS.greenDark,
              borderRadius: 20,
              display: iProps.isActionNeeded ? 'none' : 'flex',
            }}>
            <MyText color={COLORS.white} size={FONT_SIZE.sm}>
              {'completed'}
            </MyText>
          </View>
        )}

        {iProps.statusText === 'declined' && (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: 'red',
              borderRadius: 20,
              display: iProps.isActionNeeded ? 'none' : 'flex',
            }}>
            <MyText color={COLORS.white} size={FONT_SIZE.sm}>
              {'declined'}
            </MyText>
          </View>
        )}
        {iProps.statusText === 'pending' && (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: 'gold',
              borderRadius: 20,
              display: iProps.isActionNeeded ? 'none' : 'flex',
            }}>
            <MyText color={COLORS.black} size={FONT_SIZE.sm}>
              {'pending'}
            </MyText>
          </View>
        )}
        {iProps.statusText === 'dispatched' && (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: 'gold',
              borderRadius: 20,
              display: iProps.isActionNeeded ? 'none' : 'flex',
            }}>
            <MyText color={COLORS.black} size={FONT_SIZE.sm}>
              {'dispatched'}
            </MyText>
          </View>
        )}
      </View>

      {iProps.isActionNeeded && (
        <View
          style={{
            width: '90%',
            height: 50,
            alignSelf: 'center',
            position: 'absolute',
            bottom: -25,
            flexDirection: 'row',
            gap: 20,
          }}>
          <TouchableOpacity
            onPress={handleAccept}
            style={{
              backgroundColor: COLORS.greenDark,
              flex: 1,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 10,
            }}>
            <AntDesign
              name="checkcircle"
              size={FONT_SIZE.xl}
              color={COLORS.white}
            />
            <MyText color={COLORS.white}>Accept</MyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDecline}
            style={{
              backgroundColor: 'red',
              flex: 1,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 10,
            }}>
            <AntDesign
              name="closecircle"
              size={FONT_SIZE.xl}
              color={COLORS.white}
            />
            <MyText color={COLORS.white}>Decline</MyText>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OrderStatus;
