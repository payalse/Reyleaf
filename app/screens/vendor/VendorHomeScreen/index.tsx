import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import MainHeader from '../../../components/header/MainHeader';
import { MyText } from '../../../components/MyText';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import OrderChart from './components/OrderChart';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FlatList } from 'react-native';
import AllList from './AllList';
import AcceptedList from './AcceptedList';
import DispatchedList from './DispatchedList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VendorHomeStackParams } from '../../../naviagtion/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Rating } from 'react-native-ratings';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {
  api_getSellersIncomeGraph,
  api_getSellersOrders,
  api_getSellersReviews,
} from '../../../api/seller';

const VendorHomeScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const navigaion =
    useNavigation<NativeStackNavigationProp<VendorHomeStackParams>>();
  const isFocused = useIsFocused();

  const { token, user } = useSelector((s: RootState) => s.auth);
  console.log(user);
  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState({
    totalOrdersReceived: 0,
    totalOrdersDelivered: 0,
  });
  const [income, setAllIncome] = useState({
    totalIncome: 0,
    todayIncome: 0,
  });

  const [reviews, setAllReviews] = useState({
    totalReviews: 0,
    averageRating: 0,
  });

  const requestApi = async () => {
    try {
      setLoading(true);
      const incomeData: any = await api_getSellersIncomeGraph(token!);
      const orderData: any = await api_getSellersOrders(token!);
      const reviewsData: any = await api_getSellersReviews(token!);
      setAllOrders(orderData?.data);
      setAllIncome(incomeData?.data);
      setAllReviews(reviewsData?.data)
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const temp = activeTab;
    requestApi();
    setActiveTab(() => '');
    setTimeout(() => {
      setActiveTab(() => temp);
    }, 0);
  }, [isFocused]);

  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      <MainLayout
        headerComp={
          <MainHeader
            onMessagePress={() => {
              navigaion.navigate('ChatStack');
            }}
            onNotiPress={() => {
              navigaion.navigate('AppNotification');
            }}
          />
        }
      >
        <View style={styles.mainContainer}>
          <MyText size={FONT_SIZE['2xl']} bold={FONT_WEIGHT.bold}>
            Let's manage all of your Orders, {user?.fullname} 🎯
          </MyText>
          {/* Charts */}
          <View style={styles.chartContainer}>
            <View style={styles.chartLeftView}>
              <OrderChart totalOrders={allOrders?.totalOrdersReceived || 100} completedOrders={allOrders?.totalOrdersDelivered || 0} />
              <View>
                <MyText center size={FONT_SIZE.sm} color={COLORS.grey}>
                  Total Order Received
                </MyText>
                <MyText center bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
                  {allOrders?.totalOrdersReceived || 0}
                </MyText>
              </View>
              <View>
                <MyText center size={FONT_SIZE.sm} color={COLORS.grey}>
                  Total Order Deliverd
                </MyText>
                <MyText center bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
                  {allOrders?.totalOrdersDelivered || 0}
                </MyText>
              </View>
            </View>
            <View style={styles.chartRightView}>
              <View style={styles.chartRightTopView}>
                <View style={{ gap: 5 }}>
                  <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
                    {reviews?.totalReviews}
                  </MyText>
                  <MyText color={COLORS.grey} size={FONT_SIZE.sm}>
                    Total Review
                  </MyText>
                </View>
                <View style={{ gap: 5 }}>
                <Rating style={{marginRight: 'auto'}} type="star" ratingCount={5} imageSize={15} readonly startingValue={reviews?.averageRating} />
                  <MyText color={COLORS.grey} size={FONT_SIZE.sm}>
                  {reviews?.averageRating} Rating
                  </MyText>
                </View>
              </View>
              <View style={styles.chartRightBottomView}>
                <Image source={require('../../../../assets/img/icons/income.png')}
                style={{ width: 40, height: 40, borderRadius: 10 }}
                resizeMode="cover" />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View>
                    <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
                      ${income?.totalIncome || 0}
                    </MyText>
                    <MyText color={COLORS.grey} size={FONT_SIZE.sm}>
                      Total Income
                    </MyText>
                  </View>
                  <View>
                    <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
                      ${income?.todayIncome || 0}
                    </MyText>
                    <MyText color={COLORS.grey} size={FONT_SIZE.sm}>
                      Today
                    </MyText>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/*  Orders */}
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
              Latest Orders
            </MyText>
            <MyText size={FONT_SIZE.sm}>View all</MyText>
          </View>
          <FlatList
            data={['All', 'Accepted', 'Dispatched']}
            horizontal
            contentContainerStyle={{ marginVertical: 10 }}
            renderItem={({ item }) => {
              const isActive = item === activeTab;
              return (
                <TouchableOpacity
                  onPress={() => setActiveTab(item)}
                  style={{
                    backgroundColor: isActive
                      ? COLORS.darkBrown
                      : COLORS.lightgrey,
                    paddingHorizontal: 20,
                    marginRight: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}
                >
                  <MyText color={isActive ? COLORS.white : COLORS.grey}>
                    {item}
                  </MyText>
                </TouchableOpacity>
              );
            }}
          />

          {activeTab === 'All' && <AllList isFocused={isFocused} />}
          {activeTab === 'Accepted' && <AcceptedList isFocused={isFocused} />}
          {activeTab === 'Dispatched' && (
            <DispatchedList isFocused={isFocused} />
          )}
        </View>
      </MainLayout>
    </React.Fragment>
  );
};

export default VendorHomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 10,
  },
  chartContainer: {
    // height: hp(35),
    marginTop: 20,
    flexDirection: 'row',
    gap: 20,
  },
  chartLeftView: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    gap: 10,
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  chartRightView: {
    flex: 1,
    gap: 20,
  },
  chartRightTopView: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  chartRightBottomView: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
});
