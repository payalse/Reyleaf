import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT, hp, wp} from '../../../styles';
import {MyText} from '../../../components/MyText';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FriendSearch} from '.';
import Tooltip from 'react-native-walkthrough-tooltip';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {AppDispatch, RootState} from '../../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {
  api_getBlocked,
  api_getMyfiends,
  api_reportOrBlock,
} from '../../../api/friends';
import {BUILD_IMAGE_URL} from '../../../api';
import {
  useIsFocused,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FeedStackParams} from '../../../naviagtion/types';
import {
  blockedList,
  myFriendsList,
} from '../../../redux/features/friends/friendsSlice';

type ItemProps = {
  id: string;
  email: string;
  userId: string;
  name: string;
  picture: string;
  handleReportOrBlockPress: (action: 'report' | 'block', id: string) => void;
};
const Item = ({
  email,
  userId,
  name,
  picture,
  handleReportOrBlockPress,
}: ItemProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParams>>();
  const {mode, defaultAvatar} = useSelector((s: RootState) => s.app);
  const handleChatPress = async () => {
    // @ts-ignore
    navigation.navigate('ChatStack', {
      screen: 'Chat',
      params: {otherUserId: userId, fullname: name},
    });
  };
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
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 10,
        }}>
        {picture ? (
          <Image
            source={{uri: BUILD_IMAGE_URL(picture)}}
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
          {name}
        </MyText>
        <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
          {email}
        </MyText>
      </View>

      <TouchableOpacity
        onPress={handleChatPress}
        style={{
          backgroundColor: COLORS.greenDark,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 5,
          width: 40,
          borderRadius: 10,
          alignSelf: 'center',
        }}>
        <AntDesign name="message1" size={18} color={COLORS.white} />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: COLORS.darkBrown,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          width: 40,
          borderRadius: 10,
          alignSelf: 'center',
        }}>
        <Tooltip
          backgroundColor={COLORS.transparent}
          arrowStyle={{backgroundColor: 'red', display: 'none', opacity: 0}}
          placement="bottom"
          isVisible={isTooltipOpen}
          contentStyle={{
            borderRadius: 10,
            borderTopRightRadius: 0,
            height: hp(10),
            shadowColor: '#000',
            width: wp(20),
            transform: [{translateX: wp(-5)}],
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            position: 'absolute',
            zIndex: 1000,
          }}
          content={
            <View style={{justifyContent: 'space-evenly', flex: 1}}>
              <TouchableOpacity
                onPress={() => {
                  handleReportOrBlockPress('block', userId);
                }}>
                <MyText size={FONT_SIZE.sm}>Block</MyText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleReportOrBlockPress('report', userId)}>
                <MyText size={FONT_SIZE.sm} color={COLORS.red}>
                  Report
                </MyText>
              </TouchableOpacity>
            </View>
          }
          onClose={() => setIsTooltipOpen(false)}>
          <TouchableOpacity
            onPress={() => setIsTooltipOpen(true)}
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Entypo
              name="dots-three-horizontal"
              size={18}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </Tooltip>
      </View>
    </View>
  );
};

const MyFriendList = () => {
  const navigationState = useNavigationState(state => state);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const {myFriends} = useSelector((s: RootState) => s.friend);

  console.log(token);
  const requestApi = async () => {
    try {
      const res: any = await api_getMyfiends(token!);
      dispatch(myFriendsList(res?.data));
      setFilteredData(res?.data);
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

  const handleReportOrBlockPress = async (
    action: 'report' | 'block',
    id: string,
  ) => {
    try {
      setLoading(true);
      const payload = {
        followingId: id,
        action,
      };
      console.log(payload);
      const res: any = await api_reportOrBlock(token!, payload);
      console.log(res, 'api_reportOrBlock');
      requestApi();
      getBlockedList();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    if (text) {
      setSearchString(text);
      const newData = myFriends.filter(
        item =>
          item.fullname.toLowerCase().includes(text.toLowerCase()) ||
          item.followingId?.email.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(newData);
    } else {
      setFilteredData(myFriends);
      setSearchString('');
    }
  };

  useEffect(() => {
    if (navigationState.index == 1) {
      !myFriends?.length && setLoading(true);
      setFilteredData(myFriends);
      requestApi();
      getBlockedList();
    }
  }, [navigationState.index]);

  return (
    <View>
      <FriendSearch value={searchString} onChangeText={handleSearch} />

      <React.Fragment>
        {loading && <FullScreenLoader />}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          renderItem={({item}) => {
            return (
              <Item
                // userId={item?.followingId?._id}
                userId={item?._id}
                handleReportOrBlockPress={handleReportOrBlockPress}
                picture={item?.picture || ''}
                id={item._id}
                name={item?.fullname || 'no name'}
                email={item.followingId?.email}
              />
            );
          }}
        />
      </React.Fragment>
    </View>
  );
};

export default MyFriendList;
