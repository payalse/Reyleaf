import {
  FlatList,
  Image,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { MyText } from '../../../components/MyText';
import AcceptSvg from '../../../../assets/svg/icons/reqAccept.svg';
import { FriendSearch } from '.';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {
  api_cancelRequest,
  api_fiendSuggessions,
  api_friendfollowUnfollow,
  api_getBlocked,
  api_getMyfiends,
  api_reportOrBlock,
  api_searchSuggessions,
} from '../../../api/friends';
import { useAppAlert } from '../../../context/AppAlertContext';
import { useIsFocused, useNavigationState } from '@react-navigation/native';
import { BUILD_IMAGE_URL } from '../../../api';
import { Friend } from '../../../types';
import {
  blockedList,
  myFriendsList,
  suggestedList,
} from '../../../redux/features/friends/friendsSlice';

const SuggestedList = () => {
  const navigationState = useNavigationState(state => state);
  const [data, setData] = useState<Friend[]>([]);
  const [filterUser, setFilterUser] = useState<Friend[]>([]);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((s: RootState) => s.auth);
  const { suggested } = useSelector((s: RootState) => s.friend);

  const { showModal } = useAppAlert()!;

  const requestApi = async () => {
    try {
      const res: any = await api_fiendSuggessions(token!);
      dispatch(suggestedList(res?.data));
      setFilterUser(res?.data);
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (item: any) => {
    try {
      setLoading(true);
      item.status = 'pending';
      const res: any = await api_friendfollowUnfollow(token!, item?._id);
      showModal({ text: res?.message });
    } catch (error) {
      console.log(error);
    } finally {
      requestApi();
    }
  };

  const handleReportOrBlockPress = async (
    action: 'report' | 'block' | 'unblock',
    id: string,
  ) => {
    try {
      setLoading(true);
      const payload = {
        followingId: id,
        action,
      };
      const res: any = await api_reportOrBlock(token!, payload);
      requestApi();
      getMyFriends();
      getBlockedList();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelFollowRequest = async (item: any) => {
    try {
      setLoading(true);
      item.status = '';
      const res: any = await api_cancelRequest(token!, item?._id);
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
    } finally {
      setLoading(false);
    }
  };

  const getBlockedList = async () => {
    try {
      const res: any = await api_getBlocked(token!);
      dispatch(blockedList(res?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    if (text) {
      console.log('here');
      setSearchString(text);
      const newData = suggested.filter(
        item =>
          item.fullname.toLowerCase().includes(text.toLowerCase()) ||
          item.email.toLowerCase().includes(text.toLowerCase()),
      );
      setFilterUser(newData);
    } else {
      setFilterUser(suggested);
      setSearchString('');
    }
  };

  useEffect(() => {
    if (navigationState.index == 0) {
      !suggested?.length && setLoading(true);
      setFilterUser(suggested);
      requestApi();
      getMyFriends();
      getBlockedList();
    }
  }, [navigationState.index]);

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     const str = searchString.trim();
  //     if (str) {
  //       handleSearch(str);
  //     }
  //   }, 1000);

  //   return () => clearTimeout(getData);
  // }, [searchString]);

  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      <FriendSearch value={searchString} onChangeText={handleSearch} onFocus={handleSearch} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filterUser}
        renderItem={({ item }) => {
          // @ts-ignore
          const status = item?.status || '';

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
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  // backgroundColor: COLORS.grey,
                  overflow: 'hidden',
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
                  {item?.fullname || ''}
                </MyText>
                <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                  {item?.email}
                </MyText>
              </View>
              {status === '' && (
                <TouchableOpacity
                  onPress={() => handleFollow(item)}
                  style={{
                    backgroundColor: COLORS.greenDark,
                    borderRadius: 30,
                    paddingVertical: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 5,
                    width: 80,
                    alignSelf: 'center',
                  }}
                >
                  <AcceptSvg />
                  <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                    Follow
                  </MyText>
                </TouchableOpacity>
              )}
              {status === 'accepted' && (
                <TouchableOpacity
                  onPress={() => {
                    handleReportOrBlockPress('block', item?._id);
                  }}
                  style={{
                    backgroundColor: COLORS.red,
                    borderRadius: 30,
                    paddingVertical: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 5,
                    width: 80,
                    alignSelf: 'center',
                  }}
                >
                  <AcceptSvg />
                  <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                    Block
                  </MyText>
                </TouchableOpacity>
              )}
              {status === 'pending' && (
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'gold',
                      borderRadius: 30,
                      paddingVertical: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 5,
                      width: 80,
                      alignSelf: 'center',
                    }}
                  >
                    {/* <AcceptSvg /> */}
                    <MyText color={COLORS.black} size={FONT_SIZE.sm}>
                      Pending
                    </MyText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      cancelFollowRequest(item);
                    }}
                    style={{
                      backgroundColor: 'red',
                      borderRadius: 30,
                      paddingVertical: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 5,
                      width: 80,
                      alignSelf: 'center',
                      marginTop: 10,
                    }}
                  >
                    {/* <AcceptSvg /> */}
                    <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                      Cancel
                    </MyText>
                  </TouchableOpacity>
                </View>
              )}
              {status === 'blocked' && (
                <TouchableOpacity
                  onPress={() => {
                    handleReportOrBlockPress('unblock', item?._id);
                  }}
                  style={{
                    backgroundColor: COLORS.grey,
                    borderRadius: 30,
                    paddingVertical: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 5,
                    width: 80,
                    alignSelf: 'center',
                  }}
                >
                  <AcceptSvg />
                  <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                    UnBlock
                  </MyText>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </React.Fragment>
  );
};

export default SuggestedList;

const styles = StyleSheet.create({});
