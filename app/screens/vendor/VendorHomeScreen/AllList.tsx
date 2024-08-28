import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import OrderStatus from '../../../components/OrderStatus';
import {COLORS} from '../../../styles';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {api_getSellerHomeOrders} from '../../../api/order';
import FullScreenLoader from '../../../components/FullScreenLoader';
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

export type OrderType = {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    email: string;
    picture: string;
  };
  address: {
    _id: string;
    address: string;
    user: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
  items: {
    product: {
      _id: string;
      categoryId: {
        _id: string;
        name: string;
      };
      title: string;
      photos: [
        {
          url: string;
          _id: string;
        },
        {
          url: string;
          _id: string;
        },
        {
          url: string;
          _id: string;
        },
      ];
    };
    quantity: 5;
    _id: string;
  }[];
  totalAmount: string;
  status: string;
  createdAt: string;
};

const AllList = ({isFocused}: {isFocused: any}) => {
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState<OrderType[]>([]);
  console.log(allOrders, 'allOrders');
  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getSellerHomeOrders(token!);
      console.log(res, 'here');
      setAllOrders(res.data.all);
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
      {allOrders.map((item, index) => {
        console.log(item['status'], '0000');
        return (
          <OrderStatus
            isActionNeeded={item['status'] === 'pending'}
            orderId={item.orderId}
            date={item.createdAt}
            total={item.totalAmount}
            numberOfItems={item.items.length}
            key={index}
            // statusBgColor={item.type === 'Accepted' ? COLORS.greenDark : 'gold'}
            statusBgColor={COLORS.black}
            statusTextColor={
              COLORS.black
              //   item.type === 'Dispatched' ? COLORS.black : COLORS.white
            }
            statusText={item.status}
          />
        );
      })}
    </View>
  );
};

export default AllList;

const styles = StyleSheet.create({});
