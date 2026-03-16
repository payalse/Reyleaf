import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import { COLORS, FONT_SIZE } from '../styles';
import { MyText } from '../components/MyText';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchStackParams } from './types';
import { heightPixel, pixelSizeVertical, widthPixel } from '../utils/sizeNormalization';


const Tab = createBottomTabNavigator();

const TAB_ICON_SIZE = widthPixel(24)
const TAB_FOCUSED_BTN = widthPixel(52);

export const TAB_BAR_BG_HEIGHT = heightPixel(140);

function MainTab() {
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
    <View style={{ flex: 1 }}>
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
            return (
              <Image
                source={BgImg}
                style={{
                  width: Dimensions.get("screen").width,
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
            tabBarIcon: ({ focused }) => {
              const color = focused ? COLORS.white : COLORS.grey;
              return (
                <View style={styles.tabItemContainer}>
                  {focused ? (
                    <HomeFillSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  ) : (
                    <HomeSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  )}
                  <MyText color={color} size={FONT_SIZE.base} style={{ marginTop: pixelSizeVertical(4), textAlign: "center" }}>
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
            tabBarIcon: ({ focused }) => {
              const color = focused ? COLORS.white : COLORS.grey;

              return (
                <View style={styles.tabItemContainer}>
                  {focused ? (
                    <CartFillSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  ) : (
                    <CartSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  )}
                  <MyText color={color} size={FONT_SIZE.base} style={{ marginTop: pixelSizeVertical(4), textAlign: "center" }}>
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
            tabBarIcon: ({ focused }) => {
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
                  <MyText color={color} size={FONT_SIZE.base} style={{ marginTop: pixelSizeVertical(4), textAlign: "center" }}>
                    Event
                  </MyText>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStack}
          options={{
            unmountOnBlur: true,
            tabBarItemStyle: {
              position: 'absolute',
              zIndex: 10,
              left: '50%',
              top: heightPixel(36),
            },
            tabBarLabel: '',
            tabBarIcon: ({ focused }) => {
              return (
                <TouchableOpacity
                  onPress={() => handleTabPress(focused)}
                  style={{
                    width: TAB_FOCUSED_BTN,
                    height: TAB_FOCUSED_BTN,
                    backgroundColor: COLORS.white,
                    alignSelf: 'center',
                    borderRadius: TAB_FOCUSED_BTN,
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
            tabBarIcon: ({ focused }) => {
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

                  <MyText color={color} size={FONT_SIZE.base} style={{ marginTop: pixelSizeVertical(4), textAlign: "center" }}>
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
            tabBarIcon: ({ focused }) => {
              const color = focused ? COLORS.white : COLORS.grey;
              return (
                <View style={styles.tabItemContainer}>
                  {focused ? (
                    <FeedFillSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  ) : (
                    <FeedSvg width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
                  )}

                  <MyText color={color} size={FONT_SIZE.base} style={{ marginTop: pixelSizeVertical(4), textAlign: "center" }}>
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
    width: Dimensions.get("screen").width,
    borderWidth: 0,
    shadowOpacity: 0,
    padding: 0,
    elevation: 0,
    borderTopColor: COLORS.transparent,
  },
  tabItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPixel(4),
    marginTop: heightPixel(72),
    marginHorizontal: "auto",
    width: Dimensions.get("window").width / 5
  },
});

export { styles };
