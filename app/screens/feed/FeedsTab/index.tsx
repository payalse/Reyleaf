import {FlatList, Pressable, StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import FeedItem from '../components/FeedItem';
import {COLORS, FONT_SIZE} from '../../../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MyText} from '../../../components/MyText';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {
  api_getFeeds,
  api_reportPost,
} from '../../../api/feeds';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../redux/store';
import {FeedType} from '../../../types';
import {addFeed} from '../../../redux/features/feed/feedSlice';
import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../../utils/sizeNormalization';

type Props = {
  onLocationPress: () => void;
  isFocused: boolean;
  modalView: boolean;
  zipCode: string;
};

const FeedsTab = ({onLocationPress, isFocused, modalView, zipCode}: Props) => {
  const {token, user} = useSelector((s: RootState) => s.auth);
  const {feed} = useSelector((s: RootState) => s.feed);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const requestApi = async () => {
    try {
      const res = (await api_getFeeds(token!, description)) as {
        data: FeedType[];
      };
      dispatch(addFeed(res?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const reportPost = async (id: any) => {
    try {
      setLoading(true);
      await api_reportPost(token!, {feedId: id});
    } catch (error) {
      console.log(error);
    } finally {
      requestApi();
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <AntDesign name="search1" size={fontPixel(16)} color={COLORS.grey} />
          <TextInput
            value={description}
            onChangeText={setDescription}
            onSubmitEditing={requestApi}
            returnKeyType="search"
            style={styles.searchInput}
            placeholder="Search posts..."
            placeholderTextColor={COLORS.grey}
          />
          {description.length > 0 && (
            <Pressable onPress={() => setDescription('')} hitSlop={8}>
              <AntDesign name="closecircle" size={fontPixel(14)} color={COLORS.grey} />
            </Pressable>
          )}
        </View>

        <Pressable style={styles.locationBtn} onPress={onLocationPress}>
          <Ionicons name="location-sharp" size={fontPixel(20)} color={COLORS.white} />
        </Pressable>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={fontPixel(40)} color={COLORS.lightgrey} />
            <MyText center color={COLORS.grey} size={FONT_SIZE.base}>
              No posts yet
            </MyText>
          </View>
        )}
        data={feed}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <FeedItem
            showThreeDots={item?.userId?._id !== user?._id}
            id={item._id}
            isLiked={item.isLiked}
            name={item?.userId?.fullname || ''}
            images={item?.photos}
            avatar={item?.userId?.picture || null}
            date={item?.updated_at}
            des={item?.description}
            likeCount={item?.likes.length || 0}
            comments={item.comments || []}
            onReporting={reportPost}
            userId={item.userId?._id}
          />
        )}
      />
    </>
  );
};

export default FeedsTab;

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(10),
    marginVertical: pixelSizeVertical(12),
  },
  searchBox: {
    flex: 1,
    height: widthPixel(46),
    backgroundColor: COLORS.lightgrey2,
    borderRadius: widthPixel(23),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pixelSizeHorizontal(14),
    gap: pixelSizeHorizontal(8),
  },
  searchInput: {
    flex: 1,
    color: COLORS.black,
    fontSize: fontPixel(14),
    paddingVertical: 0,
  },
  locationBtn: {
    width: widthPixel(46),
    height: widthPixel(46),
    borderRadius: widthPixel(23),
    backgroundColor: COLORS.greenDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: pixelSizeVertical(180 * 2),
    paddingTop: pixelSizeVertical(4),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: pixelSizeVertical(60),
    gap: pixelSizeVertical(10),
  },
});
