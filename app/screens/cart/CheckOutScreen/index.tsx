import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {MyText} from '../../../components/MyText';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CartStackParams} from '../../../naviagtion/types';
import HomeSvg from '../../../../assets/svg/icons/HomeAddress.svg';
import PayPalSvg from '../../../../assets/svg/icons/PayPal.svg';
import VisaSvg from '../../../../assets/svg/icons/Visa.svg';
import EditSvg from '../../../../assets/svg/icons/edit.svg';
import {api_getAddress} from '../../../api/user';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {api_orderPlace} from '../../../api/order';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {api_chargePayment, api_getCard} from '../../../api/payment';
import {CardType, CartItemType} from '../../../types';
import {ShippingAddressStackParams} from '../../../naviagtion/DrawerNavigator';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../../utils/sizeNormalization';
import {api_getCart} from '../../../api/cart';
import {GetCartResponse} from '../../../types/apiResponse';

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
    <View
      style={{
        display: 'flex',
        opacity: active ? 1 : 0.5,
        borderWidth: active ? 1.5 : 1.5,
        borderColor: COLORS.greenDark,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
      }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          borderRadius: BORDER_RADIUS.Medium,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: pixelSizeVertical(5),
          width: '88%',
        }}>
        <View
          style={{
            marginHorizontal: pixelSizeHorizontal(8),
            width: widthPixel(40),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {leftIcon}
        </View>
        <View style={{flex: 1, gap: 4, paddingLeft: 5}}>
          <MyText size={FONT_SIZE.base} color={COLORS.grey}>
            {text}
          </MyText>
          <MyText
            numberOfLines={1}
            size={FONT_SIZE.lg}
            bold={textBold ? FONT_WEIGHT.semibold : FONT_WEIGHT.normal}>
            {subText}
          </MyText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToEdit}>
        <View style={{marginHorizontal: 8, marginRight: 18}}>
          <EditSvg />
        </View>
      </TouchableOpacity>
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

const CheckOutScreen = () => {
  const params = useRoute<RouteProp<CartStackParams, 'CheckOut'>>().params;
  console.log(params, 'params');
  const navigation1 =
    useNavigation<NativeStackNavigationProp<ShippingAddressStackParams>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<CartStackParams>>();
  useHideBottomBar({});
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectetCardIndex, setSelectetCardIndex] = useState<number>(0);
  const {token, user: auth} = useSelector((s: RootState) => s.auth);

  const [address, setAddress] = useState<AddressType[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const handlePlaceOrder = async () => {
    if (!address) {
      return;
    }
    const addressId = address[selectedAddressIndex]?._id;
    if (!addressId) {
      return;
    }
    try {
      setLoading2(true);
      // Round values to 2 decimal places to avoid floating point issues
      const orderData = {
        subtotal: Math.round(subtotal * 100) / 100,
        shippingCost: Math.round(shippingTotal * 100) / 100,
        taxAmount: Math.round(taxTotal * 100) / 100,
        totalAmount: Math.round(total * 100) / 100,
      };
      const res = (await api_orderPlace(token!, addressId, orderData)) as any;
      navigation.navigate('OrderSuccess');
    } catch (error: any) {
      ShowAlert({
        textBody: error.message,
        title: 'Alert',
        type: ALERT_TYPE.WARNING,
      });
    } finally {
      setLoading2(false);
    }
  };

  const chargePayment = async () => {
    // Validate cards
    if (!cards.length) {
      ShowAlert({
        title: 'Alert',
        textBody: 'Please Add Card!',
        type: ALERT_TYPE.INFO,
      });
      return;
    }

    // Validate address
    if (!address.length || !address[selectedAddressIndex]) {
      ShowAlert({
        title: 'Alert',
        textBody: 'Please select a shipping address!',
        type: ALERT_TYPE.INFO,
      });
      return;
    }

    // Validate total
    if (!total || total <= 0) {
      ShowAlert({
        title: 'Alert',
        textBody: 'Invalid order total. Please check your cart.',
        type: ALERT_TYPE.WARNING,
      });
      return;
    }

    // Validate cart items
    if (!cartItems.length) {
      ShowAlert({
        title: 'Alert',
        textBody: 'Your cart is empty!',
        type: ALERT_TYPE.INFO,
      });
      return;
    }

    try {
      setLoading(true);
      // Round to 2 decimal places to avoid floating point issues
      const roundedAmount = Math.round(total * 100) / 100;
      
      const payload = {
        email: auth?.email!,
        amount: roundedAmount,
        currency: 'USD',
        source: cards[selectetCardIndex].id,
        description: `Payment for order by ${auth?.fullname || 'Customer'}`,
      };
      
      const res: any = await api_chargePayment(payload, token!);
      ShowAlert({
        textBody: res.message || 'Payment successful!',
        type: ALERT_TYPE.SUCCESS,
      });
      handlePlaceOrder();
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

  const handleGetCart = async () => {
    try {
      const res = (await api_getCart(token!)) as GetCartResponse;
      setCartItems(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const requestApi = () => {
    handleGetAddress();
    handleGetCards();
    handleGetCart();
  };

  useEffect(() => {
    requestApi();
  }, [isFocused]);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item: CartItemType) => {
      if (item.product) {
        const discountedPrice = item.product.discountedProce || 0;
        const originalPrice = item.product.price || 0;
        const effectivePrice =
          discountedPrice > 0 ? discountedPrice : originalPrice;
        return acc + item.quantity * effectivePrice;
      } else {
        return acc;
      }
    }, 0);
  }, [cartItems]);

  // Check if tax applies to the selected address
  const doesTaxApply = useCallback((taxItem: any, userAddress: any) => {
    // If no address, cannot determine tax applicability - return false
    if (!userAddress) return false;

    const userState = (userAddress.state || '').toLowerCase().trim();
    const userCity = (userAddress.city || '').toLowerCase().trim();
    const userZipcode = (userAddress.zipcode || '').trim();
    const taxRegion = (taxItem.region || '').toLowerCase().trim();
    const taxZipCode = (taxItem.zipCode || '').trim();

    if (taxZipCode) {
      if (taxZipCode !== userZipcode) {
        return false;
      }
    }

    if (taxRegion) {
      const normalizedTaxRegion = taxRegion
        .replace(/county|count|state|province/gi, '')
        .trim();
      const normalizedUserState = userState
        .replace(/county|count|state|province/gi, '')
        .trim();
      const normalizedUserCity = userCity
        .replace(/county|count|state|province/gi, '')
        .trim();

      const regionMatchesState =
        normalizedUserState &&
        (normalizedUserState.includes(normalizedTaxRegion) ||
          normalizedTaxRegion.includes(normalizedUserState));
      const regionMatchesCity =
        normalizedUserCity &&
        (normalizedUserCity.includes(normalizedTaxRegion) ||
          normalizedTaxRegion.includes(normalizedUserCity));

      if (!regionMatchesState && !regionMatchesCity) {
        return false;
      }
    }

    return true;
  }, []);

  // Calculate shipping and tax based on selected address
  const {shippingTotal, taxTotal, total} = useMemo(() => {
    try {
      let shipping = 0;
      let tax = 0;
      
      // Use the selected address from fetched addresses, or fallback to user data
      const validIndex =
        address.length > 0 && selectedAddressIndex < address.length
          ? selectedAddressIndex
          : 0;
      const userAddress = address[validIndex] || auth?.data || null;

      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return {
          shippingTotal: 0,
          taxTotal: 0,
          total: subtotal || 0,
        };
      }

      cartItems.forEach(item => {
        try {
          if (!item || !item.product) {
            return; // Skip invalid items
          }

          const product = item.product as any;
          
          // Validate and calculate effective price
          const discountedPrice = parseFloat(product.discountedProce) || 0;
          const originalPrice = parseFloat(product.price) || 0;
          
          // Ensure prices are valid numbers
          if (isNaN(discountedPrice) || discountedPrice < 0) {
            console.warn('Invalid discounted price for product:', product._id);
          }
          if (isNaN(originalPrice) || originalPrice < 0) {
            console.warn('Invalid original price for product:', product._id);
          }
          
          const effectivePrice = discountedPrice > 0 && discountedPrice < originalPrice 
            ? discountedPrice 
            : (originalPrice > 0 ? originalPrice : 0);
          
          // Validate quantity
          const quantity = typeof item.quantity === 'number' 
            ? item.quantity 
            : parseInt(String(item.quantity)) || 0;
          if (quantity <= 0 || isNaN(quantity) || !isFinite(quantity)) {
            console.warn('Invalid quantity for product:', product._id);
            return; // Skip items with invalid quantity
          }
          
          const itemSubtotal = quantity * effectivePrice;
          
          // Validate itemSubtotal
          if (isNaN(itemSubtotal) || !isFinite(itemSubtotal)) {
            console.warn('Invalid itemSubtotal for product:', product._id);
            return;
          }

          // Calculate shipping with error handling
          if (product.shippingCost !== undefined && product.shippingCost !== null) {
            try {
              const shippingCost = parseFloat(product.shippingCost);
              
              if (!isNaN(shippingCost) && isFinite(shippingCost) && shippingCost >= 0) {
                const freeShippingAbove = parseFloat(product.freeShippingAbove) || 0;
                
                // Check if free shipping applies
                if (freeShippingAbove > 0 && subtotal >= freeShippingAbove) {
                  // Free shipping applies - don't add shipping cost
                } else {
                  // Shipping cost is typically per product, not per unit
                  shipping += shippingCost;
                }
              } else {
                console.warn('Invalid shipping cost for product:', product._id, shippingCost);
              }
            } catch (shippingError) {
              console.error('Error calculating shipping for product:', product._id, shippingError);
            }
          }

          // Calculate tax with error handling
          if (product.tax) {
            try {
              if (Array.isArray(product.tax) && product.tax.length > 0) {
                product.tax.forEach((taxItem: any) => {
                  try {
                    if (!taxItem || typeof taxItem !== 'object') {
                      return; // Skip invalid tax items
                    }

                    const applies = doesTaxApply(taxItem, userAddress);
                    const taxRate = parseFloat(taxItem.rate);
                    
                    // Validate tax rate (should be between 0 and 1 for percentage, or reasonable range)
                    if (applies && !isNaN(taxRate) && isFinite(taxRate) && taxRate > 0 && taxRate <= 1) {
                      const calculatedTax = itemSubtotal * taxRate;
                      
                      // Validate calculated tax
                      if (!isNaN(calculatedTax) && isFinite(calculatedTax) && calculatedTax >= 0) {
                        tax += calculatedTax;
                      } else {
                        console.warn('Invalid calculated tax for product:', product._id, calculatedTax);
                      }
                    } else if (applies && taxRate > 1) {
                      // Tax rate might be in percentage format (e.g., 8.5 for 8.5%)
                      const taxRatePercent = taxRate / 100;
                      if (taxRatePercent > 0 && taxRatePercent <= 1) {
                        const calculatedTax = itemSubtotal * taxRatePercent;
                        if (!isNaN(calculatedTax) && isFinite(calculatedTax) && calculatedTax >= 0) {
                          tax += calculatedTax;
                        }
                      } else {
                        console.warn('Invalid tax rate format for product:', product._id, taxRate);
                      }
                    }
                  } catch (taxItemError) {
                    console.error('Error processing tax item for product:', product._id, taxItemError);
                  }
                });
              }
            } catch (taxError) {
              console.error('Error calculating tax for product:', product._id, taxError);
            }
          }
        } catch (itemError) {
          console.error('Error processing cart item:', item?._id, itemError);
        }
      });

      // Validate final values
      if (isNaN(shipping) || !isFinite(shipping)) {
        console.warn('Invalid shipping total, resetting to 0');
        shipping = 0;
      }
      if (shipping < 0) {
        console.warn('Negative shipping total, resetting to 0');
        shipping = 0;
      }

      if (isNaN(tax) || !isFinite(tax)) {
        console.warn('Invalid tax total, resetting to 0');
        tax = 0;
      }
      if (tax < 0) {
        console.warn('Negative tax total, resetting to 0');
        tax = 0;
      }

      const final = (subtotal || 0) + tax + shipping;
      
      // Validate final total
      if (isNaN(final) || !isFinite(final) || final < 0) {
        console.error('Invalid final total calculated:', final);
        return {
          shippingTotal: 0,
          taxTotal: 0,
          total: subtotal || 0,
        };
      }

      return {
        shippingTotal: Math.round(shipping * 100) / 100, // Round to 2 decimal places
        taxTotal: Math.round(tax * 100) / 100,
        total: Math.round(final * 100) / 100,
      };
    } catch (error) {
      console.error('Error calculating shipping and tax:', error);
      // Return safe defaults on error
      return {
        shippingTotal: 0,
        taxTotal: 0,
        total: subtotal || 0,
      };
    }
  }, [cartItems, subtotal, address, selectedAddressIndex, auth, doesTaxApply]);
  if (loading || cardLoading || loading2) {
    return <FullScreenLoader />;
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}>
        <SafeAreaView />
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{left: 0}}
          title="Check out"
        />
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            Shipping to
          </MyText>

          <Pressable
            onPress={() => navigation.navigate('AddAddress')}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: COLORS.darkBrown,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MyText size={FONT_SIZE.sm} color={COLORS.white}>
              Add
            </MyText>
          </Pressable>
        </View>
        <View style={{gap: 20, marginVertical: 20}}>
          {loading ? <MyText>Loading...</MyText> : null}
          {address?.map((item, index) => {
            return (
              <OptionBox
                key={item._id}
                text={item?.title ? item.title : 'Home'}
                subText={`${item.address}, ${item.city}, ${item.state}, ${item.country}`}
                active={selectedAddressIndex === index}
                onPress={() => {
                  setSelectedAddressIndex(index);
                }}
                goToEdit={() =>
                  navigation1.navigate('EditAddress', {
                    raw: item,
                    addressId: item?._id,
                  })
                }
                textBold
                leftIcon={<HomeSvg />}
              />
            );
          })}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            Payment Method
          </MyText>

          <Pressable
            onPress={() => navigation.navigate('AddCard')}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: COLORS.darkBrown,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MyText size={FONT_SIZE.sm} color={COLORS.white}>
              Add
            </MyText>
          </Pressable>
        </View>
        <View style={{gap: 20, marginVertical: 20}}>
          {cards?.map((item, index) => {
            return (
              <OptionBox
                key={item.id}
                text={`**** **** **** ${item.last4}`}
                subText={item.name}
                onPress={() => {
                  setSelectetCardIndex(index);
                }}
                active={selectetCardIndex === index}
                leftIcon={<VisaSvg />}
              />
            );
          })}
        </View>
      </ScrollView>

      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 20,
          paddingVertical: 30,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <MyText color={COLORS.grey}>Sub total</MyText>
          <MyText color={COLORS.grey}>${subtotal.toFixed(2)}</MyText>
        </View>
        {taxTotal > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <MyText color={COLORS.grey}>Tax</MyText>
            <MyText color={COLORS.grey}>${taxTotal.toFixed(2)}</MyText>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <MyText color={COLORS.grey}>Shipping fee</MyText>
          <MyText color={COLORS.grey}>${shippingTotal.toFixed(2)}</MyText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <MyText size={FONT_SIZE['xl']} bold={FONT_WEIGHT.bold}>
            Total
          </MyText>
          <MyText size={FONT_SIZE['xl']}>${total.toFixed(2)}</MyText>
        </View>
        <PrimaryBtn
          loading={loading2}
          onPress={chargePayment}
          text="Place Order"
        />
      </View>
    </View>
  );
};

export default CheckOutScreen;
