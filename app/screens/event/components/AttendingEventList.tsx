import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import EventItem from './EventItem';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {EventStackParams} from '../../../naviagtion/types';
import {api_getJoinedEvents} from '../../../api/event';
import {RootState} from '../../../redux/store';
import {useSelector} from 'react-redux';
import FullScreenLoader from '../../../components/FullScreenLoader';
import moment from 'moment';

const AttendingEventList = ({isFocused}: {isFocused: boolean}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EventStackParams>>();
  const {token} = useSelector((s: RootState) => s.auth);
  const [events, setEvents] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const res: any = await api_getJoinedEvents(token!);
      console.log(res);
      setEvents(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyEvents();
  }, [isFocused]);
  return (
    <View style={{marginTop: 20}}>
      {loading && <FullScreenLoader />}
      {events.map((item: any) => {
        return (
          <EventItem
            onPress={() => {
              navigation.navigate('EventDetail', {
                id: item?._id,
                isAttending: true,
              });
            }}
            image={item?.picture}
            key={item?._id}
            category={item?.category}
            des={item?.description}
            title={item?.title}
            date={moment(item?.eventDate).format('DD MM YYYY')}
            isAttending
          />
        );
      })}
    </View>
  );
};

export default AttendingEventList;
