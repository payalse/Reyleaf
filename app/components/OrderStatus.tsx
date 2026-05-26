import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useState} from 'react';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../styles';
import {MyText} from './MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FullScreenLoader from './FullScreenLoader';
import {api_sellerHomeOrderAction} from '../api/order';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {VendorHomeStackParams} from '../naviagtion/types';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../utils/sizeNormalization';
import {formatMoney} from '../utils/currency';

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

const STATUS_CONFIG: Record<string, {bg: string; text: string; label: string}> =
  {
    accepted: {bg: '#E8F5F0', text: COLORS.greenDark, label: 'Accepted'},
    completed: {bg: '#E8F5F0', text: COLORS.greenDark, label: 'Completed'},
    declined: {bg: '#FDECEA', text: COLORS.red, label: 'Declined'},
    pending: {bg: '#FEF9EC', text: '#B45309', label: 'Pending'},
    dispatched: {bg: '#EEF2FF', text: '#4338CA', label: 'Dispatched'},
  };

const OrderStatus = ({
  statusText,
  orderId,
  date,
  total,
  numberOfItems,
  isActionNeeded,
}: Props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<VendorHomeStackParams>>();
  const [status, setStatus] = useState(statusText);
  const [actionNeeded, setActionNeeded] = useState(isActionNeeded);
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);

  const handleChangeStatus = async (action: 'accepted' | 'declined') => {
    try {
      setLoading(true);
      await api_sellerHomeOrderAction(token!, orderId, action);
      setStatus(action);
      setActionNeeded(false);
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusCfg = STATUS_CONFIG[status?.toLowerCase()] ?? {
    bg: COLORS.lightgrey2,
    text: COLORS.grey,
    label: status,
  };

  if (loading) return <FullScreenLoader />;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('VendorOrderDetail', {orderId})}
      activeOpacity={0.75}
      style={styles.card}>

      {/* Top row: order ID + status badge */}
      <View style={styles.topRow}>
        <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.base} color={COLORS.darkBrown}>
          #{orderId}
        </MyText>
        {!actionNeeded && (
          <View style={[styles.badge, {backgroundColor: statusCfg.bg}]}>
            <MyText
              bold={FONT_WEIGHT.semibold}
              size={FONT_SIZE.sm}
              color={statusCfg.text}>
              {statusCfg.label}
            </MyText>
          </View>
        )}
        {actionNeeded && (
          <View style={[styles.badge, {backgroundColor: STATUS_CONFIG.pending.bg}]}>
            <MyText
              bold={FONT_WEIGHT.semibold}
              size={FONT_SIZE.sm}
              color={STATUS_CONFIG.pending.text}>
              New Order
            </MyText>
          </View>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Meta row: date + items + total */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <AntDesign name="clockcircleo" size={FONT_SIZE.sm} color={COLORS.grey} />
          <MyText size={FONT_SIZE.sm} color={COLORS.grey} style={styles.metaText}>
            {moment(new Date(date)).format('MMM D, YYYY · h:mm A')}
          </MyText>
        </View>
        <View style={styles.metaRight}>
          <View style={styles.metaItem}>
            <AntDesign name="shoppingcart" size={FONT_SIZE.sm} color={COLORS.grey} />
            <MyText size={FONT_SIZE.sm} color={COLORS.grey} style={styles.metaText}>
              {numberOfItems} {Number(numberOfItems) === 1 ? 'item' : 'items'}
            </MyText>
          </View>
          <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.base} color={COLORS.darkBrown}>
            {formatMoney(Number(total) || 0)}
          </MyText>
        </View>
      </View>

      {/* Action buttons for pending orders */}
      {actionNeeded && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => handleChangeStatus('declined')}
            style={[styles.actionBtn, styles.declineBtn]}>
            <MyText bold={FONT_WEIGHT.semibold} size={FONT_SIZE.sm} color={COLORS.red}>
              Decline
            </MyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChangeStatus('accepted')}
            style={[styles.actionBtn, styles.acceptBtn]}>
            <MyText bold={FONT_WEIGHT.semibold} size={FONT_SIZE.sm} color={COLORS.white}>
              Accept Order
            </MyText>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OrderStatus;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.Medium,
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(14),
    borderWidth: 1,
    borderColor: COLORS.lightgrey2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: pixelSizeVertical(10),
  },
  badge: {
    paddingHorizontal: pixelSizeHorizontal(10),
    paddingVertical: pixelSizeVertical(4),
    borderRadius: BORDER_RADIUS.Circle,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightgrey2,
    marginBottom: pixelSizeVertical(10),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(5),
  },
  metaText: {
    marginLeft: pixelSizeHorizontal(2),
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(12),
  },
  actionRow: {
    flexDirection: 'row',
    gap: pixelSizeHorizontal(10),
    marginTop: pixelSizeVertical(12),
  },
  actionBtn: {
    flex: 1,
    height: heightPixel(40),
    borderRadius: BORDER_RADIUS['Semi-Large'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: COLORS.greenDark,
  },
  declineBtn: {
    backgroundColor: '#FDECEA',
  },
});
