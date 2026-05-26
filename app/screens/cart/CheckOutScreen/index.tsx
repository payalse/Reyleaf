import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {MyText} from '../../../components/MyText';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CartStackParams} from '../../../naviagtion/types';
import HomeSvg from '../../../../assets/svg/icons/HomeAddress.svg';
import VisaSvg from '../../../../assets/svg/icons/Visa.svg';
import EditSvg from '../../../../assets/svg/icons/edit.svg';
import {api_getAddress} from '../../../api/user';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {api_chargePayment, api_getCard} from '../../../api/payment';
import {api_checkoutPreview} from '../../../api/order';
import {CardType} from '../../../types';
import {ShippingAddressStackParams} from '../../../naviagtion/DrawerNavigator';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../../utils/sizeNormalization';
import {formatMoney} from '../../../utils/currency';
import {SheetManager} from 'react-native-actions-sheet';
import {SHEETS} from '../../../sheets/sheets';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const OptionBox = ({
  active,
  leftIcon,
  onPress,
  goToEdit,
  text,
  subText,
  textBold,
}: {
  active?: boolean;
  leftIcon: React.ReactNode;
  onPress?: () => void;
  goToEdit?: () => void;
  text: string;
  subText: string;
  textBold?: boolean;
}) => {
  return (
    <View style={[styles.optionBox, active && styles.optionBoxActive]}>
      <TouchableOpacity onPress={onPress} style={styles.optionBoxInner}>
        <View style={styles.optionIconWrap}>{leftIcon}</View>
        <View style={styles.optionTextWrap}>
          <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            {text}
          </MyText>
          <MyText
            numberOfLines={1}
            size={FONT_SIZE.base}
            bold={textBold ? FONT_WEIGHT.semibold : FONT_WEIGHT.normal}>
            {subText}
          </MyText>
        </View>
      </TouchableOpacity>
      {goToEdit && (
        <TouchableOpacity onPress={goToEdit} style={styles.editBtn}>
          <EditSvg />
        </TouchableOpacity>
      )}
    </View>
  );
};

type AddressType = {
  address: string;
  city: string;
  country: string;
  state: string;
  updated_at: string;
  zipcode: string;
  title: string;
  _id: string;
};

type PreviewData = {
  subtotal: number;
  shippingCost: number;
  shippingMethod: string;
  taxAmount: number;
  appFee: number;
  totalAmount: number;
  currency: string;
};

