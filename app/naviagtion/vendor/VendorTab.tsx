import {Image, Platform, StyleSheet, View} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import {COLORS, FONT_SIZE, hp, wp} from '../../styles';
import {MyText} from '../../components/MyText';

// ICONS
import BgImg from '../../../assets/svg/tab/VendorBg.png';
import HomeSvg from '../../../assets/svg/tab/icons/Home.svg';
import HomeFillSvg from '../../../assets/svg/tab/icons/HomeFill.svg';
import CartSvg from '../../../assets/svg/tab/icons/Cart.svg';
import CartFillSvg from '../../../assets/svg/tab/icons/CartFill.svg';
import AwarenessSvg from '../../../assets/svg/tab/icons/Awareness.svg';
import AwarenessFillSvg from '../../../assets/svg/tab/icons/AwarenessFill.svg';
import FeedSvg from '../../../assets/svg/tab/icons/Feed.svg';
import FeedFillSvg from '../../../assets/svg/tab/icons/FeedFill.svg';
import ProductSvg from '../../../assets/svg/tab/icons/Product.svg';
import ProductFillSvg from '../../../assets/svg/tab/icons/ProductFill.svg';

// Screens x Stacks
import FeedStack from './../FeedStack';
import AwarenessStack from './../AwarenessStack';
import VendorHomeStack from './VendorHomeStack';
import AllProductStack from './AllProductStack';
import AllOrderStack from './AllOrderStack';

const TAB_ICON_SIZE = FONT_SIZE['2xl'];

const Tab = createBottomTabNavigator();

const TAB_BAR_BG_HEIGHT = hp(13);
function VendorTab() {
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        tabBar={props => (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
            }}>
            <BottomTabBar {...props} />
          </View>
        )}
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
          tabBarStyle: styles.tabBarStyle,

          tabBarBackground() {
            // return null;
            return (
              <Image
                source={BgImg}
                style={{
                  width: wp('100%'),
                  height: TAB_BAR_BG_HEIGHT,
                  position: 'absolute',
                  bottom: 0,
                  resizeMode: 'stretch',
                  zIndex: 10,
                }}
              />
            );
          },
        }}>
        <Tab.Screen
          name="HomeTab"
          component={VendorHomeStack}
          options={{
            tabBarLabel: '',
            unmountOnBlur: true,
            tabBarIcon: ({focused}) => {
              const color = focused ? COLORS.white : COLORS.grey;
              return (
                <View style={styles.tabItemContainer}>
                  {focused ? (
                    <HomeFillSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  ) : (
                    <HomeSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  )}
                  <MyText color={color} size={FONT_SIZE.xs}>
                    Home
                  </MyText>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="AllProductTab"
          component={AllProductStack}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused}) => {
              const color = focused ? COLORS.white : COLORS.grey;

              return (
                <View style={styles.tabItemContainer}>
                  {focused ? (
                    <ProductFillSvg
                      width={TAB_ICON_SIZE}
                      height={TAB_ICON_SIZE}
                    />
                  ) : (
                    <ProductSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  )}
                  <MyText color={color} size={FONT_SIZE.xs}>
                    All Product
                  </MyText>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="AllOrderTab"
          component={AllOrderStack}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused}) => {
              const color = focused ? COLORS.white : COLORS.grey;

              return (
                <View style={styles.tabItemContainer}>
                  {focused ? (
                    <CartFillSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  ) : (
                    <CartSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  )}
                  <MyText color={color} size={FONT_SIZE.xs}>
                    All Orders
                  </MyText>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="AwarenessTab"
          component={AwarenessStack}
          options={{
            unmountOnBlur: true,
            tabBarLabel: '',
            tabBarIcon: ({focused}) => {
              const color = focused ? COLORS.white : COLORS.grey;
              return (
                <View style={styles.tabItemContainer}>
                  {focused ? (
                    <AwarenessFillSvg
                      width={TAB_ICON_SIZE}
                      height={TAB_ICON_SIZE}
                    />
                  ) : (
                    <AwarenessSvg
                      width={TAB_ICON_SIZE}
                      height={TAB_ICON_SIZE}
                    />
                  )}

                  <MyText color={color} size={FONT_SIZE.xs}>
                    Awareness
                  </MyText>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="FeedTab"
          component={FeedStack}
          options={{
            unmountOnBlur: true,
            tabBarLabel: '',
            tabBarIcon: ({focused}) => {
              const color = focused ? COLORS.white : COLORS.grey;
              return (
                <View style={styles.tabItemContainer}>
                  {focused ? (
                    <FeedFillSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  ) : (
                    <FeedSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  )}

                  <MyText color={color} size={FONT_SIZE.xs}>
                    Feeds
                  </MyText>
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
export default VendorTab;

const styles = StyleSheet.create({
  tabBarStyle: {
    display: 'flex',
    width: wp('100%'),
    backgroundColor: COLORS.red,
    borderWidth: 0,
    shadowOpacity: 0,
    padding: 0,
    elevation: 0,
  },
  tabItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

export {styles};
