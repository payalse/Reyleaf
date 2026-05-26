import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {MyText} from './MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {Rating} from 'react-native-ratings';
import IconOrderSvg from '../../assets/svg/icons/orderCompleted.svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OrderStackParams} from '../naviagtion/DrawerNavigator';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../styles';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../utils/sizeNormalization';
import {formatMoney} from '../utils/currency';

const STATUS_CONFIG: Record<string, {bg: string; text: string; label: string}> =
  {
    accepted: {bg: '#E8F5F0', text: COLORS.greenDark, label: 'Accepted'},
    completed: {bg: '#E8F5F0', text: COLORS.greenDark, label: 'Completed'},
    declined: {bg: '#FDECEA', text: COLORS.red, label: 'Declined'},
    pending: {bg: '#FEF9EC', text: '#B45309', label: 'Pending'},
    dispatched: {bg: '#EEF2FF', text: '#4338CA', label: 'Dispatched'},
  };

type Props = {
  orders: any[];
  type: 'pending' | 'completed';
  downloadInvoice?: (id: string) => void;
};

const OrderCardList = ({orders, type, downloadInvoice}: Props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.orderId}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({item}) => {
        const statusKey = item?.status?.toLowerCase() ?? '';
        const statusCfg = STATUS_CONFIG[statusKey] ?? {
          bg: COLORS.lightgrey2,
          text: COLORS.grey,
          label: item?.status ?? '—',
        };
        const hasReview = !!item?.rating;

        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OrderDetail', {orderId: item?.orderId})
            }
            activeOpacity={0.75}
            style={styles.card}>

            {/* Top row: order ID + status badge */}
            <View style={styles.topRow}>
              <MyText
                bold={FONT_WEIGHT.bold}
                size={FONT_SIZE.base}
                color={COLORS.darkBrown}>
                #{item?.orderId}
              </MyText>
              <View style={[styles.badge, {backgroundColor: statusCfg.bg}]}>
                <MyText
                  bold={FONT_WEIGHT.semibold}
                  size={FONT_SIZE.sm}
                  color={statusCfg.text}>
                  {statusCfg.label}
                </MyText>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Meta row: date + items + total */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <AntDesign
                  name="clockcircleo"
                  size={FONT_SIZE.sm}
                  color={COLORS.grey}
                />
                <MyText
                  size={FONT_SIZE.sm}
                  color={COLORS.grey}
                  style={styles.metaText}>
                  {moment(item?.createdAt).format('MMM D, YYYY · h:mm A')}
                </MyText>
              </View>
              <View style={styles.metaRight}>
                <View style={styles.metaItem}>
                  <AntDesign
                    name="shoppingcart"
                    size={FONT_SIZE.sm}
                    color={COLORS.grey}
                  />
                  <MyText
                    size={FONT_SIZE.sm}
                    color={COLORS.grey}
                    style={styles.metaText}>
                    {item?.items?.length ?? 0}{' '}
                    {item?.items?.length === 1 ? 'item' : 'items'}
                  </MyText>
                </View>
                <MyText
                  bold={FONT_WEIGHT.bold}
                  size={FONT_SIZE.base}
                  color={COLORS.darkBrown}>
                  {formatMoney(item?.totalAmount || 0)}
                </MyText>
              </View>
            </View>

            {/* Completed: review + download */}
            {type === 'completed' && (
              <>
                <View style={styles.divider} />
                <View style={styles.actionRow}>
                  {hasReview ? (
                    <View style={styles.ratingBox}>
                      <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                        Your Rating
                      </MyText>
                      <View style={styles.ratingInner}>
                        <Rating
                          type="star"
                          ratingCount={item?.rating}
                          imageSize={16}
                          readonly
                        />
                        <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                          {item?.rating}
                        </MyText>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('OrderReview', {orderId: item?._id})
                      }
                      style={styles.reviewBtn}>
                      <AntDesign
                        name="star"
                        size={FONT_SIZE.base}
                        color={COLORS.greenDark}
                      />
                      <MyText size={FONT_SIZE.sm} color={COLORS.greenDark}>
                        Write a Review
                      </MyText>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      downloadInvoice && downloadInvoice(item?._id)
                    }
                    style={styles.downloadBtn}>
                    <IconOrderSvg />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default OrderCardList;

const styles = StyleSheet.create({
  list: {
    gap: pixelSizeVertical(14),
    marginTop: pixelSizeVertical(20),
    paddingBottom: pixelSizeVertical(50),
  },
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: pixelSizeHorizontal(10),
  },
  ratingBox: {
    flex: 1,
    gap: pixelSizeVertical(4),
  },
  ratingInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(6),
  },
  reviewBtn: {
    flex: 1,
    height: heightPixel(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: pixelSizeHorizontal(8),
    backgroundColor: '#E8F5F0',
    borderRadius: BORDER_RADIUS.Medium,
    borderWidth: 1,
    borderColor: COLORS.greenDark,
  },
  downloadBtn: {
    width: heightPixel(40),
    height: heightPixel(40),
    borderRadius: BORDER_RADIUS.Medium,
    backgroundColor: COLORS.darkBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
