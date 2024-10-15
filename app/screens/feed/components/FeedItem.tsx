import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT, hp, wp} from '../../../styles';
import {MyText} from '../../../components/MyText';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FeedStackParams} from '../../../naviagtion/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import Tooltip from 'react-native-walkthrough-tooltip';
import {Image} from 'react-native';
import {BUILD_IMAGE_URL} from '../../../api';
import {
  api_getFeeds,
  api_likeDislikeFeed,
  api_reportPost,
} from '../../../api/feeds';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {CommentType} from '../../../types';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';
type Props = {
  id: string;
  name: string;
  avatar: string | null;
  date: string;
  des: string;
  images: {
    url: string;
    _id: string;
  }[];
  likeCount: number;
  isLiked: boolean;
  comments: CommentType[];
  showThreeDots: Boolean;
  onReporting: (id: any) => void;
  userId: any;
};
const FeedItem = ({
  id,
  name,
  date,
  des,
  likeCount,
  avatar,
  images,
  isLiked,
  comments,
  showThreeDots,
  userId,
  onReporting,
}: Props) => {
  const {token} = useSelector((s: RootState) => s.auth);
  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParams>>();
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(!!isLiked);
  const [loading, setLoading] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const {mode, defaultAvatar} = useSelector((s: RootState) => s.app);

  const handleLikeDisLike = async () => {
    try {
      setLoading(true);
      const res = await api_likeDislikeFeed(token!, id);
      console.log(res);
      if (!liked) {
        setLocalLikeCount(localLikeCount + 1);
      } else {
        setLocalLikeCount(localLikeCount - 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = () => {
    navigation.navigate('ChatStack', {
      screen: 'Chat',
      params: {otherUserId: userId, fullname: name},
    });
  };

  return (
    <View>
      <View style={styles.row1}>
        <View style={[styles.prifileWrapper, {overflow: 'hidden'}]}>
          <View style={styles.imgContainer}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
              }}>
              {avatar ? (
                <Image
                  source={{uri: BUILD_IMAGE_URL(avatar)}}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
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
          </View>
        </View>
        <View style={styles.profileInfo}>
          <MyText bold={FONT_WEIGHT.bold}>{name}</MyText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <AntDesgin name="clockcircle" color={COLORS.greenDark} size={15} />
            <MyText size={FONT_SIZE.xs} color={COLORS.greenDark}>
              {moment(date).format('DD-MM-YYYY')}
            </MyText>
          </View>
        </View>
      </View>
      <FlatList
        style={{marginLeft: 15}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={images}
        renderItem={({item}) => {
          return (
            <View style={styles.imgContainer}>
              <Image
                source={{uri: BUILD_IMAGE_URL(item.url)}}
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
              />
            </View>
          );
        }}
      />
      <View style={styles.row}>
        <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
          {des}
        </MyText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity
              style={{flexDirection: 'row', gap: 5}}
              onPress={handleLikeDisLike}>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <AntDesgin
                  onPress={handleLikeDisLike}
                  name={liked ? 'heart' : 'hearto'}
                  size={15}
                  color={liked ? COLORS.red : COLORS.black}
                  // onPress={() => navigation.navigate('LikeScreen')}
                />
              )}
              <MyText size={FONT_SIZE.sm}>{localLikeCount} Likes</MyText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flexDirection: 'row', gap: 5}}
              onPress={() =>
                navigation.navigate('CommentScreen', {
                  feedId: id,
                  comments,
                })
              }>
              <MaterialCommunityIcons
                name="comment-processing"
                size={18}
                style={{transform: [{rotateY: '180deg'}]}}
                color={COLORS.greenDark}
              />
              <MyText size={FONT_SIZE.sm}>{comments.length} Comments</MyText>
            </TouchableOpacity>
          </View>

          {showThreeDots && (
            <Tooltip
              backgroundColor={COLORS.transparent}
              arrowStyle={{
                backgroundColor: 'red',
                display: 'none',
                opacity: 0,
              }}
              placement="bottom"
              isVisible={isOpen}
              contentStyle={{
                borderRadius: 10,
                borderTopRightRadius: 0,
                height: hp(15),
                shadowColor: '#000',
                width: wp(28),
                transform: [{translateX: wp(-5)}],
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                position: 'absolute',
                zIndex: 1,
                gap: 5,
              }}
              content={
                <View style={{justifyContent: 'space-evenly', flex: 1}}>
                  {/* <MyText size={FONT_SIZE.base}>Share</MyText> */}
                  <MyText size={FONT_SIZE.base} onPress={handleChatPress}>
                    Message
                  </MyText>
                  <MyText
                    size={FONT_SIZE.base}
                    color={COLORS.red}
                    onPress={() => onReporting(id)}>
                    Report
                  </MyText>
                </View>
              }
              onClose={() => setIsOpen(false)}>
              <TouchableOpacity onPress={() => setIsOpen(true)}>
                <Image
                  source={require('../../../../assets/img/icons/three-dots.png')}
                />
              </TouchableOpacity>
            </Tooltip>
          )}
        </View>
      </View>
    </View>
  );
};

export default FeedItem;

const styles = StyleSheet.create({
  prifileWrapper: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: COLORS.grey,
  },
  profileInfo: {
    justifyContent: 'space-between',
    height: 35,
  },
  row1: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  row: {
    padding: 20,
  },
  imgContainer: {
    width: wp(55),
    height: wp(55),
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
  },
});
