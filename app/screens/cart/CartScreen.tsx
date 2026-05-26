import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import CartItem from './components/CartItem';
import {MyText} from '../../components/MyText';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CartStackParams} from '../../naviagtion/types';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {api_getCart} from '../../api/cart';
import {CartItemType} from '../../types';
import {GetCartResponse} from '../../types/apiResponse';
import FullScreenLoader from '../../components/FullScreenLoader';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../../utils/sizeNormalization';
import {formatMoney} from '../../utils/currency';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CartScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CartStackParams>>();
  useHideBottomBar({});
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [footerExpanded, setFooterExpanded] = useState(true);
  const [footerHeight, setFooterHeight] = useState(0);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = (await api_getCart(token!)) as GetCartResponse;
      setCartItems(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (isFocused) {
      fetchCart();
    }
  }, [isFocused, fetchCart]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item: CartItemType) => {
      if (item.product) {
        const discountedPrice = item.product.discountedProce || 0;
        const originalPrice = item.product.price || 0;
        const effectivePrice =
          discountedPrice > 0 ? discountedPrice : originalPrice;
        return acc + item.quantity * effectivePrice;
      }
      return acc;
    }, 0);
  }, [cartItems]);

  const toggleFooter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFooterExpanded(prev => !prev);
  };

  return (
    <View style={styles.root}>
      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: footerHeight + pixelSizeVertical(16),
        }}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <SafeAreaView />
            <SecondaryHeader
              onBack={navigation.goBack}
              title="My Cart"
              RightComp={
                cartItems.length > 0
                  ? () => (
                      <View style={styles.badge}>
                        <MyText
                          size={FONT_SIZE.sm}
                          color={COLORS.white}
                          bold={FONT_WEIGHT.semibold}>
                          {cartItems.length}
                        </MyText>
                      </View>
                    )
                  : undefined
              }
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            {loading ? (
              <FullScreenLoader />
            ) : (
              <>
                <MyText
                  size={FONT_SIZE.xl}
                  bold={FONT_WEIGHT.semibold}
                  color={COLORS.grey}>
                  Your cart is empty
                </MyText>
                <MyText
                  size={FONT_SIZE.base}
                  color={COLORS.grey}
                  style={styles.emptySubtext}>
                  Add items to get started
                </MyText>
              </>
            )}
          </View>
        )}
        data={cartItems}
        renderItem={({item}) => {
          if (item.product) {
            return (
              <View style={styles.itemWrapper}>
                <CartItem
                  id={item._id}
                  qty={item.quantity}
                  product={item.product}
                  setCartItems={setCartItems}
                />
              </View>
            );
          }
          return null;
        }}
      />

      {cartItems.length > 0 && (
        <View
          onLayout={e => setFooterHeight(e.nativeEvent.layout.height)}
          style={styles.stickyFooter}>
          <TouchableOpacity onPress={toggleFooter} style={styles.handleRow}>
            <View style={styles.handleBar} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleFooter}
            style={styles.footerTitleRow}>
            <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.semibold}>
              Order Summary
            </MyText>
            <MyText color={COLORS.grey} size={FONT_SIZE.sm}>
              {footerExpanded ? '▲' : '▼'}
            </MyText>
          </TouchableOpacity>
          {footerExpanded && (
            <>
              <View style={styles.summaryRow}>
                <MyText size={FONT_SIZE.base} color={COLORS.grey}>
                  Subtotal
                </MyText>
                <MyText size={FONT_SIZE.base} color={COLORS.grey}>
                  {formatMoney(subtotal)}
                </MyText>
              </View>
              <View style={styles.summaryRow}>
                <MyText size={FONT_SIZE.base} color={COLORS.grey}>
                  Shipping & taxes
                </MyText>
                <MyText size={FONT_SIZE.base} color={COLORS.grey}>
                  Calculated at checkout
                </MyText>
              </View>
            </>
          )}
          <View style={styles.divider} />
          <PrimaryBtn
            onPress={() => navigation.navigate('CheckOut')}
            text="Proceed to Checkout"
          />
        </View>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  list: {
    flex: 1,
  },
  header: {
    marginBottom: pixelSizeVertical(8),
  },
  badge: {
    backgroundColor: COLORS.greenDark,
    borderRadius: BORDER_RADIUS.Circle,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrapper: {
    marginBottom: pixelSizeVertical(8),
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: pixelSizeVertical(80),
  },
  emptySubtext: {
    marginTop: pixelSizeVertical(6),
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.Large,
    borderTopRightRadius: BORDER_RADIUS.Large,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgrey2,
    paddingHorizontal: pixelSizeHorizontal(20),
    paddingBottom: pixelSizeVertical(24),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 10,
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
  footerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelSizeVertical(10),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelSizeVertical(6),
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightgrey2,
    marginVertical: pixelSizeVertical(10),
  },
});
