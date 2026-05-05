import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
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

type NotiKey = 'order' | 'event' | 'message';

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
      activeOpacity={0.85}
      style={[
        styles.switchTrack,
        { alignItems: value ? 'flex-end' : 'flex-start' },
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}>
      <View
        style={[
          styles.switchThumb,
          { backgroundColor: value ? COLORS.greenDark : COLORS.lightgrey },
        ]}
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
    order: authUser?.orderNotification ?? true,
    event: authUser?.eventNotification ?? true,
    message: authUser?.messageNotification ?? true,
  });
  const [loadingByType, setLoadingByType] = useState<Record<NotiKey, boolean>>({
    order: false,
    event: false,
    message: false,
  });

  useEffect(() => {
    if (!authUser) {
      return;
    }
    setNotObj({
      order: authUser.orderNotification ?? true,
      event: authUser.eventNotification ?? true,
      message: authUser.messageNotification ?? true,
    });
  }, [
    authUser?._id,
    authUser?.orderNotification,
    authUser?.eventNotification,
    authUser?.messageNotification,
  ]);

  const updateSettings = async (
    value: boolean,
    type: NotiKey,
    previousValue: boolean,
  ) => {
    if (!token) {
      ShowAlert({
        textBody: 'You must be signed in to update settings.',
        type: ALERT_TYPE.DANGER,
      });
      return;
    }
    setLoadingByType(s => ({ ...s, [type]: true }));
    try {
      const body = { type, value };
      const res: any = await api_updateNotificationSettings(token, body);
      dispatch(updateUser(res.data));
      ShowAlert({
        textBody: 'Notification settings updated successfully!!',
        type: ALERT_TYPE.SUCCESS,
      });
    } catch (error) {
      console.log(error);
      setNotObj(s => ({ ...s, [type]: previousValue }));
      ShowAlert({
        textBody: 'Error updating notification settings!',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setLoadingByType(s => ({ ...s, [type]: false }));
    }
  };

  const row = (key: NotiKey, title: string, description: string) => (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <MyText bold={FONT_WEIGHT.semibold}>{title}</MyText>
        <MyText size={FONT_SIZE.base} color={COLORS.grey} style={styles.description}>
          {description}
        </MyText>
      </View>
      <View style={styles.switchSlot}>
        {loadingByType[key] ? (
          <ActivityIndicator color={COLORS.greenDark} size="small" />
        ) : (
          <SwitchComp
            value={notiObj[key]}
            onPress={() => {
              const previousValue = notiObj[key];
              const next = !previousValue;
              setNotObj(s => ({ ...s, [key]: next }));
              updateSettings(next, key, previousValue);
            }}
          />
        )}
      </View>
    </View>
  );

  return (
    <MainLayout
      headerComp={
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{ left: 0 }}
          title="Notification"
        />
      }>
      <View style={styles.intro}>
        <MyText bold={FONT_WEIGHT.bold}>All Notification</MyText>
        <MyText color={COLORS.grey} style={styles.introBody}>
          Manage your notifications! Choose how you'd like to stay updated—enable or disable
          alerts for updates, promotions, and more.
        </MyText>
      </View>
      <View style={styles.rows}>
        {row(
          'order',
          'Order Notification',
          'Adjust your settings to manage order notification preferences.',
        )}
        {row(
          'event',
          'Event Notification',
          'Customize your preferences to receive event notifications easily.',
        )}
        {row(
          'message',
          'Message Notification',
          'Update your preferences to manage your message notifications.',
        )}
      </View>
    </MainLayout>
  );
};

export default NotificationScreen;

const SWITCH_W = widthPixel(52);
const THUMB = widthPixel(26);

const styles = StyleSheet.create({
  intro: {
    marginTop: pixelSizeVertical(20),
    gap: 10,
    paddingBottom: pixelSizeVertical(20),
    borderBottomWidth: heightPixel(2),
    borderBottomColor: COLORS.lightgrey2,
  },
  introBody: {
    flexShrink: 1,
  },
  rows: {
    gap: 20,
    marginVertical: pixelSizeVertical(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(12),
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  description: {
    flexShrink: 1,
  },
  switchTrack: {
    backgroundColor: COLORS.white,
    padding: 5,
    width: SWITCH_W,
    borderRadius: BORDER_RADIUS['Semi-Large'],
    height: heightPixel(36),
    justifyContent: 'center',
  },
  switchThumb: {
    width: THUMB,
    height: heightPixel(26),
    borderRadius: BORDER_RADIUS.Circle,
  },
  switchSlot: {
    width: SWITCH_W,
    height: heightPixel(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
