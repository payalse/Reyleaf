import {FlatList, Pressable, StyleSheet, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import FeedItem from '../components/FeedItem';
import {COLORS, FONT_SIZE, wp} from '../../../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MyText} from '../../../components/MyText';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {
  api_getFeeds,
  api_getFeedsByZipCode,
  api_reportPost,
} from '../../../api/feeds';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../redux/store';
import {FeedType} from '../../../types';
import {addFeed} from '../../../redux/features/feed/feedSlice';

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
      const data = {
        feedId: id,
      };
      const res = await api_reportPost(token!, data);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      requestApi();
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            value={description}
            onChangeText={text => {
              setDescription(text);
            }}
            style={{paddingVertical: 15, color: COLORS.black}}
            placeholder="Search by here"
            placeholderTextColor={COLORS.grey}
          />
        </View>

        <View style={styles.searchBtnContainer}>
          <AntDesign
            onPress={requestApi}
            name="search1"
            color={COLORS.grey}
            size={FONT_SIZE.xl}
          />
        </View>
        <Pressable style={styles.locationBtn} onPress={onLocationPress}>
          <Ionicons
            name="location-sharp"
            size={FONT_SIZE['2xl']}
            color={COLORS.white}
          />
        </Pressable>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 180 * 2,
        }}
        ListEmptyComponent={() => {
          return (
            <View>
              <MyText center>Empty</MyText>
            </View>
          );
        }}
        data={feed}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <View style={styles.seprator} />}
        renderItem={({item}) => {
          return (
            <FeedItem
              showThreeDots={item?.userId?._id === user?._id ? false : true}
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
          );
        }}
      />
    </>
  );
};

export default FeedsTab;

const styles = StyleSheet.create({
  seprator: {
    height: 0.3,
    width: '90%',
    backgroundColor: COLORS.lightgrey,
    alignSelf: 'center',
  },
  headerWrapper: {
    marginHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  searchInputWrapper: {
    height: 45,
    backgroundColor: COLORS.lightgrey2,
    marginVertical: 10,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    flex: 1,
  },
  searchBtnContainer: {
    backgroundColor: COLORS.lightgrey2,
    padding: 12,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationBtn: {
    backgroundColor: COLORS.darkBrown,
    width: wp(12),
    height: wp(12),
    borderRadius: wp(12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
