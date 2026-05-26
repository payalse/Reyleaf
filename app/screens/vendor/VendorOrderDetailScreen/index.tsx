import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from 'react';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OrderStackParams} from '../../../naviagtion/DrawerNavigator';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import {api_getOrderDetail, api_sellerHomeOrderAction} from '../../../api/order';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {OrderType} from '../../../types';
import {BUILD_IMAGE_URL} from '../../../api';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import {Dropdown} from 'react-native-element-dropdown';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../../utils/sizeNormalization';
import FastImage from 'react-native-fast-image';
import {formatMoney} from '../../../utils/currency';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

const STATUS_OPTIONS = [
  {value: 'pending', label: 'Pending'},
  {value: 'accepted', label: 'Accepted'},
  {value: 'declined', label: 'Declined'},
  {value: 'packedlabele', label: 'Packed'},
  {value: 'dispatched', label: 'Dispatched'},
  {value: 'completed', label: 'Completed'},
  {value: 'cancelled', label: 'Cancelled'},
];

const STATUS_CONFIG: Record<string, {bg: string; text: string}> = {
  accepted:  {bg: '#E8F5F0', text: COLORS.greenDark},
  completed: {bg: '#E8F5F0', text: COLORS.greenDark},
  declined:  {bg: '#FDECEA', text: COLORS.red},
  cancelled: {bg: '#FDECEA', text: COLORS.red},
  pending:   {bg: '#FEF9EC', text: '#B45309'},
  packedlabele: {bg: '#EEF2FF', text: '#4338CA'},
  dispatched:{bg: '#EEF2FF', text: '#4338CA'},
};

const SummaryRow = ({
  label,
  value,
  bold,
  color,
  topDivider,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
  topDivider?: boolean;
}) => (
  <View style={[styles.summaryRow, topDivider && styles.summaryDivider]}>
    <MyText
      size={bold ? FONT_SIZE.base : FONT_SIZE.base}
      bold={bold ? FONT_WEIGHT.semibold : FONT_WEIGHT.normal}
      color={color ?? COLORS.grey}>
      {label}
    </MyText>
    <MyText
      size={bold ? FONT_SIZE.base : FONT_SIZE.base}
      bold={bold ? FONT_WEIGHT.semibold : FONT_WEIGHT.normal}
      color={color ?? COLORS.grey}>
      {value}
    </MyText>
  </View>
);

