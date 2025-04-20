import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { MyText } from '../../../components/MyText';
import { COLORS, FONT_WEIGHT } from '../../../styles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OrderStackParams } from '../../../naviagtion/DrawerNavigator';
import { api_getInvoice, api_getMyOrders } from '../../../api/order';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { GetMyOrderResponse } from '../../../types/apiResponse';
import { OrderType } from '../../../types';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import OrderCardList from '../../../components/OrderCardList';

const Tabs = ['Pending', 'Completed'];

const MyOrdersScreen = () => {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<OrderStackParams>>();
  const { token } = useSelector((s: RootState) => s.auth);
  const [activeTab, setActiveTab] = useState(Tabs[0]);
  const [pendingOrders, setPendingOrders] = useState<OrderType[]>([]);
  const [completedOrders, setCompletedOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);

  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getMyOrders(token!)) as GetMyOrderResponse;
      // console.log(res);
      setPendingOrders(res?.data?.pending || []);
      setCompletedOrders(res?.data?.completed || []);
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
      // console.log(res);
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
      contentContainerStyle={{ flex: 1 }}
      scrollEnabled={false}
      headerComp={
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{ left: 0 }}
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

      {/* {activeTab === Tabs[0] && <PendingList data={pendingOrders} />}
      {activeTab === Tabs[1] && (
        <CompletedList
          productList={completedOrders}
          downloadInvoice={download}
        />
      )} */}

      {activeTab === 'Pending' ? (
        <OrderCardList orders={pendingOrders} type='pending' />
      ) : (
        <OrderCardList
          orders={completedOrders}
          type="completed"
          downloadInvoice={download}
        />
      )}
    </MainLayout>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({});
