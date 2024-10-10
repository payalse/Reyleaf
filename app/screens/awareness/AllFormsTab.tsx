import {Alert, Text, Touchable, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import ForumItem from './components/ForumItem';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AwarenessStackParams} from '../../naviagtion/types';
import FullScreenLoader from '../../components/FullScreenLoader';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {api_getAllForums, api_getJoinedForums} from '../../api/forum';

type ForumType = {
  description: string;
  isJoined: boolean;
  isLiked: boolean;
  joinedCount: number;
  likeCount: '0';
  members: any[];
  ownerId: string;
  status: string;
  title: string;
  updated_at: string;
  picture: string;
  _id: string;
};
// ALL FORUMS
const AllFoumsList = ({isFocused}: {isFocused: boolean}) => {
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const [data, setData] = useState<ForumType[]>([]);
  const naviagtion =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();
  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getAllForums(token!);
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    requestApi();
  }, [isFocused]);

  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      {data.length ? (
        data.map(item => {
          return (
            <ForumItem
              key={item._id}
              noOfMembers={item.members.length || 0}
              des={item.description}
              id={item._id}
              title={item.title}
              picture={item.picture}
              onPress={() =>
                naviagtion.navigate('ForumDetail', {
                  id: item._id,
                })
              }
            />
          );
        })
      ) : (
        <MyText center>No Forums!</MyText>
      )}
    </React.Fragment>
  );
};
// JOINED FORUM
const JoinedFoumsList = ({isFocused}: {isFocused: boolean}) => {
  const naviagtion =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();

  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const [data, setData] = useState<ForumType[]>([]);

  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getJoinedForums(token!);
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    requestApi();
  }, [isFocused]);

  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      {data?.length ? (
        data.map(item => {
          return (
            <ForumItem
              key={item._id}
              noOfMembers={item.members.length || 0}
              des={item.description}
              id={item._id}
              title={item.title}
              picture={item.picture}
              onPress={() =>
                naviagtion.navigate('JoinedForumDetail', {
                  id: item._id,
                })
              }
            />
          );
        })
      ) : (
        <MyText center>No Forums!</MyText>
      )}
    </React.Fragment>
  );
};

const LISTS = ['All Forums', 'Joined Forums'];

const AllFormsTab = ({isFocused}: {isFocused: boolean}) => {
  const [activeList, setActiveList] = useState(LISTS[0]);
  // const isFocused = useIsFocused();
  return (
    <View>
      {/* TOGGLE */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          gap: 10,
          marginVertical: 10,
        }}>
        {LISTS.map(list => {
          const active = activeList === list;
          return (
            <TouchableOpacity key={list} onPress={() => setActiveList(list)}>
              <MyText
                color={active ? COLORS.black : COLORS.grey}
                size={active ? FONT_SIZE.xl : FONT_SIZE.sm}
                bold={active ? FONT_WEIGHT.bold : FONT_WEIGHT.normal}>
                {list}
              </MyText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lists */}
      {activeList === LISTS[0] && <AllFoumsList isFocused={isFocused} />}
      {activeList === LISTS[1] && <JoinedFoumsList isFocused={isFocused} />}
    </View>
  );
};

export default AllFormsTab;
