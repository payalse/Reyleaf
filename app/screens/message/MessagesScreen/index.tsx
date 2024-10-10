import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS, FONT_SIZE, FONT_WEIGHT, wp } from '../../../styles';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { MyText } from '../../../components/MyText';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatStackParams } from '../../../naviagtion/types';
import Tooltip from 'rn-tooltip';
import { api_getAllRoom } from '../../../api/chat';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { BUILD_IMAGE_URL } from '../../../api';
type ItemType = {
  badge: number;
  title: string;
  message: string;
  time: string;
  image?: string;
  onPress?: () => void;
};

const Item = ({
  badge = 0,
  title,
  message,
  image,
  time,
  onPress,
}: ItemType) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParams>>();
  const { mode, defaultAvatar } = useSelector((s: RootState) => s.app);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: 10,
        marginVertical: 10,
        borderColor: COLORS.lightgrey2,
        borderBottomWidth: 2,
        paddingBottom: 10,
      }}
    >
      <View
        style={{
          width: wp(15),
          height: wp(15),
          borderRadius: wp(15) / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {image ? (
          <Image
            source={{ uri: BUILD_IMAGE_URL(image) }}
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
      <View style={{ flex: 1, gap: 5 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <MyText
            size={FONT_SIZE.base}
            color={COLORS.black}
            bold={FONT_WEIGHT.bold}
          >
            {title}
          </MyText>
        </View>
        <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
          {message}
        </MyText>
      </View>
      <View style={{ justifyContent: 'space-between' }}>
        <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
          {time}
        </MyText>
        {badge >= 1 && (
          <View
            style={{
              width: wp(7),
              height: wp(7),
              borderRadius: wp(7) / 2,
              backgroundColor: COLORS.greenDark,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-end',
            }}
          >
            <MyText
              size={FONT_SIZE.sm}
              bold={FONT_WEIGHT.semibold}
              color={COLORS.white}
            >
              {badge}
            </MyText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
const MessagesScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParams>>();
  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState('');
  const { token, user } = useSelector((s: RootState) => s.auth);
  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getAllRoom(token!);
      console.log(res, 'allrooms');
      setData(res?.data);
      setFilteredData(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    if (text) {
      setSearchString(text);
      const newData = filteredData.filter((item: any) =>
        item?.sender?.fullname.toLowerCase().includes(text.toLowerCase()) || item?.receiver?.fullname.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(newData);
    } else {
      setFilteredData(data);
      setSearchString('');
    }
  };

  useEffect(() => {
    requestApi();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      {loading && <FullScreenLoader />}
      <SecondaryHeader
        onBack={navigation.goBack}
        title="Messages"
        // RightComp={() => {
        //   return (
        //     <Tooltip
        //       containerStyle={{
        //         backgroundColor: COLORS.white,
        //         borderRadius: 10,
        //         borderTopRightRadius: 0,
        //         transform: [{translateX: wp(2)}],
        //         shadowColor: '#000',
        //         shadowOffset: {
        //           width: 0,
        //           height: 2,
        //         },
        //         shadowOpacity: 0.25,
        //         shadowRadius: 3.84,
        //         elevation: 5,
        //       }}
        //       overlayColor={COLORS.transparent}
        //       withPointer={false}
        //       actionType="press"
        //       popover={
        //         <TouchableOpacity
        //           onPress={() => {
        //             navigation.navigate('AllRequest');
        //           }}>
        //           <MyText>Message Request</MyText>
        //         </TouchableOpacity>
        //       }>
        //       <Entypo
        //         name="dots-three-horizontal"
        //         size={FONT_SIZE['2xl']}
        //         color={COLORS.black}
        //       />
        //     </Tooltip>
        //   );
        // }}
      />
      <View style={{width: '90%', alignSelf: 'center', marginTop: 40, marginBottom: -10}}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: 60,
            borderRadius: 30,
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <AntDesign
            name="search1"
            size={FONT_SIZE.xl}
            color={COLORS.grey}
            style={{ marginLeft: 15, marginRight: 5 }}
          />

          <TextInput
            placeholderTextColor={COLORS.grey}
            placeholder="Search here"
            value={searchString}
            onChangeText={handleSearch}
            style={{
              flex: 1,
              height: '100%',
              fontSize: FONT_SIZE.base,
            }}
          />
        </View>
      </View>
      <FlatList
        data={filteredData}
        ListEmptyComponent={() => {
          return (
            <View style={{ marginTop: 200 }}>
              <MyText center>No Chat!</MyText>
            </View>
          );
        }}
        contentContainerStyle={{ marginHorizontal: 20, marginVertical: 20 }}
        renderItem={({ item }) => {
          let otherUserObj =
            item?.receiver?._id !== user?._id ? item?.receiver : item?.sender;

          return (
            <Item
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Chat', {
                  otherUserId: otherUserObj?._id,
                  fullname: otherUserObj?.fullname,
                });
              }}
              badge={item.badge}
              time={item.time}
              image={otherUserObj?.picture || ''}
              message={''}
              title={otherUserObj?.fullname || 'No Name'}
            />
          );
        }}
      />
    </View>
  );
};

export default MessagesScreen;
