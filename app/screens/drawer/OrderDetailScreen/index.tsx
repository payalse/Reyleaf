import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {useEffect, useState} from 'react';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OrderStackParams} from '../../../naviagtion/DrawerNavigator';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {api_getOrderDetail} from '../../../api/order';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {OrderType} from '../../../types';
import moment from 'moment';
import {BUILD_IMAGE_URL} from '../../../api';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../../utils/sizeNormalization';
import FastImage from 'react-native-fast-image';
import {formatMoney} from '../../../utils/currency';

const STATUS_CONFIG: Record<string, {bg: string; text: string; label: string}> =
  {
    accepted:     {bg: '#E8F5F0', text: COLORS.greenDark,  label: 'Accepted'},
    completed:    {bg: '#E8F5F0', text: COLORS.greenDark,  label: 'Completed'},
    declined:     {bg: '#FDECEA', text: COLORS.red,         label: 'Declined'},
    cancelled:    {bg: '#FDECEA', text: COLORS.red,         label: 'Cancelled'},
    pending:      {bg: '#FEF9EC', text: '#B45309',          label: 'Pending'},
    packedlabele: {bg: '#EEF2FF', text: '#4338CA',          label: 'Packed'},
    dispatched:   {bg: '#EEF2FF', text: '#4338CA',          label: 'Dispatched'},
  };

const STATUS_STEPS = [
  {key: 'pending',      label: 'Order Placed',     desc: 'We received your order'},
  {key: 'accepted',     label: 'Order Accepted',   desc: 'Seller confirmed your order'},
  {key: 'packedlabele', label: 'Order Packed',      desc: 'Items are being packed'},
  {key: 'dispatched',   label: 'Out for Delivery',  desc: 'Your order is on the way'},
  {key: 'completed',    label: 'Delivered',         desc: 'Order completed successfully'},
];

const ORDER_STEP_INDEX: Record<string, number> = {
  pending:      0,
  accepted:     1,
  packedlabele: 2,
  dispatched:   3,
  completed:    4,
  declined:     -1,
  cancelled:    -1,
};

