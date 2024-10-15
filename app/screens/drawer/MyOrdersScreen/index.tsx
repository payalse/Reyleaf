import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {OrderStackParams} from '../../../naviagtion/DrawerNavigator';
import IconOrderSvg from '../../../../assets/svg/icons/orderCompleted.svg';
import {api_getInvoice, api_getMyOrders} from '../../../api/order';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {GetMyOrderResponse} from '../../../types/apiResponse';
import {OrderType} from '../../../types';
import moment from 'moment';
import {Rating} from 'react-native-ratings';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const PendingList = ({data}: any) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();

  return (
    <FlatList
      data={data}
      contentContainerStyle={{
        gap: 20,
        marginTop: 30,
        paddingBottom: 50,
      }}
      renderItem={({item}: any) => {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OrderDetail', {orderId: item?.orderId})
            }
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 20,
              gap: 10,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.semibold}>
                Order ID - {item?.orderId}
              </MyText>
              <View
                style={{
                  backgroundColor: COLORS.darkBrown,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                }}>
                <MyText
                  size={FONT_SIZE.sm}
                  bold={FONT_WEIGHT.semibold}
                  color={COLORS.white}>
                  {item?.items.length} Order Items
                </MyText>
              </View>
            </View>

            <View style={{flexDirection: 'row', gap: 5}}>
              <AntDesign
                name="clockcircle"
                size={FONT_SIZE.base}
                color={COLORS.grey}
              />
              <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                {/* 15 Dec, 2023 10:35 AM */}
                {moment(item?.createdAt).format('MMMM Do, YYYY h:mm A')}
              </MyText>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <MyText size={FONT_SIZE.sm}>Order total</MyText>
              <MyText size={FONT_SIZE.sm} bold={FONT_WEIGHT.semibold}>
                ${item?.totalAmount}
              </MyText>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <MyText size={FONT_SIZE.sm}>Status</MyText>
              <MyText size={FONT_SIZE.sm} bold={FONT_WEIGHT.semibold}>
                {/* Order Dispatch */}
                {item?.status}
              </MyText>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

type Props = {
  productList?: any;
  downloadInvoice: (id: string) => void;
};
const CompletedList = ({productList, downloadInvoice}: Props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();

  return (
    <FlatList
      data={productList}
      contentContainerStyle={{
        gap: 20,
        marginTop: 30,
        paddingBottom: 50,
      }}
      renderItem={({item}: any) => {
        const hasReview = item?.rating;
        return (
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 20,
              gap: 10,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.semibold}>
                Order ID - {item?.orderId}
              </MyText>
              <View
                style={{
                  backgroundColor: COLORS.darkBrown,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                }}>
                <MyText
                  size={FONT_SIZE.sm}
                  bold={FONT_WEIGHT.semibold}
                  color={COLORS.white}>
                  {item?.items.length} Order Items
                </MyText>
              </View>
            </View>

            <View style={{flexDirection: 'row', gap: 5}}>
              <AntDesign
                name="clockcircle"
                size={FONT_SIZE.base}
                color={COLORS.grey}
              />
              <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                {moment(item?.createdAt).format('MMMM Do, YYYY h:mm A')}
              </MyText>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <MyText size={FONT_SIZE.sm}>Order total</MyText>
              <MyText size={FONT_SIZE.sm} bold={FONT_WEIGHT.semibold}>
                $ {item?.totalAmount}
              </MyText>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <MyText size={FONT_SIZE.sm}>Status</MyText>
              <MyText size={FONT_SIZE.sm} bold={FONT_WEIGHT.semibold}>
                {item?.status}
              </MyText>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {hasReview ? (
                <View>
                  <MyText size={FONT_SIZE.sm}>Order Review & Rating</MyText>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                      marginTop: 5,
                    }}>
                    <Rating
                      type="star"
                      ratingCount={item?.rating}
                      imageSize={20}
                      readonly
                    />
                    <MyText size={FONT_SIZE.sm}>{item?.rating}</MyText>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('OrderReview', {orderId: item?._id});
                  }}
                  style={{
                    backgroundColor: 'rgba(6, 95, 70, 0.15)',
                    height: 40,
                    flex: 1,
                    marginRight: 20,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 10,
                    borderWidth: 2,
                    borderColor: COLORS.greenDark,
                  }}>
                  <AntDesign
                    name="star"
                    size={FONT_SIZE.base}
                    color={COLORS.greenDark}
                  />
                  <MyText size={FONT_SIZE.sm} color={COLORS.greenDark}>
                    Write your Review
                  </MyText>
                </TouchableOpacity>
              )}
              <View
                style={{
                  backgroundColor: COLORS.darkBrown,
                  width: 40,
                  height: 40,
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={() => downloadInvoice(item?._id)}>
                  <IconOrderSvg />
                </TouchableOpacity>
                {/* <Entypo
                  name={'box'}
                  size={FONT_SIZE.base}
                  color={COLORS.white}
                /> */}
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};

const Tabs = ['Pending', 'Completed'];
const MyOrdersScreen = () => {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();
  const {token} = useSelector((s: RootState) => s.auth);
  const [activeTab, setActiveTab] = useState(Tabs[0]);
  const [pendingOrders, setPendingOrders] = useState<OrderType[]>([]);
  const [completedOrders, setCompletedOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getMyOrders(token!)) as GetMyOrderResponse;
      console.log(res);
      setPendingOrders(res?.data?.pending);
      setCompletedOrders(res?.data?.completed);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const download = async (orderId: string) => {
    try {
      setLoading(true);
      const res: any = await api_getInvoice(token!, orderId);
      console.log(res);
      const invoiceUrl = res?.data;

      // Download the PDF file
      const downloadPath = `${RNFS.DocumentDirectoryPath}/invoice-${orderId}.pdf`;
      const downloadResult = await RNFS.downloadFile({
        fromUrl: invoiceUrl,
        toFile: downloadPath,
      }).promise;

      setLoading(false);
      if (downloadResult.statusCode === 200) {
        // Open the PDF file
        await FileViewer.open(downloadPath);
      } else {
        throw new Error('Failed to download invoice');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestApi();
  }, [isFocused]);

  if (loading) {
    return <FullScreenLoader />;
  }
  return (
    <MainLayout
      contentContainerStyle={{flex: 1}}
      scrollEnabled={false}
      headerComp={
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{left: 0}}
          title="My Orders"
        />
      }>
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingHorizontal: 8,
          borderRadius: 30,
          paddingVertical: 8,
          flexDirection: 'row',
          gap: 15,
          marginTop: 20,
        }}>
        {Tabs.map(tab => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              onPress={() => setActiveTab(tab)}
              key={tab}
              style={{
                flex: 1,
                backgroundColor: isActive ? COLORS.greenDark : COLORS.white,
                borderRadius: 30,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MyText
                bold={isActive ? FONT_WEIGHT.bold : FONT_WEIGHT.normal}
                center
                color={isActive ? COLORS.white : COLORS.grey}>
                {tab}
              </MyText>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab === Tabs[0] && <PendingList data={pendingOrders} />}
      {activeTab === Tabs[1] && (
        <CompletedList
          productList={completedOrders}
          downloadInvoice={download}
        />
      )}
    </MainLayout>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({});
