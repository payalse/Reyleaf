import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import OrderStatus from '../../../components/OrderStatus';
import {COLORS} from '../../../styles';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {api_getSellerHomeOrders} from '../../../api/order';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {OrderType} from './AllList';
const data: {type: 'Accepted' | 'Dispatched' | ''}[] = [
  {
    type: '',
  },
  {
    type: 'Accepted',
  },
  {
    type: 'Dispatched',
  },
  {
    type: '',
  },
  {
    type: 'Accepted',
  },
  {
    type: 'Accepted',
  },
  {
    type: 'Dispatched',
  },
  {
    type: 'Dispatched',
  },
  {
    type: 'Accepted',
  },
];

const DispatchedList = ({isFocused}: {isFocused: any}) => {
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [dispatchedOrders, setDispatchedOrders] = useState<OrderType[]>([]);

  console.log(dispatchedOrders, 'DispatchedOrders');
  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getSellerHomeOrders(token!);
      console.log(res, 'here');
      setDispatchedOrders(res.data.dispatched);
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
    <View style={{gap: 20, marginVertical: 20, paddingBottom: 150}}>
      {dispatchedOrders.map((item, index) => {
        return (
          <OrderStatus
            isActionNeeded={false}
            orderId={item.orderId}
            date={item.createdAt}
            total={item.totalAmount}
            numberOfItems={item.items.length}
            key={index}
            statusBgColor={COLORS.black}
            statusTextColor={COLORS.black}
            statusText={item.status}
          />
        );
      })}
    </View>
  );
};

export default DispatchedList;

const styles = StyleSheet.create({});
