import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import LayoutBG from '../../components/layout/LayoutBG';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT, wp} from '../../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerParams} from '../types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {logout} from '../../redux/features/auth/authSlice';

// ICONS
import EditProfileImg from '../../../assets/sidebar/editProfile.png';
import FaqImg from '../../../assets/sidebar/FAQs.png';
import aboutImg from '../../../assets/sidebar/about.png';
import changePasswordImg from '../../../assets/sidebar/changePassword.png';
import feedbackImg from '../../../assets/sidebar/feedback.png';
import logoutImg from '../../../assets/sidebar/logout.png';
import myOrderImg from '../../../assets/sidebar/myOrder.png';
import notificationImg from '../../../assets/sidebar/notification.png';
import paymentBillingImg from '../../../assets/sidebar/paymentBilling.png';
import ConnectCalenderImg from '../../../assets/sidebar/connectCalendar.png';
import shippingAddressImg from '../../../assets/sidebar/shippingAddres.png';
import myEarningImg from '../../../assets/sidebar/myEarning.png';
import {setFirstLaunched} from '../../redux/features/app/appSlice';
import {BUILD_IMAGE_URL} from '../../api';

type Props = {
  isLogout?: boolean;
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
};

const DrawerItem = ({isLogout = false, icon, title, onPress}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
      }}>
      <View
        style={{
          backgroundColor: isLogout
            ? 'rgba(234, 67, 53, 0.18)'
            : 'rgba(6, 95, 70, 0.18)',
          justifyContent: 'center',
          alignItems: 'center',
          width: 50,
          height: 50,
          borderRadius: 15,
        }}>
        {icon}
      </View>
      <View style={{flex: 1}}>
        <MyText color={isLogout ? COLORS.red : COLORS.grey}>{title}</MyText>
      </View>
      <AntDesign
        name="right"
        size={FONT_SIZE['base']}
        color={isLogout ? COLORS.red : COLORS.grey}
      />
    </TouchableOpacity>
  );
};

interface NavigateTo extends DrawerParams {}
type ListNodeType = {
  title: string;
  navigateTo: keyof NavigateTo;
  icon: React.ReactNode;
};

