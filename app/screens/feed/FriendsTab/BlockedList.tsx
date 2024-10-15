import {
  FlatList,
  Image,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import UnblockSvg from '../../../../assets/svg/icons/reqReject.svg';
import {FriendSearch} from '.';
import {string} from 'yup';
import {AppDispatch, RootState} from '../../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {useIsFocused, useNavigationState} from '@react-navigation/native';
import {
  api_fiendSuggessions,
  api_getBlocked,
  api_getMyfiends,
  api_reportOrBlock,
} from '../../../api/friends';
import {
  blockedList,
  myFriendsList,
  suggestedList,
} from '../../../redux/features/friends/friendsSlice';
import {BUILD_IMAGE_URL} from '../../../api';

const BlockedList = () => {
  const navigationState = useNavigationState(state => state);
  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const {blocked} = useSelector((s: RootState) => s.friend);

  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getBlocked(token!);
      dispatch(blockedList(res?.data));
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
      console.log(res, 'api_reportOrBlock');
      requestApi();
      getMyFriends();
      getSuggestedList();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    if (text) {
      setSearchString(text);
      const newData = blocked.filter(
        (item: any) =>
          item.fullname.toLowerCase().includes(text.toLowerCase()) ||
          item.email.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(newData);
    } else {
      setFilteredData(blocked);
      setSearchString('');
    }
  };

  useEffect(() => {
    if (navigationState.index == 3) {
      !blocked?.length && setLoading(true);
      setFilteredData(blocked);
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
        renderItem={({item}) => {
          return (
            <View style={styles.wrapper}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  alignSelf: 'center',
                  // backgroundColor: COLORS.grey,
                }}>
                {item?.picture ? (
                  <Image
                    source={{uri: BUILD_IMAGE_URL(item?.picture)}}
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
              <View style={{flex: 1, justifyContent: 'space-evenly'}}>
                <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
                  {item?.fullname}
                </MyText>
                <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                  {item?.email}
                </MyText>
              </View>
              <TouchableOpacity
                style={styles.unblockView}
                onPress={() => {
                  handleReportOrBlockPress('unblock', item?._id);
                }}>
                <UnblockSvg />
                <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                  Unblock
                </MyText>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </React.Fragment>
  );
};

export default BlockedList;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    padding: 8,
    marginBottom: 20,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.grey,
  },
  unblockView: {
    backgroundColor: COLORS.greenDark,
    borderRadius: 30,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    width: 90,
    alignSelf: 'center',
  },
});