const OrderDetailScreen = () => {
  useHideBottomBar({});
  const params = useRoute<RouteProp<OrderStackParams, 'OrderDetail'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();
  const {token} = useSelector((s: RootState) => s.auth);
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

  if (loading) return <FullScreenLoader />;

  const statusKey = orderData?.status?.toLowerCase() ?? '';
  const statusCfg = STATUS_CONFIG[statusKey] ?? {
    bg: COLORS.lightgrey2,
    text: COLORS.grey,
    label: orderData?.status ?? '—',
  };
  const currentStep = ORDER_STEP_INDEX[statusKey] ?? 0;
  const isCancelledOrDeclined = statusKey === 'declined' || statusKey === 'cancelled';

  return (
    <View style={styles.root}>
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Order Summary" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>

        {/* ── Order header card ── */}
        <View style={styles.card}>
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
                <MyText size={FONT_SIZE.sm} color="rgba(255,255,255,0.6)">
                  {moment(orderData.createdAt).format('MMM D, YYYY · h:mm A')}
                </MyText>
              ) : null}
            </View>
            <View style={[styles.badge, {backgroundColor: statusCfg.bg}]}>
              <MyText
                bold={FONT_WEIGHT.semibold}
                size={FONT_SIZE.sm}
                color={statusCfg.text}>
                {statusCfg.label}
              </MyText>
            </View>
          </View>
        </View>

        {/* ── Order timeline ── */}
        {!isCancelledOrDeclined && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLabelRow}>
                <View style={styles.sectionAccent} />
                <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.base} color={COLORS.darkBrown}>
                  Order Progress
                </MyText>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.timelineContainer}>
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = currentStep > index;
                  const isCurrent = currentStep === index;
                  const isActive = currentStep >= index;
                  const isLast = index === STATUS_STEPS.length - 1;

                  const pill = isCompleted
                    ? {bg: '#E8F5F0', text: COLORS.greenDark, label: 'Done'}
                    : isCurrent
                    ? {bg: '#FEF9EC', text: '#B45309', label: 'In Progress'}
                    : {bg: COLORS.lightgrey2, text: COLORS.grey, label: 'Upcoming'};

                  return (
                    <View key={step.key} style={styles.timelineItem}>
                      {/* dot + line */}
                      <View style={styles.timelineLeft}>
                        <View style={[styles.timelineDot, isActive && styles.timelineDotActive]}>
                          {isCompleted && (
                            <AntDesign name="check" size={fontPixel(8)} color={COLORS.white} style={styles.timelineCheck} />
                          )}
                        </View>
                        {!isLast && (
                          <View style={[styles.timelineLine, isActive && styles.timelineLineActive]} />
                        )}
                      </View>

                      {/* right content */}
                      <View style={styles.timelineRight}>
                        <View style={styles.timelineTitleRow}>
                          <MyText
                            size={FONT_SIZE.base}
                            bold={isActive ? FONT_WEIGHT.semibold : FONT_WEIGHT.normal}
                            color={isActive ? COLORS.darkBrown : COLORS.grey}>
                            {step.label}
                          </MyText>
                          <View style={[styles.timelinePill, {backgroundColor: pill.bg}]}>
                            <MyText
                              size={FONT_SIZE.xs}
                              bold={FONT_WEIGHT.semibold}
                              color={pill.text}>
                              {pill.label}
                            </MyText>
                          </View>
                        </View>
                        <MyText
                          size={FONT_SIZE.sm}
                          color={isActive ? COLORS.grey : COLORS.lightgrey}>
                          {step.desc}
                        </MyText>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}

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
                    <MyText size={FONT_SIZE.sm} color={COLORS.grey} style={styles.itemCategory}>
                      {item?.product?.categoryId?.name}
                    </MyText>
                    <View style={styles.itemPriceRow}>
                      <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                        Qty: {item?.quantity}
                      </MyText>
                      <View style={styles.itemPrices}>
                        {hasDiscount && (
                          <MyText size={FONT_SIZE.sm} color={COLORS.grey} style={styles.strikethrough}>
                            {formatMoney(original)}
                          </MyText>
                        )}
                        <MyText bold={FONT_WEIGHT.semibold} size={FONT_SIZE.base} color={COLORS.greenDark}>
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

        {/* ── Delivery address ── */}
        {orderData?.address && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLabelRow}>
                <View style={styles.sectionAccent} />
                <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.base} color={COLORS.darkBrown}>
                  Delivery Address
                </MyText>
              </View>
            </View>
            <View style={styles.card}>
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
            </View>
          </>
        )}

        {/* bottom padding so content clears the sticky panel */}
        <View style={styles.scrollPadding} />
      </ScrollView>

      {/* ── Sticky summary panel ── */}
      <View style={styles.stickyPanel}>
        <View style={styles.summaryRow}>
          <MyText size={FONT_SIZE.base} color={COLORS.grey}>Subtotal</MyText>
          <MyText size={FONT_SIZE.base} color={COLORS.grey}>
            {formatMoney(orderData?.subtotal || orderData?.totalAmount || 0)}
          </MyText>
        </View>
        {(orderData?.taxAmount || 0) > 0 && (
          <View style={styles.summaryRow}>
            <MyText size={FONT_SIZE.base} color={COLORS.grey}>Tax</MyText>
            <MyText size={FONT_SIZE.base} color={COLORS.grey}>
              {formatMoney(orderData?.taxAmount || 0)}
            </MyText>
          </View>
        )}
        <View style={styles.summaryRow}>
          <MyText size={FONT_SIZE.base} color={COLORS.grey}>Shipping</MyText>
          <MyText size={FONT_SIZE.base} color={COLORS.grey}>
            {(orderData?.shippingCost || 0) === 0
              ? 'Free'
              : formatMoney(orderData?.shippingCost || 0)}
          </MyText>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.lg} color={COLORS.darkBrown}>
            Total
          </MyText>
          <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.lg} color={COLORS.darkBrown}>
            {formatMoney(orderData?.totalAmount || 0)}
          </MyText>
        </View>
      </View>
    </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(14),
  },
  scrollPadding: {
    height: heightPixel(180),
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
  badge: {
    paddingHorizontal: pixelSizeHorizontal(10),
    paddingVertical: pixelSizeVertical(4),
    borderRadius: BORDER_RADIUS.Circle,
  },
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
  // Timeline
  timelineContainer: {
    paddingHorizontal: pixelSizeHorizontal(20),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(8),
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    width: widthPixel(20),
    marginRight: pixelSizeHorizontal(14),
    alignSelf: 'stretch',
  },
  timelineDot: {
    width: widthPixel(18),
    height: widthPixel(18),
    borderRadius: widthPixel(9),
    backgroundColor: COLORS.lightgrey2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotActive: {
    backgroundColor: COLORS.greenDark,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.lightgrey2,
    marginTop: 2,
  },
  timelineLineActive: {
    backgroundColor: COLORS.greenDark,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: heightPixel(24),
  },
  timelineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: pixelSizeVertical(3),
  },
  timelinePill: {
    paddingHorizontal: pixelSizeHorizontal(8),
    paddingVertical: pixelSizeVertical(2),
    borderRadius: BORDER_RADIUS.Circle,
  },
  timelineCheck: {
    alignSelf: 'center',
    marginTop: 1,
  },
  // Items
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
  // Address
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(14),
  },
  addressIcon: {
    marginTop: pixelSizeVertical(1),
    marginRight: pixelSizeHorizontal(6),
  },
  addressText: {
    flex: 1,
    lineHeight: 18,
  },
  // Sticky bottom panel
  stickyPanel: {
    backgroundColor: COLORS.white,
    paddingHorizontal: pixelSizeHorizontal(20),
    paddingTop: pixelSizeVertical(14),
    paddingBottom: pixelSizeVertical(20),
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgrey2,
    gap: pixelSizeVertical(8),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgrey2,
    paddingTop: pixelSizeVertical(10),
    marginTop: pixelSizeVertical(2),
  },
});