const CheckOutScreen = () => {
  const navigation1 =
    useNavigation<NativeStackNavigationProp<ShippingAddressStackParams>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<CartStackParams>>();
  useHideBottomBar({});
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectetCardIndex, setSelectetCardIndex] = useState<number>(0);
  const {token, user: auth} = useSelector((s: RootState) => s.auth);

  const [address, setAddress] = useState<AddressType[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [previewUnavailable, setPreviewUnavailable] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [showFeeInfo, setShowFeeInfo] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<{
    value: string;
    label: string;
  }>({value: 'standard', label: 'Standard Delivery'});

  const fetchPreview = async (addressId: string, method: string) => {
    setPreviewLoading(true);
    setPreviewUnavailable(false);
    try {
      const res: any = await api_checkoutPreview(token!, addressId, method);
      setPreviewData(res.data);
    } catch (error: any) {
      const msg: string = (error?.message || '').toLowerCase();
      if (msg.includes('cart is empty')) {
        ShowAlert({title: 'Cart', textBody: 'Your cart is empty', type: ALERT_TYPE.INFO});
        setPreviewData(null);
      } else if (msg.includes('address not found')) {
        ShowAlert({title: 'Address', textBody: 'Address not found', type: ALERT_TYPE.WARNING});
        setPreviewData(null);
      } else {
        setPreviewUnavailable(true);
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  const chargePayment = async () => {
    if (!cards.length) {
      ShowAlert({title: 'Alert', textBody: 'Please Add Card!', type: ALERT_TYPE.INFO});
      return;
    }
    if (!address.length || !address[selectedAddressIndex]) {
      ShowAlert({title: 'Alert', textBody: 'Please select a shipping address!', type: ALERT_TYPE.INFO});
      return;
    }
    if (!previewData) {
      ShowAlert({title: 'Alert', textBody: 'Loading order total, please wait...', type: ALERT_TYPE.INFO});
      return;
    }

    try {
      setLoading(true);

      await api_chargePayment(
        {
          email: auth?.email!,
          currency: previewData.currency,
          source: cards[selectetCardIndex].id,
          description: `Payment for order by ${auth?.fullname || 'Customer'}`,
          addressId: address[selectedAddressIndex]._id,
          shippingMethod: shippingMethod.value,
        },
        token!,
      );

      navigation.reset({
        index: 1,
        routes: [{name: 'Cart'}, {name: 'OrderStack'}],
      });
    } catch (error: any) {
      ShowAlert({
        textBody: error.message || 'Payment failed. Please try again.',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetAddress = async () => {
    try {
      setLoading(true);
      const res = (await api_getAddress(token!)) as {data: AddressType[]};
      setAddress(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCards = async () => {
    try {
      setCardLoading(true);
      const res: any = await api_getCard(auth?.stripeCustomerId!, token!);
      setCards(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setCardLoading(false);
    }
  };

  useEffect(() => {
    handleGetAddress();
    handleGetCards();
  }, [isFocused]);

  useEffect(() => {
    if (address.length > 0 && address[selectedAddressIndex]) {
      fetchPreview(address[selectedAddressIndex]._id, shippingMethod.value);
    }
  }, [selectedAddressIndex, address, shippingMethod.value]);

  const toggleSummary = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSummaryExpanded(prev => !prev);
  };

  const currency = previewData?.currency || 'USD';
  const fmt = (n: number) => formatMoney(n, currency);

  if (loading || cardLoading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <SafeAreaView />
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{left: 0}}
          title="Checkout"
        />

        {/* Shipping Address */}
        <View style={styles.sectionHeader}>
          <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.bold}>
            Shipping to
          </MyText>
          <Pressable
            onPress={() => navigation.navigate('AddAddress')}
            style={styles.addBtn}>
            <MyText size={FONT_SIZE.sm} color={COLORS.white}>
              + Add
            </MyText>
          </Pressable>
        </View>
        <View style={styles.optionList}>
          {address?.map((item, index) => (
            <OptionBox
              key={item._id}
              text={item?.title || 'Home'}
              subText={`${item.address}, ${item.city}, ${item.state}, ${item.country}`}
              active={selectedAddressIndex === index}
              onPress={() => setSelectedAddressIndex(index)}
              goToEdit={() =>
                navigation1.navigate('EditAddress', {
                  raw: item,
                  addressId: item?._id,
                })
              }
              textBold
              leftIcon={<HomeSvg />}
            />
          ))}
        </View>

        {/* Shipping Method */}
        <MyText style={styles.sectionTitle} size={FONT_SIZE.lg} bold={FONT_WEIGHT.bold}>
          Shipping Method
        </MyText>
        <TouchableOpacity
          onPress={() => {
            SheetManager.show(SHEETS.ShippingMethodSelectSheet, {
              // @ts-ignore
              payload: {
                onSelect: (data: {value: string; label: string}) => {
                  setShippingMethod(data);
                },
              },
            });
          }}
          style={styles.shippingMethodBox}>
          <MyText size={FONT_SIZE.base}>{shippingMethod.label}</MyText>
          <MyText size={FONT_SIZE.sm} color={COLORS.greenDark}>
            Change
          </MyText>
        </TouchableOpacity>

        {/* Payment Method */}
        <View style={styles.sectionHeader}>
          <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.bold}>
            Payment Method
          </MyText>
          <Pressable
            onPress={() => navigation.navigate('AddCard')}
            style={styles.addBtn}>
            <MyText size={FONT_SIZE.sm} color={COLORS.white}>
              + Add
            </MyText>
          </Pressable>
        </View>
        <View style={styles.optionList}>
          {cards?.map((item, index) => (
            <OptionBox
              key={item.id}
              text={`**** **** **** ${item.last4}`}
              subText={item.name}
              onPress={() => setSelectetCardIndex(index)}
              active={selectetCardIndex === index}
              leftIcon={<VisaSvg />}
            />
          ))}
        </View>
      </ScrollView>

      {/* Unavailable banner */}
      {previewUnavailable && (
        <View style={styles.unavailableBanner}>
          <MyText color={COLORS.red} size={FONT_SIZE.sm} center>
            Checkout is temporarily unavailable. Please try again in a few minutes.
          </MyText>
        </View>
      )}

      {/* Order Summary */}
      <View style={styles.summary}>
        <TouchableOpacity onPress={toggleSummary} style={styles.handleRow}>
          <View style={styles.handleBar} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSummary} style={styles.summaryTitleRow}>
          <MyText size={FONT_SIZE.lg} bold={FONT_WEIGHT.bold}>
            Order Summary
          </MyText>
          <MyText color={COLORS.grey} size={FONT_SIZE.sm}>
            {summaryExpanded ? '▲' : '▼'}
          </MyText>
        </TouchableOpacity>

        {summaryExpanded && previewData && (
          <>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <MyText color={COLORS.grey} size={FONT_SIZE.base}>Subtotal</MyText>
              <MyText color={COLORS.grey} size={FONT_SIZE.base}>
                {fmt(previewData.subtotal)}
              </MyText>
            </View>
            <View style={styles.summaryRow}>
              <MyText color={COLORS.grey} size={FONT_SIZE.base}>Shipping fee</MyText>
              <MyText color={COLORS.grey} size={FONT_SIZE.base}>
                {previewData.shippingCost === 0 ? 'Free' : fmt(previewData.shippingCost)}
              </MyText>
            </View>
            {previewData.taxAmount > 0 && (
              <View style={styles.summaryRow}>
                <MyText color={COLORS.grey} size={FONT_SIZE.base}>Tax</MyText>
                <MyText color={COLORS.grey} size={FONT_SIZE.base}>
                  {fmt(previewData.taxAmount)}
                </MyText>
              </View>
            )}
            {previewData.appFee > 0 && (
              <>
                <View style={styles.summaryRow}>
                  <TouchableOpacity
                    onPress={() => setShowFeeInfo(prev => !prev)}
                    style={styles.feeInfoTrigger}>
                    <MyText color={COLORS.grey} size={FONT_SIZE.base}>
                      Service fee
                    </MyText>
                    <AntDesign
                      name="infocirlceo"
                      size={13}
                      color={COLORS.greenDark}
                      style={{marginLeft: 5}}
                    />
                  </TouchableOpacity>
                  <MyText color={COLORS.grey} size={FONT_SIZE.base}>
                    {fmt(previewData.appFee)}
                  </MyText>
                </View>
                {showFeeInfo && (
                  <View style={styles.feeInfoCard}>
                    <View style={styles.feeInfoRow}>
                      <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                        App fee
                      </MyText>
                      <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                        {fmt(previewData.appFee)}
                      </MyText>
                    </View>
                    <View style={styles.feeInfoRow}>
                      <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                        Packing & handling
                      </MyText>
                      <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                        Included
                      </MyText>
                    </View>
                  </View>
                )}
              </>
            )}
          </>
        )}

        <View style={styles.totalRow}>
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            Total
          </MyText>
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            {previewData ? fmt(previewData.totalAmount) : '—'}
          </MyText>
        </View>
        <PrimaryBtn
          loading={loading}
          disabled={previewLoading || !previewData || loading || previewUnavailable}
          onPress={chargePayment}
          text={previewLoading ? 'Loading...' : 'Place Order'}
        />
      </View>
    </View>
  );
};

export default CheckOutScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: pixelSizeHorizontal(20),
    paddingBottom: pixelSizeVertical(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(10),
  },
  sectionTitle: {
    marginTop: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(10),
  },
  addBtn: {
    paddingVertical: pixelSizeVertical(7),
    paddingHorizontal: pixelSizeHorizontal(18),
    backgroundColor: COLORS.greenDark,
    borderRadius: BORDER_RADIUS.Circle,
  },
  optionList: {
    gap: 10,
  },
  optionBox: {
    borderWidth: 1.5,
    borderColor: COLORS.lightgrey2,
    borderRadius: BORDER_RADIUS.Large,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  optionBoxActive: {
    borderColor: COLORS.greenDark,
  },
  optionBoxInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pixelSizeVertical(12),
    paddingHorizontal: pixelSizeHorizontal(14),
  },
  optionIconWrap: {
    width: widthPixel(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: pixelSizeHorizontal(12),
  },
  optionTextWrap: {
    flex: 1,
    gap: 3,
  },
  editBtn: {
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(12),
  },
  shippingMethodBox: {
    borderWidth: 1.5,
    borderColor: COLORS.lightgrey2,
    borderRadius: BORDER_RADIUS.Large,
    paddingVertical: pixelSizeVertical(14),
    paddingHorizontal: pixelSizeHorizontal(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  unavailableBanner: {
    backgroundColor: '#FFF5F5',
    borderTopWidth: 1,
    borderTopColor: COLORS.red,
    paddingHorizontal: pixelSizeHorizontal(20),
    paddingVertical: pixelSizeVertical(10),
  },
  summary: {
    backgroundColor: COLORS.white,
    paddingHorizontal: pixelSizeHorizontal(20),
    paddingBottom: pixelSizeVertical(28),
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgrey2,
  },
  handleRow: {
    alignItems: 'center',
    paddingVertical: pixelSizeVertical(10),
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.lightgrey2,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelSizeVertical(6),
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.lightgrey2,
    marginBottom: pixelSizeVertical(10),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelSizeVertical(8),
  },
  feeInfoTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeInfoCard: {
    backgroundColor: COLORS.lightgrey2,
    borderRadius: BORDER_RADIUS.Medium,
    padding: pixelSizeVertical(10),
    marginBottom: pixelSizeVertical(8),
    gap: 6,
  },
  feeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: pixelSizeVertical(10),
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgrey2,
    marginTop: pixelSizeVertical(4),
    marginBottom: pixelSizeVertical(12),
  },
});
