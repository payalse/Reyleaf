import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { MyText } from '../../../components/MyText';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { api_updateNotificationSettings } from '../../../api/user';
import { ShowAlert } from '../../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import { updateUser } from '../../../redux/features/auth/authSlice';

const SwitchComp = ({
  value,
  onPress,
}: {
  value: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: COLORS.white,
        padding: 5,
        width: 60,
        borderRadius: 20,
        height: 35,
        justifyContent: 'center',
        alignItems: value ? 'flex-end' : 'flex-start',
      }}
    >
      <View
        style={{
          backgroundColor: value ? COLORS.greenDark : COLORS.lightgrey,
          width: 25,
          height: 25,
          borderRadius: 25 / 2,
        }}
      />
    </TouchableOpacity>
  );
};

const NotificationScreen = () => {
  const { token } = useSelector((s: RootState) => s.auth);
  const authUser = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [notiObj, setNotObj] = useState({
    order: authUser?.orderNotification || true,
    event: authUser?.eventNotification || true,
    message: authUser?.messageNotification || true,
  });

  const updateSettings = async (value: any, type: any) => {
    try {
      const body = {
        type: type,
        value: value,
      };
      const res: any = await api_updateNotificationSettings(token!, body);
      dispatch(updateUser(res.data));
      ShowAlert({
        textBody: 'Notification settings updated successfully!!',
        type: ALERT_TYPE.SUCCESS,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const navigation = useNavigation();
  return (
    <MainLayout
      headerComp={
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{ left: 0 }}
          title="Notification"
        />
      }
    >
      <View
        style={{
          marginTop: 20,
          gap: 10,
          paddingBottom: 20,
          borderBlockColor: COLORS.lightgrey2,
          borderBottomWidth: 2,
        }}
      >
        <MyText bold={FONT_WEIGHT.bold}>All Notification</MyText>
        <MyText color={COLORS.grey}>
        Manage your notifications! Choose how you'd like to stay updated—enable or disable alerts for updates, promotions, and more.
        </MyText>
      </View>
      <View style={{ gap: 20, marginVertical: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ gap: 5 }}>
            <MyText bold={FONT_WEIGHT.semibold}>Order Notification</MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            Adjust your settings to manage order notification preferences.
            </MyText>
          </View>
          <SwitchComp
            value={notiObj.order}
            onPress={() => {
              setNotObj((s: any) => ({ ...s, order: !notiObj.order }));
              updateSettings(!notiObj.order, 'order');
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ gap: 5 }}>
            <MyText bold={FONT_WEIGHT.semibold}>Event Notification</MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            Customize your preferences to receive event notifications easily.
            </MyText>
          </View>
          <SwitchComp
            value={notiObj.event}
            onPress={() => {
              setNotObj((s: any) => ({ ...s, event: !notiObj.event }));
              updateSettings(!notiObj.event, 'event');
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ gap: 5 }}>
            <MyText bold={FONT_WEIGHT.semibold}>Message Notification</MyText>
            <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            Update your preferences to manage your message notifications.
            </MyText>
          </View>
          <SwitchComp
            value={notiObj.message}
            onPress={() => {
              setNotObj((s: any) => ({ ...s, message: !notiObj.message }));
              updateSettings(!notiObj.message, 'message');
            }}
          />
        </View>
      </View>
    </MainLayout>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
