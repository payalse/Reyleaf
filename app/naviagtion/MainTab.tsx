import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import {COLORS, FONT_SIZE, hp, wp} from '../styles';
import {MyText} from '../components/MyText';
// ICONS
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BgImg from '../../assets/svg/tab/Bg.png';
import HomeSvg from '../../assets/svg/tab/icons/Home.svg';
import HomeFillSvg from '../../assets/svg/tab/icons/HomeFill.svg';
import CartSvg from '../../assets/svg/tab/icons/Cart.svg';
import CartFillSvg from '../../assets/svg/tab/icons/CartFill.svg';
import EventSvg from '../../assets/svg/tab/icons/Event.svg';
import EventFillSvg from '../../assets/svg/tab/icons/EventFill.svg';
import AwarenessSvg from '../../assets/svg/tab/icons/Awareness.svg';
import AwarenessFillSvg from '../../assets/svg/tab/icons/AwarenessFill.svg';
import FeedSvg from '../../assets/svg/tab/icons/Feed.svg';
import FeedFillSvg from '../../assets/svg/tab/icons/FeedFill.svg';

// Screens x Stacks
import HomeStack from './HomeStack';
import FeedStack from './FeedStack';
import CartStack from './CartStack';
import EventStack from './EventStack';
import AwarenessStack from './AwarenessStack';
import SearchStack from './SearchStack';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SearchStackParams} from './types';

const TAB_ICON_SIZE = FONT_SIZE['2xl'];

const isAndroid = Platform.OS === 'android';
const Tab = createBottomTabNavigator();

const ACTION_SIZE = wp(14);
export const TAB_BAR_BG_HEIGHT = hp(17.5);
function MainTab() {
  const [value, setValue] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<SearchStackParams>>();
  const handleTabPress = (focused: any) => {
    if (focused) {
      navigation.goBack();
    } else {
      navigation.navigate('SearchStack');
    }
  };
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        id="MainTab"
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
          headerTransparent: true,
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
                  top: 0,
                  zIndex: 10,
                  backgroundColor: COLORS.transparent,
                }}
              />
            );
          },
        }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
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
          name="CartTab"
          component={CartStack}
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
                    Cart
                  </MyText>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="EventTab"
          component={EventStack}
          options={{
            unmountOnBlur: true,
            tabBarLabel: '',
            tabBarIcon: ({focused}) => {
              const color = focused ? COLORS.white : COLORS.grey;
              return (
                <View style={styles.tabItemContainer}>
                  {focused ? (
                    <EventFillSvg
                      width={TAB_ICON_SIZE}
                      height={TAB_ICON_SIZE}
                    />
                  ) : (
                    <EventSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  )}
                  <MyText color={color} size={FONT_SIZE.xs}>
                    Event
                  </MyText>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStack} // Set the default stack
          options={{
            unmountOnBlur: true,
            tabBarItemStyle: {
              position: 'absolute',
              zIndex: 10,
              left: '50%',
              top: hp(4.5),
            },
            tabBarLabel: '',
            tabBarIcon: ({focused}) => {
              return (
                <TouchableOpacity
                  onPress={() => handleTabPress(focused)} // Handle icon press
                  style={{
                    width: ACTION_SIZE,
                    height: ACTION_SIZE,
                    backgroundColor: COLORS.white,
                    alignSelf: 'center',
                    borderRadius: ACTION_SIZE,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {focused ? (
                    <AntDesign
                      name="close"
                      size={FONT_SIZE['2xl']}
                      color={COLORS.black}
                    />
                  ) : (
                    <Feather
                      name="search"
                      size={FONT_SIZE['2xl']}
                      color={COLORS.black}
                    />
                  )}
                </TouchableOpacity>
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
export default MainTab;

const styles = StyleSheet.create({
  tabBarStyle: {
    display: 'flex',
    height: TAB_BAR_BG_HEIGHT,
    width: wp('100%'),
    borderWidth: 0,
    shadowOpacity: 0,
    padding: 0,
    elevation: 0,
    borderTopColor: COLORS.transparent,
  },
  tabItemContainer: {
    marginTop: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
});

export {styles};
