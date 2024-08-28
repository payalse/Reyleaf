import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import MainHeader from '../../../components/header/MainHeader';
import {COLORS, FONT_WEIGHT, hp} from '../../../styles';
import {MyText} from '../../../components/MyText';
import OrderStatus from '../../../components/OrderStatus';
import {api_getSellerOrders} from '../../../api/order';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {OrderType} from '../VendorHomeScreen/AllList';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {useIsFocused} from '@react-navigation/native';

type OrderStatus = {
  status: 'Packed' | 'Accepted' | 'Dispatched' | 'Completed' | 'Cancelled';
};

const pendingData: OrderStatus[] = [
  {
    status: 'Packed',
  },
  {
    status: 'Accepted',
  },
  {
    status: 'Dispatched',
  },
  {
    status: 'Accepted',
  },
  {
    status: 'Accepted',
  },
];

const completedData: OrderStatus[] = [
  {
    status: 'Completed',
  },
  {
    status: 'Completed',
  },
  {
    status: 'Cancelled',
  },
  {
    status: 'Completed',
  },
  {
    status: 'Completed',
  },
];

const PendingList = () => {
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getSellerOrders(token!);
      console.log(res);
      setOrders(res.data.pending);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestApi();
  }, []);

  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      <FlatList
        data={[...orders, ...orders]}
        renderItem={({item}) => {
          let statusBgColor = '';
          let statusTextColor = '';

          if (item.status === 'Accepted') {
            statusBgColor = COLORS.greenDark;
          }
          if (item.status === 'Packed') {
            statusBgColor = 'orange';
            statusTextColor = COLORS.black;
          }
          if (item.status === 'Dispatched') {
            statusBgColor = 'gold';
            statusTextColor = COLORS.black;
          }
          return (
            <OrderStatus
              date={item.createdAt}
              numberOfItems={item.items.length}
              orderId={item.orderId}
              total={item.totalAmount}
              isActionNeeded={false}
              statusText={item.status}
              statusBgColor={statusBgColor}
              statusTextColor={statusTextColor}
            />
          );
        }}
      />
    </React.Fragment>
  );
};

const CompletedList = () => {
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getSellerOrders(token!);
      console.log(res);
      // setOrders(res.data.pending)
      setOrders(res.data.completed);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestApi();
  }, []);

  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      <FlatList
        data={orders}
        renderItem={({item}) => {
          let statusBgColor = '';
          let statusTextColor = '';

          if (item.status === 'Completed') {
            statusBgColor = COLORS.greenDark;
          }
          if (item.status === 'Packed') {
            statusBgColor = 'orange';
            statusTextColor = COLORS.black;
          }
          if (item.status === 'Dispatched') {
            statusBgColor = 'gold';
            statusTextColor = COLORS.black;
          }
          if (item.status === 'Cancelled') {
            statusBgColor = COLORS.red;
            statusTextColor = COLORS.white;
          }
          return (
            <OrderStatus
              date={item.createdAt}
              numberOfItems={item.items.length}
              orderId={item.orderId}
              total={item.totalAmount}
              isActionNeeded={false}
              statusText={item.status}
              statusBgColor={statusBgColor}
              statusTextColor={statusTextColor}
            />
          );
        }}
      />
    </React.Fragment>
  );
};

const Tabs = ['Pending Order', 'Completed Order'];
const AllOrderScreen = () => {
  const [activeTab, setActiveTab] = useState(Tabs[0]);
  const isFocuse = useIsFocused();
  useEffect(() => {
    const temp = activeTab;
    setActiveTab(() => '');
    setTimeout(() => setActiveTab(() => temp), 0);
  }, [isFocuse]);

  return (
    <MainLayout scrollEnabled={false} headerComp={<MainHeader />}>
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingHorizontal: 8,
          borderRadius: 30,
          paddingVertical: 8,
          flexDirection: 'row',
          gap: 15,
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

      <View style={{height: hp(100), paddingBottom: hp(10)}}>
        {activeTab === Tabs[0] && <PendingList />}
        {activeTab === Tabs[1] && <CompletedList />}
      </View>
    </MainLayout>
  );
};

export default AllOrderScreen;

const styles = StyleSheet.create({});
