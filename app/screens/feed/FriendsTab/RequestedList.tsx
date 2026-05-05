import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import UnblockSvg from '../../../../assets/svg/icons/reqReject.svg';
import AcceptSvg from '../../../../assets/svg/icons/reqAccept.svg';
import {FriendSearch} from '.';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../redux/store';
import {useIsFocused} from '@react-navigation/native';
import {
  api_cancelRequest,
  api_fiendSuggessions,
  api_getMyfiends,
  api_getSentRequests,
  api_RecivedRequested,
  api_requestAcceptReject,
} from '../../../api/friends';
import {BUILD_IMAGE_URL} from '../../../api';
import {
  myFriendsList,
  requestsList,
  sentRequestsList,
  suggestedList,
} from '../../../redux/features/friends/friendsSlice';
import { ShowAlert } from '../../../utils/alert';
import { ALERT_TYPE } from 'react-native-alert-notification';

type TabType = 'received' | 'sent';

const RequestedList = () => {
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [filteredReceived, setFilteredReceived] = useState<any[]>([]);
  const [filteredSent, setFilteredSent] = useState<any[]>([]);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const {defaultAvatar} = useSelector((s: RootState) => s.app);
  const dispatch = useDispatch<AppDispatch>();
  const {requested, sentRequests} = useSelector((s: RootState) => s.friend);

  const requestApi = async () => {
    try {
      const [receivedResult, sentResult] = await Promise.allSettled([
        api_RecivedRequested(token!),
        api_getSentRequests(token!),
      ]);
      if (receivedResult.status === 'fulfilled') {
        const data = (receivedResult.value as any)?.data ?? [];
        dispatch(requestsList(data));
        setFilteredReceived(data);
      }
      if (sentResult.status === 'fulfilled') {
        const data = (sentResult.value as any)?.data ?? [];
        dispatch(sentRequestsList(data));
        setFilteredSent(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelSentRequest = async (followingId: string) => {
    try {
      setLoading(true);
      await api_cancelRequest(token!, followingId);
      requestApi();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getMyFriends = async () => {
    try {
      const res: any = await api_getMyfiends(token!);
      dispatch(myFriendsList(res?.data));
    } catch (error) {
      console.log(error);
    }
  };

  const getSuggestedList = async () => {
    try {
      const res: any = await api_fiendSuggessions(token!);
      dispatch(suggestedList(res?.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowUnfollow = async (
    id: string,
    action: 'reject' | 'accept',
  ) => {
    try {
      setLoading(true);
      const payload = {
        followingId: id,
        action: action,
      };
      const res: any = await api_requestAcceptReject(token!, payload);
      console.log(res, 'api_requestAcceptReject res');
      ShowAlert({textBody: 'Request Updated!', type: ALERT_TYPE.SUCCESS});
      requestApi();
      getMyFriends();
      getSuggestedList();
    } catch (error) {
      console.log(error, 'api_requestAcceptReject err');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    if (text) {
      setSearchString(text);
      setFilteredReceived(
        requested.filter(
          (item: any) =>
            item.userId?.fullname?.toLowerCase().includes(text.toLowerCase()) ||
            item.userId?.email?.toLowerCase().includes(text.toLowerCase()),
        ),
      );
      setFilteredSent(
        sentRequests.filter(
          (item: any) =>
            item.followingId?.fullname?.toLowerCase().includes(text.toLowerCase()) ||
            item.followingId?.email?.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    } else {
      setFilteredReceived(requested);
      setFilteredSent(sentRequests);
      setSearchString('');
    }
  };

  useEffect(() => {
    if (isFocused) {
      !requested?.length && setLoading(true);
      setFilteredReceived(requested);
      setFilteredSent(sentRequests);
      requestApi();
      getMyFriends();
      getSuggestedList();
    }
  }, [isFocused]);

  const renderReceivedItem = ({item}: {item: any}) => (
    <View
      style={{
        backgroundColor: COLORS.white,
        padding: 8,
        marginBottom: 20,
        borderRadius: 10,
        flexDirection: 'row',
        gap: 10,
      }}>
      <View style={{width: 60, height: 60, borderRadius: 10, alignSelf: 'center'}}>
        <Image
          source={{
            uri: item?.userId?.picture
              ? BUILD_IMAGE_URL(item.userId.picture)
              : 'https://avatar.iran.liara.run/public/boy?username=green',
          }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={{flex: 1, justifyContent: 'space-evenly'}}>
        <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
          {item?.userId?.fullname}
        </MyText>
        <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
          {item?.userId?.email}
        </MyText>
      </View>
      <View style={{gap: 5}}>
        <TouchableOpacity
          onPress={() => handleFollowUnfollow(item?.userId?._id, 'accept')}
          style={{
            backgroundColor: COLORS.greenDark,
            borderRadius: 30,
            paddingVertical: 5,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 5,
            width: 90,
            alignSelf: 'center',
          }}>
          <AcceptSvg />
          <MyText color={COLORS.white} size={FONT_SIZE.sm}>Accept</MyText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleFollowUnfollow(item?.userId?._id, 'reject')}
          style={{
            backgroundColor: COLORS.red,
            borderRadius: 30,
            paddingVertical: 5,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 5,
            width: 90,
            alignSelf: 'center',
          }}>
          <UnblockSvg />
          <MyText color={COLORS.white} size={FONT_SIZE.sm}>Reject</MyText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSentItem = ({item}: {item: any}) => {
    const following = item?.followingId;
    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 8,
          marginBottom: 20,
          borderRadius: 10,
          flexDirection: 'row',
          gap: 10,
        }}>
        <View style={{width: 60, height: 60, borderRadius: 10, alignSelf: 'center'}}>
          {following?.picture ? (
            <Image
              source={{uri: BUILD_IMAGE_URL(following.picture)}}
              style={StyleSheet.absoluteFillObject}
            />
          ) : (
            <Image
              source={defaultAvatar.img}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 200,
              }}
            />
          )}
        </View>
        <View style={{flex: 1, justifyContent: 'space-evenly'}}>
          <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
            {following?.fullname}
          </MyText>
          <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            {following?.email}
          </MyText>
        </View>
        <TouchableOpacity
          onPress={() => cancelSentRequest(following?._id)}
          style={{
            backgroundColor: COLORS.red,
            borderRadius: 30,
            paddingVertical: 5,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 5,
            width: 90,
            alignSelf: 'center',
          }}>
          <UnblockSvg />
          <MyText color={COLORS.white} size={FONT_SIZE.sm}>Cancel</MyText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {loading && <FullScreenLoader />}
      <FriendSearch value={searchString} onChangeText={handleSearch} />
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'received' && styles.tabBtnActive]}
          onPress={() => setActiveTab('received')}>
          <MyText
            size={FONT_SIZE.sm}
            bold={FONT_WEIGHT.bold}
            color={activeTab === 'received' ? COLORS.white : COLORS.grey}>
            Received
          </MyText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'sent' && styles.tabBtnActive]}
          onPress={() => setActiveTab('sent')}>
          <MyText
            size={FONT_SIZE.sm}
            bold={FONT_WEIGHT.bold}
            color={activeTab === 'sent' ? COLORS.white : COLORS.grey}>
            Sent
          </MyText>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        data={activeTab === 'received' ? filteredReceived : filteredSent}
        keyExtractor={item => item._id}
        renderItem={activeTab === 'received' ? renderReceivedItem : renderSentItem}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </View>
  );
};

export default RequestedList;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
  },
  list: {
    flex: 1,
    minHeight: 0,
  },
  listContent: {
    paddingBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: COLORS.lightgrey2,
  },
  tabBtnActive: {
    backgroundColor: COLORS.greenDark,
  },
});
