import { SafeAreaView, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useHideBottomBar } from '../../hook/useHideBottomBar';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT, wp } from '../../styles';
import { MyText } from '../../components/MyText';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { api_getNotifications } from '../../api/user';
import FullScreenLoader from '../../components/FullScreenLoader';
import moment from 'moment';
import { pixelSizeHorizontal, widthPixel, heightPixel, pixelSizeVertical } from '../../utils/sizeNormalization';

type NotiItemType = {
  category: 'Product' | 'Post' | 'Friend';
  type: string;
  updatedAt: string;
  from: any | null;
  payload: any | null;
};

const NotificationItem = ({
  category = 'Post',
  type,
  updatedAt,
  from,
  payload,
}: NotiItemType) => {

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: heightPixel(10),
        marginHorizontal: pixelSizeHorizontal(20),
        marginVertical: pixelSizeVertical(10),
        borderColor: COLORS.lightgrey2,
        borderBottomWidth: heightPixel(2),
        paddingBottom: pixelSizeVertical(10),
      }}>
      <View
        style={{
          width: widthPixel(58),
          height: heightPixel(60),
          borderRadius: BORDER_RADIUS.Circle,
          backgroundColor: 'rgba(6, 95, 70, 0.2)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {category === 'Product' && (
          <FontAwesome5
            name="shopping-bag"
            color={COLORS.greenDark}
            size={widthPixel(24)}
          />
        )}

        {category === 'Friend' && (
          <FontAwesome5
            name="user-friends"
            color={COLORS.greenDark}
            size={widthPixel(24)}
          />
        )}
      </View>
      {(category === 'Product' || category === 'Friend') && (
        <View style={{ flex: 1, gap: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <MyText
              color={COLORS.black}
              size={FONT_SIZE.xl}
              bold={FONT_WEIGHT.bold}>
              {payload?.notification}
            </MyText>
          </View>
        </View>
      )}

      {category === 'Post' && (
        <View style={{ flex: 1, gap: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <MyText
              size={FONT_SIZE.base}
              color={COLORS.black}
              bold={FONT_WEIGHT.bold}>
              {from?.fullname}
            </MyText>
          </View>
          <MyText size={FONT_SIZE.base} color={COLORS.grey}>
            {payload?.notification}
          </MyText>
        </View>
      )}
      <MyText size={FONT_SIZE.base} color={COLORS.grey}>
        {moment(updatedAt).fromNow()}
      </MyText>
    </View>
  );
};

const AppNotificationScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { token } = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotiItemType[]>([]);
  useHideBottomBar({});

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res: any = await api_getNotifications(token!);
      setNotification(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      {loading && <FullScreenLoader />}
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Notification" />
      {notification.length == 0 && (
        <MyText
          size={FONT_SIZE.sml}
          color={COLORS.grey}
          center
          style={{ marginTop: pixelSizeVertical(50) }}>
          No Notification data found!!
        </MyText>
      )}
      <FlatList
        style={{ marginVertical: pixelSizeVertical(20) }}
        data={notification}
        renderItem={({ item }) => {
          return (
            <NotificationItem
              category={item.category}
              type={item.type}
              from={item.from}
              payload={item.payload}
              updatedAt={item.updatedAt}
            />
          );
        }}
      />
    </View>
  );
};

export default AppNotificationScreen;
