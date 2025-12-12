import {useCallback, useEffect, useMemo, useState} from 'react';
import MainHeader from '../../components/header/MainHeader';
import {FlatList, SafeAreaView, View} from 'react-native';
import CartItem from './components/CartItem';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CartStackParams} from '../../naviagtion/types';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {api_getCart} from '../../api/cart';
import {CartItemType} from '../../types';
import {GetCartResponse} from '../../types/apiResponse';
import {api_getAddress} from '../../api/user';
import FullScreenLoader from '../../components/FullScreenLoader';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../../utils/sizeNormalization';

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

const CartScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CartStackParams>>();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const {token, user} = useSelector((s: RootState) => s.auth);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = (await api_getCart(token!)) as GetCartResponse;
      setCartItems(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAddress = useCallback(async () => {
    try {
      const res = (await api_getAddress(token!)) as { data: AddressType[] };
      setAddresses(res.data || []);
    } catch (error) {
      console.log(error);
      setAddresses([]);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
    handleGetAddress();
  }, [handleGetAddress]);

  // Refresh address when screen comes into focus (e.g., after adding/editing address)
  useEffect(() => {
    if (isFocused) {
      handleGetAddress();
    }
  }, [isFocused, handleGetAddress]);

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

  const doesTaxApply = (taxItem: any, userAddress: any) => {
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
  };

  const {shippingTotal, taxTotal, total} = useMemo(() => {
    try {
      let shipping = 0;
      let tax = 0;
      
      // Use the selected address from fetched addresses, or fallback to user data
      // Ensure selectedAddressIndex is valid, otherwise use first address or fallback
      const validIndex = 
        addresses.length > 0 && selectedAddressIndex < addresses.length
          ? selectedAddressIndex
          : 0;
      const userAddress = addresses[validIndex] || user?.data || null;
      
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
  }, [cartItems, subtotal, addresses, selectedAddressIndex, user]);

  const renderFooter = useCallback(() => {
    if (!cartItems.length) return null;
    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingHorizontal: 20,
          marginTop: 30,
          paddingBottom: 150,
        }}>
        <View
          style={{
            gap: 8,
            marginVertical: 30,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              Sub Total
            </MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              ${subtotal.toFixed(2)}
            </MyText>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              Tax
            </MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              ${taxTotal.toFixed(2)}
            </MyText>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              Shipping Fee
            </MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
              ${shippingTotal.toFixed(2)}
            </MyText>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MyText
              size={FONT_SIZE.lg}
              color={COLORS.black}
              bold={FONT_WEIGHT.bold}>
              Total
            </MyText>
            <MyText
              size={FONT_SIZE.lg}
              color={COLORS.black}
              bold={FONT_WEIGHT.bold}>
              ${total.toFixed(2)}
            </MyText>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <PrimaryBtn
              onPress={() =>
                navigation.navigate('CheckOut', {
                  total: total,
                  subtotal: subtotal,
                  shippingTotal: shippingTotal,
                  taxTotal: taxTotal,
                })
              }
              text="Check Out"
              conatinerStyle={{width: '90%', alignSelf: 'center'}}
            />
          </View>
        </View>
      </View>
    );
  }, [cartItems, subtotal, shippingTotal, taxTotal, total, navigation]);

  return (
    <FlatList
      ListHeaderComponent={() => {
        return (
          <View
            style={{
              marginBottom: pixelSizeVertical(20),
              marginHorizontal: pixelSizeHorizontal(20),
            }}>
            <SafeAreaView />
            <MainHeader
              onMessagePress={() => navigation.navigate('ChatStack')}
              onNotiPress={() => navigation.navigate('AppNotification')}
            />
            <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
              My Cart
            </MyText>
          </View>
        );
      }}
      ListEmptyComponent={() => {
        return (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {loading ? <FullScreenLoader /> : <MyText>Cart is Empty</MyText>}
          </View>
        );
      }}
      data={cartItems}
      renderItem={({item}) => {
        if (item.product) {
          return (
            <View style={{marginHorizontal: 20}}>
              <CartItem
                id={item._id}
                qty={item.quantity}
                product={item.product}
                setCartItems={setCartItems}
              />
            </View>
          );
        } else {
          return null;
        }
      }}
      ListFooterComponent={renderFooter}
    />
  );
};

export default CartScreen;
