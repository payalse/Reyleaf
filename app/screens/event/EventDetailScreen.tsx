import {
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {EventStackParams} from '../../naviagtion/types';
import {BORDER_RADIUS, COLORS, D, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MyText} from '../../components/MyText';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import MyButton from '../../components/buttons/MyButton';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {api_getEventDetails, api_joinOrLeaveEvent} from '../../api/event';
import FullScreenLoader from '../../components/FullScreenLoader';
import moment from 'moment';
import {useAppAlert} from '../../context/AppAlertContext';
import {BUILD_IMAGE_URL} from '../../api';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../../utils/sizeNormalization';
import LocationPin from '../../../assets/svg/icons/locationPin.svg';

const EventDetailScreen = () => {
  useHideBottomBar({});
  const route = useRoute<RouteProp<EventStackParams, 'EventDetail'>>();
  const {isAttending} = route.params;
  const navigation = useNavigation<any>();
  const {token} = useSelector((s: RootState) => s.auth);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const {showModal} = useAppAlert()!;

  const getEventDetail = async () => {
    try {
      setLoading(true);
      const res: any = await api_getEventDetails(token!, route.params.id);
      setEvent(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (action: 'join' | 'leave') => {
    try {
      setJoining(true);
      const res: any = await api_joinOrLeaveEvent(token!, {
        eventId: event?._id,
        action,
      });
      showModal({text: res?.message});
      navigation.goBack();
    } catch (error: any) {
      showModal({text: error?.message});
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    getEventDetail();
  }, []);

  if (loading) return <FullScreenLoader />;

  return (
    <View style={styles.root}>
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}>

      {/* Cover */}
      <View style={styles.cover}>
        {event?.picture ? (
          <Image
            source={{uri: BUILD_IMAGE_URL(event.picture)}}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="calendar" size={48} color={COLORS.white} />
          </View>
        )}
        <View style={styles.coverOverlay} />
        <SafeAreaView>
          <SecondaryHeader
            title="Event Detail"
            onBack={navigation.goBack}
            backIconColor={COLORS.black}
            backIconBgColor={COLORS.white}
            titleColor={COLORS.white}
          />
        </SafeAreaView>
      </View>

      {/* Details card */}
      <View style={styles.details}>

        {/* Title + category row */}
        <View style={styles.titleRow}>
          <MyText
            bold={FONT_WEIGHT.bold}
            size={FONT_SIZE['1.5xl']}
            color={COLORS.darkBrown}
            style={styles.titleText}>
            {event?.title}
          </MyText>
          {event?.category ? (
            <View style={styles.categoryBadge}>
              <MyText size={FONT_SIZE.xs} bold={FONT_WEIGHT.semibold} color={COLORS.darkBrown}>
                {event.category}
              </MyText>
            </View>
          ) : null}
        </View>

        {/* Date */}
        <View style={styles.metaRow}>
          <AntDesign name="clockcircle" size={fontPixel(15)} color={COLORS.greenDark} />
          <MyText size={FONT_SIZE.sm} color={COLORS.greenDark} style={styles.metaText}>
            {event?.eventDate
              ? moment(event.eventDate).format('DD MMM, YYYY')
              : '—'}
          </MyText>
        </View>

        {/* Address */}
        {event?.address ? (
          <View style={styles.metaRow}>
            <LocationPin width={fontPixel(15)} />
            <MyText size={FONT_SIZE.sm} color={COLORS.greenDark} style={styles.metaText}>
              {event.address}
            </MyText>
          </View>
        ) : null}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Description */}
        <MyText
          size={FONT_SIZE.base}
          bold={FONT_WEIGHT.semibold}
          color={COLORS.darkBrown}
          style={styles.sectionLabel}>
          Description
        </MyText>
        <MyText style={styles.description} color={COLORS.grey}>
          {event?.description}
        </MyText>

        {/* Action button */}
        {isAttending ? (
          <MyButton
            onPress={() => handleJoin('leave')}
            text={joining ? 'Leaving…' : 'Not Attending'}
            containerStyle={styles.leaveBtn}
            textStyle={{color: '#B91C1C', fontWeight: FONT_WEIGHT.semibold}}
          />
        ) : (
          <PrimaryBtn
            loading={joining}
            text="Join Event"
            onPress={() => handleJoin('join')}
          />
        )}
      </View>
    </ScrollView>
    </View>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    flexGrow: 1,
  },
  cover: {
    height: D.height * 0.38,
    backgroundColor: COLORS.darkBrown,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  coverPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  details: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: pixelSizeHorizontal(20),
    paddingTop: pixelSizeVertical(28),
    paddingBottom: pixelSizeVertical(40),
    minHeight: D.height,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: pixelSizeVertical(14),
  },
  titleText: {
    flex: 1,
    marginRight: pixelSizeHorizontal(12),
  },
  categoryBadge: {
    backgroundColor: '#E8F5F0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.greenDark,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pixelSizeVertical(10),
    gap: pixelSizeHorizontal(8),
  },
  metaText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightgrey2,
    marginVertical: pixelSizeVertical(16),
  },
  sectionLabel: {
    marginBottom: pixelSizeVertical(8),
  },
  description: {
    lineHeight: 24,
    marginBottom: pixelSizeVertical(28),
  },
  leaveBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: BORDER_RADIUS.Circle,
  },
});
