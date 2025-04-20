import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { MyText } from '../../../components/MyText';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { api_updateNotificationSettings } from '../../../api/user';
import { ShowAlert } from '../../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';
import { updateUser } from '../../../redux/features/auth/authSlice';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel } from '../../../utils/sizeNormalization';

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
        width: widthPixel(60),
        borderRadius: BORDER_RADIUS['Semi-Large'],
        height: heightPixel(36),
        marginLeft: pixelSizeHorizontal(-50),
        justifyContent: 'center',
        alignItems: value ? 'flex-end' : 'flex-start',
      }}>
      <View
        style={{
          backgroundColor: value ? COLORS.greenDark : COLORS.lightgrey,
          width: widthPixel(26),
          height: heightPixel(26),
          borderRadius: BORDER_RADIUS.Circle,
        }}
      />
    </TouchableOpacity>
  );
};

const NotificationScreen = () => {
  const { token } = useSelector((s: RootState) => s.auth);
  const authUser = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
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
    } catch (error) {
      console.log(error);
      ShowAlert({
        textBody: 'Error updating notification settings!',
        type: ALERT_TYPE.DANGER,
      });
    }
  };

  return (
    <MainLayout
      headerComp={
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{ left: 0 }}
          title="Notification"
        />
      }>
      <View
        style={{
          marginTop: pixelSizeVertical(20),
          gap: 10,
          paddingBottom: pixelSizeVertical(20),
          borderBlockColor: COLORS.lightgrey2,
          borderBottomWidth: heightPixel(2),
        }}>
        <MyText bold={FONT_WEIGHT.bold}>All Notification</MyText>
        <MyText color={COLORS.grey} >
          Manage your notifications! Choose how you'd like to stay
          updated—enable or disable alerts for updates, promotions, and more.
        </MyText>
      </View>
      <View style={{ gap: 20, marginVertical: pixelSizeVertical(20) }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{ gap: 5 }}>
            <MyText bold={FONT_WEIGHT.semibold}>Order Notification</MyText>
            <MyText size={FONT_SIZE.base} color={COLORS.grey} style={{ width: '80%' }}>
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
          }}>
          <View style={{ gap: 5 }}>
            <MyText bold={FONT_WEIGHT.semibold}>Event Notification</MyText>
            <MyText size={FONT_SIZE.base} color={COLORS.grey} style={{ width: '80%' }}>
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
          }}>
          <View style={{ gap: 5 }}>
            <MyText bold={FONT_WEIGHT.semibold}>Message Notification</MyText>
            <MyText size={FONT_SIZE.base} color={COLORS.grey} style={{ width: '80%' }}>
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