const VendorOrderDetailScreen = () => {
  useHideBottomBar({});
  const params = useRoute<RouteProp<OrderStackParams, 'OrderDetail'>>().params;
  const navigation = useNavigation<NativeStackNavigationProp<OrderStackParams>>();
  const {token} = useSelector((s: RootState) => s.auth);
  const [orderData, setOrderData] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropValue, setDropValue] = useState('');

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const res = (await api_getOrderDetail(token!, params.orderId)) as {
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

  const handleStatusUpdate = async (action: string) => {
    setLoading(true);
    try {
      const res = (await api_sellerHomeOrderAction(
        token!,
        params.orderId,
        action,
      )) as {status: number; message?: string};
      if (!res || res.status !== 200) {
        throw new Error(res?.message || 'Failed to update order status.');
      }
      ShowAlert({textBody: 'Status updated', type: ALERT_TYPE.SUCCESS});
    } catch (error: any) {
      ShowAlert({
        textBody: error?.message || 'Failed to update status.',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullScreenLoader />;

  const statusCfg = STATUS_CONFIG[dropValue?.toLowerCase()] ?? {
    bg: COLORS.lightgrey2,
    text: COLORS.grey,
  };
  const earnings =
    (orderData?.totalAmount || 0) - (orderData?.appFee || 0);

  return (
    <View style={styles.root}>
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Order Summary" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>

        {/* ── Order header card ── */}
        <View style={styles.card}>
          {/* Dark brown banner */}
          <View style={styles.cardBanner}>
            <View>
              <MyText size={FONT_SIZE.sm} color="rgba(255,255,255,0.6)">
                Order ID
              </MyText>
              <MyText
                bold={FONT_WEIGHT.bold}
                size={FONT_SIZE['1.5xl']}
                color={COLORS.white}
                style={styles.orderIdText}>
                #{orderData?.orderId || params.orderId}
              </MyText>
              {orderData?.createdAt ? (
                <MyText size={FONT_SIZE.sm} color="rgba(255,255,255,0.6)" style={styles.dateText}>
                  {moment(orderData.createdAt).format('MMM D, YYYY · h:mm A')}
                </MyText>
              ) : null}
            </View>
            <View style={[styles.badge, {backgroundColor: statusCfg.bg}]}>
              <MyText bold={FONT_WEIGHT.semibold} size={FONT_SIZE.sm} color={statusCfg.text}>
                {STATUS_OPTIONS.find(o => o.value === dropValue)?.label ?? dropValue}
              </MyText>
            </View>
          </View>

          {/* Status update dropdown */}
          <View style={styles.statusRow}>
            <MyText size={FONT_SIZE.base} color={COLORS.grey}>
              Update status
            </MyText>
            <Dropdown
              itemTextStyle={styles.dropItemText}
              style={styles.dropdown}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.dropSelected}
              inputSearchStyle={styles.dropSearch}
              iconStyle={styles.dropIcon}
              data={STATUS_OPTIONS}
              maxHeight={heightPixel(280)}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={dropValue}
              onChange={item => {
                setDropValue(item.value);
                handleStatusUpdate(item.value);
              }}
              renderLeftIcon={() => null}
            />
          </View>
        </View>

        {/* ── Order items ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionAccent} />
            <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.base} color={COLORS.darkBrown}>
              Order Items
            </MyText>
          </View>
          <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            {orderData?.items?.length ?? 0}{' '}
            {(orderData?.items?.length ?? 0) === 1 ? 'item' : 'items'}
          </MyText>
        </View>

        <View style={styles.card}>
          {(orderData?.items || []).map((item: any, index: number) => {
            const discounted = item?.product?.discountedProce || 0;
            const original = item?.product?.price || 0;
            const effectivePrice = discounted > 0 ? discounted : original;
            const hasDiscount = discounted > 0 && original > discounted;
            const isLast = index === (orderData?.items?.length ?? 0) - 1;

            return (
              <View key={item._id ?? index}>
                <View style={styles.itemRow}>
                  <FastImage
                    source={
                      item?.product?.photos?.[0]?.url
                        ? {uri: BUILD_IMAGE_URL(item.product.photos[0].url)}
                        : require('../../../../assets/img/productPlaceholder.jpeg')
                    }
                    style={styles.itemImage}
                    resizeMode={
                      item?.product?.photos?.[0]?.url
                        ? FastImage.resizeMode.contain
                        : FastImage.resizeMode.stretch
                    }
                  />
                  <View style={styles.itemInfo}>
                    <MyText
                      bold={FONT_WEIGHT.semibold}
                      size={FONT_SIZE.base}
                      color={COLORS.darkBrown}
                      numberOfLines={1}>
                      {item?.product?.title}
                    </MyText>
                    <MyText
                      size={FONT_SIZE.sm}
                      color={COLORS.grey}
                      style={styles.itemCategory}>
                      {item?.product?.categoryId?.name}
                    </MyText>
                    <View style={styles.itemPriceRow}>
                      <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                        Qty: {item?.quantity}
                      </MyText>
                      <View style={styles.itemPrices}>
                        {hasDiscount && (
                          <MyText
                            size={FONT_SIZE.sm}
                            color={COLORS.grey}
                            style={styles.strikethrough}>
                            {formatMoney(original)}
                          </MyText>
                        )}
                        <MyText
                          bold={FONT_WEIGHT.semibold}
                          size={FONT_SIZE.base}
                          color={COLORS.greenDark}>
                          {formatMoney(effectivePrice)}
                        </MyText>
                      </View>
                    </View>
                  </View>
                </View>
                {!isLast && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>

        {/* ── Customer & address ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionAccent} />
            <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.base} color={COLORS.darkBrown}>
              Customer
            </MyText>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.customerRow}>
            <View style={styles.avatar}>
              {orderData?.user?.picture ? (
                <FastImage
                  source={{uri: BUILD_IMAGE_URL(orderData.user.picture)}}
                  style={styles.avatarImage}
                />
              ) : (
                <AntDesign name="user" size={fontPixel(22)} color={COLORS.white} />
              )}
            </View>
            <View style={styles.customerInfo}>
              <MyText bold={FONT_WEIGHT.semibold} size={FONT_SIZE.base} color={COLORS.darkBrown}>
                {orderData?.user?.fullname}
              </MyText>
              <MyText size={FONT_SIZE.sm} color={COLORS.grey} style={styles.customerEmail}>
                {orderData?.user?.email}
              </MyText>
            </View>
          </View>

          {orderData?.address && (
            <>
              <View style={styles.divider} />
              <View style={styles.addressRow}>
                <AntDesign
                  name="enviromento"
                  size={fontPixel(14)}
                  color={COLORS.greenDark}
                  style={styles.addressIcon}
                />
                <MyText size={FONT_SIZE.sm} color={COLORS.grey} style={styles.addressText}>
                  {[
                    orderData.address.address,
                    orderData.address.city,
                    orderData.address.state,
                    orderData.address.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </MyText>
              </View>
            </>
          )}
        </View>

        {/* ── Order summary ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionAccent} />
            <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.base} color={COLORS.darkBrown}>
              Summary
            </MyText>
          </View>
        </View>

        <View style={styles.card}>
          <SummaryRow
            label="Subtotal"
            value={formatMoney(orderData?.subtotal || orderData?.totalAmount || 0)}
          />
          {(orderData?.taxAmount || 0) > 0 && (
            <SummaryRow
              label="Tax"
              value={formatMoney(orderData?.taxAmount || 0)}
            />
          )}
          <SummaryRow
            label="Shipping"
            value={
              (orderData?.shippingCost || 0) === 0
                ? 'Free'
                : formatMoney(orderData?.shippingCost || 0)
            }
          />
          {(orderData?.fee_snapshot?.app_fee_computed || orderData?.appFee || 0) > 0 && (
            <SummaryRow
              label="Platform fee"
              value={formatMoney(
                orderData?.fee_snapshot?.app_fee_computed || orderData?.appFee || 0,
              )}
            />
          )}
          <SummaryRow
            label="Total"
            value={formatMoney(orderData?.totalAmount || 0)}
            bold
            color={COLORS.darkBrown}
            topDivider
          />
          {/* Earnings highlight row */}
          <View style={styles.earningsRow}>
            <MyText bold={FONT_WEIGHT.semibold} size={FONT_SIZE.base} color={COLORS.greenDark}>
              Your earnings
            </MyText>
            <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.base} color={COLORS.greenDark}>
              {formatMoney(earnings)}
            </MyText>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default VendorOrderDetailScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(14),
    paddingBottom: heightPixel(40),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.Medium,
    borderWidth: 1,
    borderColor: COLORS.lightgrey2,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightgrey2,
  },
  // Order header banner
  cardBanner: {
    backgroundColor: COLORS.darkBrown,
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderIdText: {
    marginTop: pixelSizeVertical(3),
    marginBottom: pixelSizeVertical(4),
  },
  dateText: {},
  badge: {
    paddingHorizontal: pixelSizeHorizontal(10),
    paddingVertical: pixelSizeVertical(4),
    borderRadius: BORDER_RADIUS.Circle,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(12),
  },
  // Dropdown
  dropdown: {
    width: widthPixel(160),
    borderColor: COLORS.lightgrey2,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.Circle,
    paddingHorizontal: pixelSizeHorizontal(12),
    paddingVertical: pixelSizeVertical(6),
  },
  dropItemText: {
    color: COLORS.darkBrown,
    fontSize: FONT_SIZE.base,
  },
  dropPlaceholder: {
    fontSize: FONT_SIZE.base,
    color: COLORS.grey,
  },
  dropSelected: {
    fontSize: FONT_SIZE.base,
    color: COLORS.greenDark,
    fontWeight: FONT_WEIGHT.semibold,
  },
  dropSearch: {
    height: heightPixel(40),
    fontSize: FONT_SIZE.base,
    color: COLORS.darkBrown,
  },
  dropIcon: {
    width: widthPixel(18),
    height: heightPixel(18),
  },
  // Section header — drives all vertical rhythm
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    paddingHorizontal: pixelSizeHorizontal(2),
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionAccent: {
    width: widthPixel(3),
    height: heightPixel(16),
    backgroundColor: COLORS.greenDark,
    borderRadius: widthPixel(2),
    marginRight: pixelSizeHorizontal(8),
  },
  // Item row
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(12),
  },
  itemImage: {
    width: widthPixel(56),
    height: heightPixel(60),
    borderRadius: BORDER_RADIUS.Small,
    backgroundColor: COLORS.lightgrey2,
    marginRight: pixelSizeHorizontal(12),
  },
  itemInfo: {
    flex: 1,
  },
  itemCategory: {
    marginTop: pixelSizeVertical(2),
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: pixelSizeVertical(6),
  },
  itemPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: pixelSizeHorizontal(6),
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  // Customer
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(14),
  },
  avatar: {
    width: widthPixel(44),
    height: widthPixel(44),
    borderRadius: widthPixel(22),
    backgroundColor: COLORS.darkBrown,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: pixelSizeHorizontal(12),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  customerInfo: {
    flex: 1,
  },
  customerEmail: {
    marginTop: pixelSizeVertical(2),
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingBottom: pixelSizeVertical(14),
  },
  addressIcon: {
    marginTop: pixelSizeVertical(1),
    marginRight: pixelSizeHorizontal(6),
  },
  addressText: {
    flex: 1,
    lineHeight: 18,
  },
  // Summary
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: pixelSizeVertical(7),
    paddingHorizontal: pixelSizeHorizontal(16),
  },
  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgrey2,
    marginTop: pixelSizeVertical(2),
    paddingTop: pixelSizeVertical(6),
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5F0',
    paddingVertical: pixelSizeVertical(12),
    paddingHorizontal: pixelSizeHorizontal(16),
    marginTop: pixelSizeVertical(4),
  },
});
