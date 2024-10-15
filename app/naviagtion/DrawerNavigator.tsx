import React from 'react';
import MainTab from './MainTab';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './components/CustomDrawer';
import {wp} from '../styles';
import EditProfileScreen from '../screens/drawer/EditProfileScreen';
import {DrawerParams, ProfileEditStackParams} from './types';
import ChangePasswordScreen from '../screens/drawer/ChangePasswordScreen';
import AllAddressScreen from '../screens/drawer/AllAddressScreen';
import AddAddressScreen from '../screens/cart/AddAddressScreen';
import EditAddressScreen from '../screens/cart/EditAddressScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyOrdersScreen from '../screens/drawer/MyOrdersScreen';
import OrderReviewScreen from '../screens/drawer/OrderReviewScreen';
import OrderDetailScreen from '../screens/drawer/OrderDetailScreen';
import NotificationScreen from '../screens/drawer/NotificationScreen';
import FeedbackScreen from '../screens/drawer/FeedbackScreen';
import PaymentAndBillingScreen from '../screens/drawer/PaymentAndBillingScreen';
import AddCardScreen from '../screens/cart/AddCardScreen';
import EditCardScreen from '../screens/cart/EditCardScreen';
import AboutUsScreen from '../screens/drawer/AboutUsScreen';
import PrivacyPolicyScreen from '../screens/drawer/PrivacyPolicyScreen';
import TermAndConditionScreen from '../screens/drawer/TermAndConditionScreen';
import FavouriteScreen from '../screens/drawer/FavouriteScreen';
import FAQScreen from '../screens/support/FAQScreen';
import CreateNewTicketScreen from '../screens/support/CreateNewTicketScreen';
import SupportTicketsScreen from '../screens/support/SupportTicketsScreen';
import TicketDetailScreen from '../screens/support/TicketDetailScreen';
import VendorTab from './vendor/VendorTab';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import EarningScreen from '../screens/EarningScreen';
import SupportChatScreen from '../screens/support/SupportChatScreen';
import ChooseProfileImageScreen from '../screens/auth/ChooseProfileImageScreen';
import AddNewAccount from '../screens/drawer/AddNewAccount';
import UpdateAccountScreen from '../screens/drawer/UpdateAccountScreen';
import SearchStack from './SearchStack';
import ConnectWithCalendarScreen from '../screens/drawer/ConnectCalender';

// SHIPPING STACK
export type ShippingAddressStackParams = {
  AllAddress: undefined;
  AddAddress: undefined;
  EditAddress: {raw: any; addressId: string};
};
const Stack = createNativeStackNavigator<ShippingAddressStackParams>();
const ShippingAddressStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AllAddress" component={AllAddressScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="EditAddress" component={EditAddressScreen} />
    </Stack.Navigator>
  );
};

// Order STACK
export type OrderStackParams = {
  AllOrders: undefined;
  OrderDetail: {orderId: string};
  OrderReview: {orderId: string};
};
const OrderStack = createNativeStackNavigator<OrderStackParams>();
const OrderStackNavigator = () => {
  return (
    <OrderStack.Navigator screenOptions={{headerShown: false}}>
      <OrderStack.Screen name="AllOrders" component={MyOrdersScreen} />
      <OrderStack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <OrderStack.Screen name="OrderReview" component={OrderReviewScreen} />
    </OrderStack.Navigator>
  );
};
export {OrderStackNavigator};
// PAYMENT & BILLING STACK
export type PaymentAndBillingStackParams = {
  PaymentAndBilling: undefined;
  EditCard: undefined;
  AddCard: undefined;
};
const Stack3 = createNativeStackNavigator<PaymentAndBillingStackParams>();
const PaymentAndBillingStack = () => {
  return (
    <Stack3.Navigator screenOptions={{headerShown: false}}>
      <Stack3.Screen
        name="PaymentAndBilling"
        component={PaymentAndBillingScreen}
      />
      <Stack3.Screen name="EditCard" component={EditCardScreen} />
      <Stack3.Screen name="AddCard" component={AddCardScreen} />
    </Stack3.Navigator>
  );
};

