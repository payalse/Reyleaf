import {
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {EventStackParams} from '../../naviagtion/types';
import {COLORS, D, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {MyText} from '../../components/MyText';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import MyButton from '../../components/buttons/MyButton';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import LocationPin from '../../../assets/svg/icons/locationPin.svg';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {api_getEventDetails, api_joinOrLeaveEvent} from '../../api/event';
import FullScreenLoader from '../../components/FullScreenLoader';
import moment from 'moment';
import {useAppAlert} from '../../context/AppAlertContext';
const IMAGE_URI =
  'https://media.istockphoto.com/id/1421993924/photo/creative-writing-at-home-by-female-hands-enjoying-a-calm-peaceful-day-off-indoors-woman.webp?b=1&s=170667a&w=0&k=20&c=GstM6PeYECR0ftSIk-60TIO2b6JUhkMG3tlUhFDpR8k=';
const EventDetailScreen = () => {
  useHideBottomBar({});
  const route = useRoute<RouteProp<EventStackParams, 'EventDetail'>>();
  const {isAttending} = route.params;
  const navigation = useNavigation();
  const {token} = useSelector((s: RootState) => s.auth);
  const [event, setEvent] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const {showModal} = useAppAlert()!;
  const getEventDetail = async () => {
    try {
      setLoading(true);
      const res: any = await api_getEventDetails(token!, route.params.id);
      console.log(res);
      setEvent(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleJoin = async (action: 'join' | 'leave') => {
    try {
      setLoading(true);
      const payload = {
        eventId: event?._id,
        action: action,
      };
      console.log(event);
      const res: any = await api_joinOrLeaveEvent(token!, payload);
      console.log(res);
      showModal({text: res?.message});
      navigation.goBack();
    } catch (error: any) {
      console.log(error);
      showModal({text: error?.message});
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: false,
    });
    getEventDetail();
  }, []);
  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{
        paddingBottom: 200,
        backgroundColor: COLORS.white,
      }}>
      {loading && <FullScreenLoader />}
      <View style={{height: D.height * 0.45, backgroundColor: COLORS.grey}}>
        <SafeAreaView>
          <SecondaryHeader
            title="Event Detail"
            onBack={navigation.goBack}
            backIconColor={COLORS.black}
            backIconBgColor={COLORS.white}
            backTextColor={COLORS.white}
            titleColor={COLORS.white}
          />
        </SafeAreaView>
        <Image
          style={{
            position: 'absolute',
            zIndex: -1,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            resizeMode: 'cover',
          }}
          source={{uri: IMAGE_URI}}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          marginTop: -30,
          position: 'relative',
          paddingTop: 40,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: -30,
            right: 50,
            width: 65,
            height: 65,
            borderRadius: 65,
            backgroundColor: COLORS.greenDark,
            borderColor: COLORS.grey,
            borderWidth: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Entypo name="share" color={COLORS.white} size={24} />
        </TouchableOpacity>
        <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
          {event?.title}
        </MyText>
        <View
          style={{
            marginTop: 10,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <MyText size={FONT_SIZE.sm}>{event?.category}</MyText>
          <View
            style={{
              backgroundColor: COLORS.darkBrown,
              paddingVertical: 8,
              paddingHorizontal: 8,
              borderRadius: 20,
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
            }}>
            <AntDesign name="clockcircle" size={15} color={COLORS.white} />
            <MyText size={FONT_SIZE.xs} color={COLORS.white}>
              {moment(event?.eventDate).format('DD MM YYYY')}
            </MyText>
          </View>
        </View>
        <View
          style={{
            marginVertical: 10,
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
          }}>
          <LocationPin width={FONT_SIZE.base} />
          <MyText size={FONT_SIZE.sm} color={COLORS.greenDark}>
            {event?.address}
          </MyText>
        </View>
        <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
          Description
        </MyText>
        <MyText
          style={{marginBottom: 30, marginTop: 10, lineHeight: 25}}
          color={COLORS.grey}>
          {event?.description}{' '}
        </MyText>

        {isAttending ? (
          <MyButton
            onPress={() => handleJoin('leave')}
            text="Not more Attending"
            containerStyle={{
              borderRadius: 30,
              borderColor: 'red',
              borderWidth: 1.2,
            }}
            textStyle={{color: 'red', fontWeight: FONT_WEIGHT.semibold}}
          />
        ) : (
          <PrimaryBtn
            text={'Join Event'}
            onPress={() => {
              handleJoin('join');
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default EventDetailScreen;
