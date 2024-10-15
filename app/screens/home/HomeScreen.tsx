import React, {useCallback, useEffect, useState} from 'react';
import MainHeader from '../../components/header/MainHeader';
import MainLayout from '../../components/layout/MainLayout';
import {ActivityIndicator, View} from 'react-native';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import OptionsList from './OptionsList';
import TrendingProducts from './TrendingProducts';
import BestSellingList from './BestSellingList';
import RecentlyViewedList from './RecentlyViewedList';
import NewlyArrivalList from './NewlyArrivalList';
import SearchBox from '../../components/SearchBox';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParams} from '../../naviagtion/types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {api_getHomeProducts} from '../../api/product';
import {DEFAULT_ALL_CATEGORY} from '../../redux/features/category/categorySlice';
import {GetHomeProductResponse} from '../../types/apiResponse';
import {
  setBestSellingProduct,
  setNewlyProduct,
  setRecentlyViewedProduct,
} from '../../redux/features/product/productSlice';
import messaging from '@react-native-firebase/messaging';
import {LocalNotification} from '../../utils/localNotification';

const RenderProducts = () => {
  const [loading, setLoading] = useState(false);
  const {homeActiveCategory} = useSelector((s: RootState) => s.category);
  const {token} = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const requestApi = useCallback(async () => {
    let categoryId = null;
    if (homeActiveCategory._id !== DEFAULT_ALL_CATEGORY._id) {
      categoryId = homeActiveCategory._id;
    }
    try {
      setLoading(true);
      const res = (await api_getHomeProducts(
        token!,
        categoryId,
      )) as GetHomeProductResponse;
      if ('bestSeller' in res.data) {
        dispatch(setBestSellingProduct(res.data.bestSeller));
      }
      if ('newAdded' in res.data) {
        dispatch(setNewlyProduct(res.data.newAdded));
      }
      if ('recentViewed' in res.data) {
        dispatch(setRecentlyViewedProduct(res.data.recentViewed));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, token, homeActiveCategory]);

  useEffect(() => {
    requestApi();
  }, [homeActiveCategory, requestApi]);

  if (loading) {
    return <ActivityIndicator size={'small'} color={COLORS.greenDark} />;
  }
  return (
    <React.Fragment>
      <TrendingProducts />
      <NewlyArrivalList />
      <BestSellingList />
      <RecentlyViewedList />
    </React.Fragment>
  );
};

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();
  const {isAuthenticated} = useSelector((s: RootState) => s.auth);

  const navi = () => {
    console.log('navi', navigation);
    // @ts-ignore
    navigation.navigate('MainTab', {
      screen: 'FeedTab',
      params: {tab: 'friend'},
    });
  };
  useEffect(() => {
    const notificationListener = async () => {
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state y',
          remoteMessage.notification,
        );
        navi();
        return remoteMessage.notification;
      });

      messaging().onMessage(async remoteMessage => {
        console.log(
          'Notification caused app to open from background state x',
          remoteMessage.notification,
        );
        LocalNotification({
          title: remoteMessage.notification?.title || '',
          body: remoteMessage.notification?.body || '',
        });
        navi();
        return remoteMessage.notification;
      });

      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          // App was opened by a notification
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quite state',
              remoteMessage.notification,
            );
          }
          //   return remoteMessage.notification;
        });
    };
    notificationListener();
  }, []);

  return (
    <MainLayout
      headerComp={
        <MainHeader
          onMessagePress={() => navigation.navigate('ChatStack')}
          onNotiPress={() => navigation.navigate('AppNotification')}
        />
      }
      contentContainerStyle={{paddingBottom: 150}}>
      <View style={{flex: 1}}>
        <MyText
          size={FONT_SIZE['2xl']}
          bold={FONT_WEIGHT.bold}
          style={{lineHeight: 45, marginTop: 10}}>
          Welcome, to our center for eco-friendly living 🛒
        </MyText>
        {/* Search */}

        {isAuthenticated && (
          <SearchBox
            onFilterBtnPress={() => {
              navigation.navigate('SearchFilter');
            }}
            disabledOnPress={() => {
              // @ts-ignore
              navigation.navigate('SearchTab');
            }}
          />
        )}
        {/* Options */}
        <OptionsList />
        <RenderProducts />
      </View>
    </MainLayout>
  );
};

export default HomeScreen;