// AboutUs STACK
export type AboutUsStackParams = {
  AboutUs: undefined;
  PrivacyPolicy: undefined;
  TermAndCondition: undefined;
};
const Stack4 = createNativeStackNavigator<AboutUsStackParams>();
const AboutUsStack = () => {
  return (
    <Stack4.Navigator screenOptions={{headerShown: false}}>
      <Stack4.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack4.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack4.Screen
        name="TermAndCondition"
        component={TermAndConditionScreen}
      />
    </Stack4.Navigator>
  );
};

// Support STACK
export type SupportStackParams = {
  FAQ: undefined;
  CreateNewTicket: undefined;
  SupportTicket: undefined;
  TicketDetail: {
    item: any;
  };
  SupportChat: {
    item: any;
  };
};

// FAQ
const Stack5 = createNativeStackNavigator<SupportStackParams>();
const SupportStack = () => {
  return (
    <Stack5.Navigator screenOptions={{headerShown: false}}>
      <Stack5.Screen name="FAQ" component={FAQScreen} />
      <Stack5.Screen name="CreateNewTicket" component={CreateNewTicketScreen} />
      <Stack5.Screen name="SupportTicket" component={SupportTicketsScreen} />
      <Stack5.Screen name="SupportChat" component={SupportChatScreen} />
      <Stack5.Screen name="TicketDetail" component={TicketDetailScreen} />
    </Stack5.Navigator>
  );
};

// Earning STACK
export type EarningStackParams = {
  Earning: undefined;
  EditAccount: undefined;
  AddNewAccount: undefined;
};
// My Earning
const Stack6 = createNativeStackNavigator<EarningStackParams>();
const EarningStack = () => {
  return (
    <Stack6.Navigator screenOptions={{headerShown: false}}>
      <Stack6.Screen name="Earning" component={EarningScreen} />
      <Stack6.Screen name="AddNewAccount" component={AddNewAccount} />
      <Stack6.Screen name="EditAccount" component={UpdateAccountScreen} />
    </Stack6.Navigator>
  );
};
// ProfileEditStack
const Stack7 = createNativeStackNavigator<ProfileEditStackParams>();
const ProfileEditStack = () => {
  return (
    <Stack7.Navigator screenOptions={{headerShown: false}}>
      <Stack7.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack7.Screen
        name="ChooseProfileImage"
        component={ChooseProfileImageScreen}
      />
    </Stack7.Navigator>
  );
};

// DRAWER STACK
const Drawer = createDrawerNavigator<DrawerParams>();
const DrawerNavigator = () => {
  const appMode = useSelector((s: RootState) => s.app.mode);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: wp(100),
        },
      }}
      drawerContent={props => <CustomDrawer />}>
      {appMode === 'USER' ? (
        <Drawer.Screen name="MainTab" component={MainTab} />
      ) : (
        <Drawer.Screen name="MainTab" component={VendorTab} />
      )}
      <Drawer.Screen name="SearchStack" component={SearchStack} />
      <Drawer.Screen name="ProfileEditStack" component={ProfileEditStack} />
      <Drawer.Screen
        name="ConnectCalender"
        component={ConnectWithCalendarScreen}
      />
      <Drawer.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Drawer.Screen name="ShippingAddress" component={ShippingAddressStack} />
      <Drawer.Screen name="MyOrders" component={OrderStackNavigator} />
      {appMode === 'USER' && (
        <Drawer.Screen name="MyFavourite" component={FavouriteScreen} />
      )}
      <Drawer.Screen name="FeedbackScreen" component={FeedbackScreen} />
      <Drawer.Screen name="Notification" component={NotificationScreen} />
      <Drawer.Screen name="EarningStack" component={EarningStack} />
      <Drawer.Screen
        name="PaymentAndBillingStack"
        component={PaymentAndBillingStack}
      />
      <Drawer.Screen name="AboutUsStack" component={AboutUsStack} />
      <Drawer.Screen name="SupportStack" component={SupportStack} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
