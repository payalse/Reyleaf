import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {useState} from 'react';
import {COLORS, D, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Tooltip from 'react-native-walkthrough-tooltip';
import {BUILD_IMAGE_URL} from '../../../api';
import {api_likeDislikeFeed} from '../../../api/feeds';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {CommentType} from '../../../types';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';
import {fontPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from '../../../utils/sizeNormalization';

const CARD_W = D.width - 40;

type Props = {
  id: string;
  name: string;
  avatar: string | null;
  date: string;
  des: string;
  images: {url: string; _id: string}[];
  likeCount: number;
  isLiked: boolean;
  comments: CommentType[];
  showThreeDots: Boolean;
  onReporting: (id: any) => void;
  userId: any;
};

const FeedItem = ({id, name, date, des, likeCount, avatar, images, isLiked, comments, showThreeDots, userId, onReporting}: Props) => {
  const {token} = useSelector((s: RootState) => s.auth);
  const {defaultAvatar} = useSelector((s: RootState) => s.app);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(!!isLiked);
  const [loading, setLoading] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);

  const handleLike = async () => {
    try {
      setLoading(true);
      await api_likeDislikeFeed(token!, id);
      setLocalLikeCount(prev => (liked ? prev - 1 : prev + 1));
      setLiked(prev => !prev);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const isSingle = images?.length === 1;

  return (
    <View style={styles.card}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image
            source={avatar ? {uri: BUILD_IMAGE_URL(avatar)} : defaultAvatar.img}
            style={styles.avatarImg}
            resizeMode="cover"
          />
        </View>

        <View style={styles.meta}>
          <MyText bold={FONT_WEIGHT.semibold} size={FONT_SIZE.base} color={COLORS.darkBrown} numberOfLines={1}>
            {name}
          </MyText>
          <MyText size={FONT_SIZE.xs} color={COLORS.grey}>
            {moment(date).fromNow()}
          </MyText>
        </View>

        {showThreeDots && (
          <Tooltip
            backgroundColor={COLORS.transparent}
            arrowStyle={{display: 'none', opacity: 0}}
            placement="bottom"
            isVisible={isOpen}
            contentStyle={styles.menu}
            content={
              <View>
                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => {
                    setIsOpen(false);
                    navigation.navigate('ChatStack', {screen: 'Chat', params: {otherUserId: userId, fullname: name}});
                  }}>
                  <MyText size={FONT_SIZE.sm}>Message</MyText>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => { setIsOpen(false); onReporting(id); }}>
                  <MyText size={FONT_SIZE.sm} color={COLORS.red}>Report</MyText>
                </TouchableOpacity>
              </View>
            }
            onClose={() => setIsOpen(false)}>
            <TouchableOpacity onPress={() => setIsOpen(true)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Entypo name="dots-three-horizontal" size={fontPixel(16)} color={COLORS.grey} />
            </TouchableOpacity>
          </Tooltip>
        )}
      </View>

      {/* ── Description ── */}
      {!!des && (
        <MyText size={FONT_SIZE.sm} color={'#555'} style={styles.desc} numberOfLines={4}>
          {des}
        </MyText>
      )}

      {/* ── Images ── */}
      {images?.length > 0 && (
        isSingle ? (
          <Image
            source={{uri: BUILD_IMAGE_URL(images[0].url)}}
            style={styles.singleImage}
            resizeMode="contain"
          />
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={images}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.carousel}
            renderItem={({item}) => (
              <View style={styles.carouselItem}>
                <Image source={{uri: BUILD_IMAGE_URL(item.url)}} style={styles.carouselImg} resizeMode="contain" />
              </View>
            )}
          />
        )
      )}

      {/* ── Actions ── */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.7}>
          {loading
            ? <ActivityIndicator size="small" color={COLORS.red} />
            : <AntDesign name={liked ? 'heart' : 'hearto'} size={fontPixel(17)} color={liked ? COLORS.red : COLORS.grey} />
          }
          {localLikeCount > 0 && (
            <MyText size={FONT_SIZE.xs} color={liked ? COLORS.red : COLORS.grey}>{localLikeCount}</MyText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('CommentScreen', {feedId: id, comments})}>
          <MaterialCommunityIcons
            name="comment-outline"
            size={fontPixel(18)}
            color={COLORS.grey}
          />
          {comments.length > 0 && (
            <MyText size={FONT_SIZE.xs} color={COLORS.grey}>{comments.length}</MyText>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default FeedItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: widthPixel(14),
    borderWidth: 1,
    borderColor: COLORS.lightgrey2,
    marginBottom: pixelSizeVertical(12),
    overflow: 'hidden',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pixelSizeHorizontal(14),
    paddingTop: pixelSizeVertical(14),
    paddingBottom: pixelSizeVertical(10),
    gap: pixelSizeHorizontal(10),
  },
  avatar: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    overflow: 'hidden',
    backgroundColor: COLORS.lightgrey2,
  },
  avatarImg: {width: '100%', height: '100%'},
  meta: {flex: 1, gap: pixelSizeVertical(2)},

  // Description
  desc: {
    lineHeight: 20,
    paddingHorizontal: pixelSizeHorizontal(14),
    paddingBottom: pixelSizeVertical(12),
  },

  // Single image — full bleed, no crop
  singleImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },

  // Multi-image carousel
  carousel: {
    paddingHorizontal: pixelSizeHorizontal(14),
    paddingBottom: pixelSizeVertical(12),
    gap: pixelSizeHorizontal(8),
  },
  carouselItem: {
    width: CARD_W * 0.72,
    aspectRatio: 1,
    borderRadius: widthPixel(10),
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  carouselImg: {width: '100%', height: '100%'},

  // Actions
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pixelSizeHorizontal(14),
    paddingVertical: pixelSizeVertical(10),
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgrey2,
    gap: pixelSizeHorizontal(18),
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(5),
  },

  // Dropdown menu
  menu: {
    borderRadius: widthPixel(10),
    paddingVertical: pixelSizeVertical(2),
    paddingHorizontal: 0,
    minWidth: widthPixel(120),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  menuRow: {
    paddingVertical: pixelSizeVertical(10),
    paddingHorizontal: pixelSizeHorizontal(14),
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.lightgrey2,
  },
});
