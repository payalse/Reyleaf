import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import EventItem from './EventItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {EventStackParams} from '../../../naviagtion/types';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {api_getEvents, api_getEventsByDate} from '../../../api/event';
import FullScreenLoader from '../../../components/FullScreenLoader';
import moment from 'moment';
import {MyText} from '../../../components/MyText';

const AllEventList = ({isFocused}: {isFocused: boolean}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EventStackParams>>();
  const {activeEventDate} = useSelector((s: RootState) => s.event);
  const {token} = useSelector((s: RootState) => s.auth);
  const [events, setEvents] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const res: any = await api_getEvents(token!);
      console.log(res);
      setEvents(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getEventByDate = async (date: string) => {
    try {
      setEvents([]);
      setLoading(true);
      const res: any = await api_getEventsByDate(token!, date);
      setEvents(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, [isFocused]);

  useEffect(() => {
    getEventByDate(activeEventDate);
  }, [activeEventDate]);

  return (
    <View style={{marginTop: 20}}>
      {loading && <FullScreenLoader />}

      {events.length ? (
        events.map((item: any) => {
          return (
            <EventItem
              onPress={() => {
                navigation.navigate('EventDetail', {
                  id: item._id,
                  isAttending: false,
                });
              }}
              key={item?._id}
              category={item?.category}
              des={item?.description}
              title={item?.title}
              image={item?.picture}
              date={
                item?.eventDate
                  ? moment(item?.eventDate).format('DD MMM, YYYY')
                  : ''
              }
            />
          );
        })
      ) : (
        <View>
          <MyText center> No Event Found </MyText>
        </View>
      )}
    </View>
  );
};

export default AllEventList;
