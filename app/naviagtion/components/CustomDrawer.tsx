import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import LayoutBG from '../../components/layout/LayoutBG';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { MyText } from '../../components/MyText';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT } from '../../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerParams } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { logout } from '../../redux/features/auth/authSlice';

import EditProfileImg from '../../../assets/sidebar/editProfile.png';
import FaqImg from '../../../assets/sidebar/FAQs.png';
import aboutImg from '../../../assets/sidebar/about.png';
import changePasswordImg from '../../../assets/sidebar/changePassword.png';
import feedbackImg from '../../../assets/sidebar/feedback.png';
import logoutImg from '../../../assets/sidebar/logout.png';
import myOrderImg from '../../../assets/sidebar/myOrder.png';
import notificationImg from '../../../assets/sidebar/notification.png';
import paymentBillingImg from '../../../assets/sidebar/paymentBilling.png';
import shippingAddressImg from '../../../assets/sidebar/shippingAddres.png';
import myEarningImg from '../../../assets/sidebar/myEarning.png';

import { setFirstLaunched } from '../../redux/features/app/appSlice';
import { BUILD_IMAGE_URL } from '../../api';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel } from '../../utils/sizeNormalization';

type Props = {
  isLogout?: boolean;
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
};

const DrawerItem = ({ isLogout = false, icon, title, onPress }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={styles.drawerItem}>
    <View style={[styles.iconContainer, {
      backgroundColor: isLogout
        ? 'rgba(234, 67, 53, 0.18)'
        : 'rgba(6, 95, 70, 0.18)'
    }]}>
      {icon}
    </View>
    <View style={{ flex: 1 }}>
      <MyText color={isLogout ? COLORS.red : COLORS.grey}>{title}</MyText>
    </View>
    <AntDesign
      name="right"
      size={FONT_SIZE.lg}
      color={isLogout ? COLORS.red : COLORS.grey}
    />
  </TouchableOpacity>
);

type ListNodeType = {
  title: string;
  navigateTo: keyof DrawerParams;
  icon: React.ReactNode;
};

const iconStyle = {
  width: widthPixel(22),
  height: heightPixel(22),
  resizeMode: 'contain' as const,
};

const PersonalInfoList: ListNodeType[] = [
  {
    title: 'Edit Profile',
    navigateTo: 'ProfileEditStack',
    icon: <Image source={EditProfileImg} style={iconStyle} />,
  },
  {
    title: 'Change Password',
    navigateTo: 'ChangePassword',
    icon: <Image source={changePasswordImg} style={iconStyle} />,
  },
  {
    title: 'Shipping Address',
    navigateTo: 'ShippingAddress',
    icon: <Image source={shippingAddressImg} style={iconStyle} />,
  },
];

const GeneralList: ListNodeType[] = [
  {
    title: 'My Orders',
    navigateTo: 'MyOrders',
    icon: <Image source={myOrderImg} style={iconStyle} />,
  },
  {
    title: 'My Favorites',
    navigateTo: 'MyFavourite',
    icon: <Image source={paymentBillingImg} style={iconStyle} />,
  },
  {
    title: 'Payment & Billing',
    navigateTo: 'PaymentAndBillingStack',
    icon: <Image source={paymentBillingImg} style={iconStyle} />,
  },
  // {
  //   title: 'My Earning',
  //   navigateTo: 'EarningStack',
  //   icon: <Image source={myEarningImg} style={iconStyle} />,
  // },
  {
    title: 'Notification',
    navigateTo: 'Notification',
    icon: <Image source={notificationImg} style={iconStyle} />,
  },
  {
    title: 'FAQs',
    navigateTo: 'SupportStack',
    icon: <Image source={FaqImg} style={iconStyle} />,
  },
  {
    title: 'Feedback',
    navigateTo: 'FeedbackScreen',
    icon: <Image source={feedbackImg} style={iconStyle} />,
  },
  {
    title: 'About Reyleaf',
    navigateTo: 'AboutUsStack',
    icon: <Image source={aboutImg} style={iconStyle} />,
  },
];

const VENDOR_IGNORE_LIST = ['Shipping Address', 'My Orders', 'Payment & Billing'];
const USER_IGNORE_LIST = ['My Earning'];

const CustomDrawer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<DrawerParams>>();
  const { mode, defaultAvatar } = useSelector((s: RootState) => s.app);
  const { user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = () => navigation.dispatch(DrawerActions.toggleDrawer());

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(setFirstLaunched(false));
            dispatch(logout());
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <LayoutBG type="bg-tr-bl">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <SecondaryHeader
          onBack={handleClose}
          backBtnContainerStyle={{ left: 0, marginTop: pixelSizeVertical(-10) }}
          title=""
        />
        <View style={styles.avatar}>
          <Image
            source={user?.picture ? { uri: BUILD_IMAGE_URL(user.picture) } : defaultAvatar.img}
            style={styles.avatarImg}
          />
        </View>
        <MyText
          center
          size={FONT_SIZE['1.5xl']}
          color={COLORS.black}
          bold={FONT_WEIGHT.bold}
          style={{ marginTop: pixelSizeVertical(8) }}>
          {user?.fullname ?? 'User'}
        </MyText>
        <View style={styles.emailContainer}>
          <Ionicons name="mail" size={FONT_SIZE.xl} color={COLORS.greenDark} />
          <MyText center color={COLORS.greenDark} size={FONT_SIZE.base}>
            {user?.email}
          </MyText>
        </View>

        <View style={styles.line} />
        <Section title="Personal Info" items={PersonalInfoList} mode={mode} navigation={navigation} />
        <View style={styles.line} />
        <Section title="General Info" items={GeneralList} mode={mode} navigation={navigation} />
        <DrawerItem
          title="Logout"
          isLogout
          icon={<Image source={logoutImg} style={iconStyle} />}
          onPress={handleLogout}
        />
      </ScrollView>
    </LayoutBG>
  );
};

const Section = ({ title, items, mode, navigation }: {
  title: string;
  items: ListNodeType[];
  mode: string;
  navigation: NativeStackNavigationProp<DrawerParams>;
}) => {
  return (
    <View style={{ marginVertical: 15 }}>
      <MyText
        size={FONT_SIZE.lg}
        color={COLORS.black}
        bold={FONT_WEIGHT.bold}>
        {title}
      </MyText>
      <View style={{ gap: 10, marginTop: pixelSizeVertical(12) }}>
        {items.map(item => {
          const isVendorBlocked = mode === 'VENDOR' && VENDOR_IGNORE_LIST.includes(item.title);
          const isUserBlocked = mode === 'USER' && USER_IGNORE_LIST.includes(item.title);
          if (isVendorBlocked || isUserBlocked) return null;
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
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 0,
  },
  avatar: {
    width: widthPixel(120),
    height: heightPixel(116),
    borderRadius: heightPixel(60),
    backgroundColor: COLORS.grey,
    alignSelf: 'center',
    marginTop: pixelSizeVertical(20),
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 200,
  },
  emailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: pixelSizeVertical(4),
    marginBottom: pixelSizeHorizontal(40),
  },
  line: {
    width: '90%',
    height: heightPixel(1),
    alignSelf: 'center',
    backgroundColor: COLORS.grey,
    opacity: .1
  },
  drawerItem: {
    height: heightPixel(60),
    borderRadius: BORDER_RADIUS['Semi-Large'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: heightPixel(15),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPixel(54),
    height: heightPixel(54),
    borderRadius: BORDER_RADIUS.Medium,
  },
});