const styles2 = StyleSheet.create({
  sideBarIconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

const PersonalInfoList: ListNodeType[] = [
  {
    title: 'Edit Profile',
    navigateTo: 'ProfileEditStack',
    icon: <Image source={EditProfileImg} style={styles2.sideBarIconImg} />,
  },
  {
    title: 'Change Password',
    navigateTo: 'ChangePassword',
    icon: <Image source={changePasswordImg} style={styles2.sideBarIconImg} />,
  },
  {
    title: 'Shipping Address',
    navigateTo: 'ShippingAddress',
    icon: <Image source={shippingAddressImg} style={styles2.sideBarIconImg} />,
  },
];
const GeneralList: ListNodeType[] = [
  {
    title: 'My Orders',
    navigateTo: 'MyOrders',
    icon: <Image source={myOrderImg} style={styles2.sideBarIconImg} />,
  },
  {
    title: 'My Favorites',
    navigateTo: 'MyFavourite',
    icon: <Image source={paymentBillingImg} style={styles2.sideBarIconImg} />,
  },
  {
    title: 'Payment & Billing',
    navigateTo: 'PaymentAndBillingStack',
    icon: <Image source={paymentBillingImg} style={styles2.sideBarIconImg} />,
  },
  // {
  //   title: 'Connect Calender',
  //   navigateTo: 'ConnectCalender',
  //   icon: <Image source={ConnectCalenderImg} style={styles2.sideBarIconImg} />,
  // },
  {
    title: 'My Earning',
    navigateTo: 'EarningStack',
    icon: <Image source={myEarningImg} style={styles2.sideBarIconImg} />,
  },
  {
    title: 'Notification',
    navigateTo: 'Notification',
    icon: <Image source={notificationImg} style={styles2.sideBarIconImg} />,
  },
  {
    title: 'FAQs',
    navigateTo: 'SupportStack',
    icon: <Image source={FaqImg} style={styles2.sideBarIconImg} />,
  },
  {
    title: 'Feedback',
    navigateTo: 'FeedbackScreen',
    icon: <Image source={feedbackImg} style={styles2.sideBarIconImg} />,
  },
  {
    title: 'About Reynette',
    navigateTo: 'AboutUsStack',
    icon: <Image source={aboutImg} style={styles2.sideBarIconImg} />,
  },
  {
    title: 'Logout',
    navigateTo: 'ChangePassword',
    icon: <Image source={logoutImg} style={styles2.sideBarIconImg} />,
  },
];

const VENDOR_IGNORE_LIST: string[] = [
  'Shipping Address',
  'My Orders',
  'Payment & Billing',
];
const USER_IGNORE_LIST: string[] = ['My Earning'];

const CustomDrawer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DrawerParams>>();
  function handleClose() {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }
  const {mode, defaultAvatar} = useSelector((s: RootState) => s.app);
  const {user} = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(setFirstLaunched(false));
    dispatch(logout());
  };
  return (
    <LayoutBG type="bg-tr-bl">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 0,
        }}>
        <SecondaryHeader
          onBack={handleClose}
          backBtnContainerStyle={{left: 0, marginTop: -10}}
          title=""
        />

        <View style={styles.avatar}>
          {user?.picture ? (
            <Image
              source={{uri: BUILD_IMAGE_URL(user.picture)}}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 200,
              }}
            />
          ) : (
            <Image
              source={defaultAvatar.img}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 200,
              }}
            />
          )}
        </View>
        <MyText
          style={{marginTop: 5}}
          center
          size={FONT_SIZE.xl}
          color={COLORS.black}
          bold={FONT_WEIGHT.bold}>
          {/* @ts-ignore */}
          {user?.fullname}
        </MyText>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 40,
            gap: 5,
            marginTop: 5,
          }}>
          <Ionicons name="mail" size={FONT_SIZE.xl} color={COLORS.greenDark} />
          <MyText center color={COLORS.greenDark} size={FONT_SIZE.sm}>
            {user?.email}
          </MyText>
        </View>
        <View style={styles.line} />
        <View style={{marginVertical: 15}}>
          <MyText
            size={FONT_SIZE.base}
            color={COLORS.black}
            bold={FONT_WEIGHT.bold}>
            Personal Info
          </MyText>
          <View style={{gap: 10, marginTop: 10}}>
            {PersonalInfoList.map(item => {
              if (mode === 'VENDOR') {
                const isInVendotIgnoreList = VENDOR_IGNORE_LIST.includes(
                  item.title,
                );
                if (isInVendotIgnoreList) {
                  return null;
                }
              }

              return (
                <DrawerItem
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  onPress={() => navigation.navigate(item.navigateTo)}
                />
              );
            })}
          </View>
        </View>
        <View style={styles.line} />
        <View style={{marginVertical: 15}}>
          <MyText
            size={FONT_SIZE.base}
            color={COLORS.black}
            bold={FONT_WEIGHT.bold}>
            General Info
          </MyText>
          <View style={{gap: 10, marginTop: 10}}>
            {GeneralList.map(item => {
              const isLogout = item.title === 'Logout';
              if (mode === 'VENDOR') {
                const isInVendotIgnoreList = VENDOR_IGNORE_LIST.includes(
                  item.title,
                );
                if (isInVendotIgnoreList) {
                  return null;
                }
              }

              if (mode === 'USER') {
                const isInIgnoreList = USER_IGNORE_LIST.includes(item.title);
                if (isInIgnoreList) {
                  return null;
                }
              }
              return (
                <DrawerItem
                  key={item.title}
                  title={item.title}
                  isLogout={isLogout}
                  icon={item.icon}
                  onPress={() => {
                    isLogout
                      ? handleLogout()
                      : navigation.navigate(item.navigateTo);
                  }}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </LayoutBG>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  avatar: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(30) / 2,
    backgroundColor: COLORS.grey,
    alignSelf: 'center',
    marginTop: 20,
    overflow: 'hidden',
  },
  line: {
    width: '90%',
    height: 1,
    alignSelf: 'center',
    backgroundColor: COLORS.lightgrey2,
  },
});
