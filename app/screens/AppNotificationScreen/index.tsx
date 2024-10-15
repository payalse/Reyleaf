import {SafeAreaView, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import {COLORS, FONT_SIZE, FONT_WEIGHT, wp} from '../../styles';
import {MyText} from '../../components/MyText';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {api_getFavouriteList} from '../../api/product';
import {api_getNotifications} from '../../api/user';
import FullScreenLoader from '../../components/FullScreenLoader';
import moment from 'moment';

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
  console.log(payload);
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        borderColor: COLORS.lightgrey2,
        borderBottomWidth: 2,
        paddingBottom: 10,
      }}>
      <View
        style={{
          width: wp(15),
          height: wp(15),
          borderRadius: wp(15) / 2,
          backgroundColor: 'rgba(6, 95, 70, 0.2)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {category === 'Product' && (
          <FontAwesome5
            name="shopping-bag"
            color={COLORS.greenDark}
            size={FONT_SIZE.xl}
          />
        )}

        {category === 'Friend' && (
          <FontAwesome5
            name="user-friends"
            color={COLORS.greenDark}
            size={FONT_SIZE.xl}
          />
        )}
      </View>
      {(category === 'Product' || category === 'Friend') && (
        <View style={{flex: 1, gap: 5}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MyText
              size={FONT_SIZE.base}
              color={COLORS.black}
              bold={FONT_WEIGHT.bold}>
              {payload?.notification}
            </MyText>
          </View>
        </View>
      )}

      {category === 'Post' && (
        <View style={{flex: 1, gap: 5}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MyText
              size={FONT_SIZE.base}
              color={COLORS.black}
              bold={FONT_WEIGHT.bold}>
              {from?.fullname}
            </MyText>
          </View>
          <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            {payload?.notification}
          </MyText>
        </View>
      )}
      <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
        {moment(updatedAt).fromNow()}
      </MyText>
    </View>
  );
};

const AppNotificationScreen = () => {
  useHideBottomBar({});
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotiItemType[]>([]);
  const getData = async () => {
    try {
      setLoading(true);
      const body = {
        skip: 0,
        take: 20,
      };
      const res: any = await api_getNotifications(token!);
      console.log(res);
      setNotification(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [isFocused]);
  return (
    <View style={{flex: 1}}>
      {loading && <FullScreenLoader />}
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="Notification" />
      {notification.length == 0 && (
        <MyText
          size={FONT_SIZE.sml}
          color={COLORS.grey}
          center
          style={{marginTop: 50}}>
          No Notification data found!!
        </MyText>
      )}
      <FlatList
        style={{marginVertical: 20}}
        data={notification}
        renderItem={({item}) => {
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
