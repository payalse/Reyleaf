import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { MyText } from '../../../components/MyText';
import UnblockSvg from '../../../../assets/svg/icons/reqReject.svg';
import AcceptSvg from '../../../../assets/svg/icons/reqAccept.svg';
import { FriendSearch } from '.';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { useIsFocused, useNavigationState } from '@react-navigation/native';
import {
  api_fiendSuggessions,
  api_getMyfiends,
  api_RecivedRequested,
  api_requestAcceptReject,
} from '../../../api/friends';
import { Touchable } from 'react-native';
import { BUILD_IMAGE_URL } from '../../../api';
import {
  blockedList,
  myFriendsList,
  requestsList,
  suggestedList,
} from '../../../redux/features/friends/friendsSlice';
const RequestedList = () => {
  const navigationState = useNavigationState(state => state);
  console.log(navigationState, 'navigationState');

  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((s: RootState) => s.auth);
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const { requested } = useSelector((s: RootState) => s.friend);

  const requestApi = async () => {
    try {
      const res: any = await api_RecivedRequested(token!);
      dispatch(requestsList(res?.data));
      setFilteredData(res?.data);
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
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedList = async () => {
    try {
      setData([]);
      const res: any = await api_fiendSuggessions(token!);
      dispatch(suggestedList(res?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
      const newData = requested.filter(
        (item: any) =>
          item.fullname.toLowerCase().includes(text.toLowerCase()) ||
          item.followingId?.email.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(newData);
    } else {
      setFilteredData(requested);
      setSearchString('');
    }
  };

  useEffect(() => {
    if (navigationState.index == 2) {
      !requested?.length && setLoading(true);
      setFilteredData(requested);
      requestApi();
      getMyFriends();
      getSuggestedList();
    }
  }, [navigationState.index]);

  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      <FriendSearch value={searchString} onChangeText={handleSearch} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 8,
                marginBottom: 20,
                borderRadius: 10,
                flexDirection: 'row',
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  alignSelf: 'center',
                  // backgroundColor: COLORS.grey,
                }}
              >
                {item?.picture ? (
                  <Image
                    source={{ uri: BUILD_IMAGE_URL(item?.picture) }}
                    style={StyleSheet.absoluteFillObject}
                  />
                ) : (
                  <Image
                    source={{
                      uri: 'https://avatar.iran.liara.run/public/boy?username=green',
                    }}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
              </View>

              <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
                  {item?.userId?.fullname}
                </MyText>
                <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                  {item?.userId?.email}
                </MyText>
              </View>
              <View style={{ gap: 5 }}>
                <TouchableOpacity
                  onPress={() =>
                    handleFollowUnfollow(item?.userId?._id, 'accept')
                  }
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
                  }}
                >
                  <AcceptSvg />
                  <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                    Accept
                  </MyText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleFollowUnfollow(item?.userId?._id, 'reject')
                  }
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
                  }}
                >
                  <UnblockSvg />
                  <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                    Reject
                  </MyText>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </React.Fragment>
  );
};

export default RequestedList;

const styles = StyleSheet.create({});
