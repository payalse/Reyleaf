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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS, FONT_SIZE} from '../styles';
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
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SearchStackParams} from './types';
import {heightPixel, widthPixel} from '../utils/sizeNormalization';

const Tab = createBottomTabNavigator();
const SCREEN_WIDTH = Dimensions.get('screen').width;

const TAB_ICON_SIZE = widthPixel(24);
const TAB_FOCUSED_BTN = widthPixel(52);

// Base image/arch height — minimum 110 so tiny phones never clip the background.
const BASE_TAB_HEIGHT = Math.max(heightPixel(140), 110);

// Exported for floating-button positioning in other screens.
export const TAB_BAR_BG_HEIGHT = BASE_TAB_HEIGHT;

function MainTab() {
  const navigation =
    useNavigation<NativeStackNavigationProp<SearchStackParams>>();
  const {bottom: bottomInset} = useSafeAreaInsets();

  // Total bar = arch image area + device safe-area zone (home bar / gesture bar).
  const tabBarHeight = BASE_TAB_HEIGHT + bottomInset;

  // Keep icon row proportional to the arch image (original ratio: 72 / 140 ≈ 0.51).
  const iconMarginTop = Math.round(BASE_TAB_HEIGHT * 0.51);
  // Keep centre search button proportional (original: 36 / 140 ≈ 0.26).
  const centreButtonTop = Math.round(BASE_TAB_HEIGHT * 0.26);

  const handleTabPress = (focused: boolean) => {
    if (focused) {
      navigation.goBack();
    } else {
      navigation.navigate('SearchStack');
    }
  };

  const tabIcon = (
    focused: boolean,
    Active: React.ElementType,
    Inactive: React.ElementType,
    label: string,
  ) => {
    const color = focused ? COLORS.white : COLORS.grey;
    return (
      <View style={[styles.tabItemContainer, {marginTop: iconMarginTop}]}>
        {focused ? (
          <Active width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
        ) : (
          <Inactive width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
        )}
        <MyText color={color} size={FONT_SIZE.xs} style={styles.tabLabel}>
          {label}
        </MyText>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        id="MainTab"
        tabBar={props => (
          <View style={styles.tabBarWrapper}>
            <BottomTabBar {...props} />
          </View>
        )}
        screenOptions={{
          headerTransparent: true,
          headerShown: false,
          unmountOnBlur: true,
          tabBarStyle: {
            height: tabBarHeight,
            width: SCREEN_WIDTH,
            borderWidth: 0,
            shadowOpacity: 0,
            padding: 0,
            elevation: 0,
            borderTopColor: COLORS.transparent,
          },
          tabBarBackground: () => (
            <Image
              source={BgImg}
              style={{
                width: SCREEN_WIDTH,
                // Image only covers the arch area; safe-area zone below is blank.
                height: BASE_TAB_HEIGHT,
                position: 'absolute',
                top: 0,
                resizeMode: 'stretch',
                zIndex: 10,
                backgroundColor: COLORS.transparent,
              }}
            />
          ),
        }}>

        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarLabel: '',
            unmountOnBlur: true,
            tabBarIcon: ({focused}) =>
              tabIcon(focused, HomeFillSvg, HomeSvg, 'Home'),
          }}
        />

        <Tab.Screen
          name="CartTab"
          component={CartStack}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused}) =>
              tabIcon(focused, CartFillSvg, CartSvg, 'Cart'),
          }}
        />

        <Tab.Screen
          name="EventTab"
          component={EventStack}
          options={{
            unmountOnBlur: true,
            tabBarLabel: '',
            tabBarIcon: ({focused}) =>
              tabIcon(focused, EventFillSvg, EventSvg, 'Event'),
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
              top: centreButtonTop,
            },
            tabBarLabel: '',
            tabBarIcon: ({focused}) => (
              <TouchableOpacity
                onPress={() => handleTabPress(focused)}
                style={[
                  styles.centreBtn,
                  {
                    width: TAB_FOCUSED_BTN,
                    height: TAB_FOCUSED_BTN,
                    borderRadius: TAB_FOCUSED_BTN,
                  },
                ]}>
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
            ),
          }}
        />

        <Tab.Screen
          name="AwarenessTab"
          component={AwarenessStack}
          options={{
            unmountOnBlur: true,
            tabBarLabel: '',
            tabBarIcon: ({focused}) =>
              tabIcon(focused, AwarenessFillSvg, AwarenessSvg, 'Awareness'),
          }}
        />

        <Tab.Screen
          name="FeedTab"
          component={FeedStack}
          options={{
            unmountOnBlur: true,
            tabBarLabel: '',
            tabBarIcon: ({focused}) =>
              tabIcon(focused, FeedFillSvg, FeedSvg, 'Feeds'),
          }}
        />

      </Tab.Navigator>
    </View>
  );
}

export default MainTab;

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH / 5,
  },
  tabLabel: {
    marginTop: 3,
    textAlign: 'center',
  },
  centreBtn: {
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {styles};
