import {TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MyText} from '../../components/MyText';
import {COLORS, D, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import ResourceItem from './components/ResourceItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AwarenessStackParams} from '../../naviagtion/types';
import FullScreenLoader from '../../components/FullScreenLoader';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {api_getAllResource, api_getMyResource} from '../../api/awareness';

type Resource = {
  _id: string;
  description: string;
  picture: string;
  status: string;
  updated_at: string;
  userId: string;
  title: string;
};

// ALL
const AllResourceList = ({isFocused}: {isFocused: boolean}) => {
  const naviagtion =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [allResource, setAllResource] = useState<Resource[]>([]);
  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getMyResource(token!)) as {data: Resource[]};
      console.log(res);
      setAllResource(res.data);
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
      {allResource?.length ? (
        allResource.map(item => {
          return (
            <ResourceItem
              key={item._id}
              picture={item.picture}
              des={item.description}
              id={item._id}
              title={item.title}
              onPress={() =>
                naviagtion.navigate('ResourceDetail', {
                  isReadOnly: true,
                  data: {
                    title: item.title,
                    description: item.description,
                    updated_at: item.updated_at,
                    picture: item.picture,
                    id: item._id,
                  },
                })
              }
            />
          );
        })
      ) : (
        <MyText>No Resource</MyText>
      )}
    </React.Fragment>
  );
};
// JOINED
const MyResourcesList = ({isFocused}: {isFocused: boolean}) => {
  const naviagtion =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [myResource, setMyResource] = useState<Resource[]>([]);
  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getMyResource(token!)) as {data: Resource[]};
      console.log(res);
      setMyResource(res.data);
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
      {myResource?.length ? (
        myResource.map(item => {
          return (
            <ResourceItem
              picture={item.picture}
              key={item._id}
              des={item.description}
              id={item._id}
              title={item.title}
              onPress={() =>
                naviagtion.navigate('ResourceDetail', {
                  isReadOnly: false,
                  data: {
                    title: item.title,
                    description: item.description,
                    updated_at: item.updated_at,
                    picture: item.picture,
                    id: item._id,
                  },
                })
              }
            />
          );
        })
      ) : (
        <MyText>No Resources</MyText>
      )}
    </React.Fragment>
  );
};

const LISTS = ['All Resources', 'My Resources'];

const data = [
  {
    id: '1',
    title: 'Resource Title',
    des: 'Lorem Ipsum is simply dummy text of the printing and type setting industry...',
  },
  {
    id: '2',
    title: 'Resource Title',
    des: 'Lorem Ipsum is simply dummy text of the printing and type setting industry...',
  },
  {
    id: '3',
    title: 'Resource Title',
    des: 'Lorem Ipsum is simply dummy text of the printing and type setting industry...',
  },
  {
    id: '4',
    title: 'Resource Title',
    des: 'Lorem Ipsum is simply dummy text of the printing and type setting industry...',
  },

  {
    id: '5',
    title: 'Resource Title',
    des: 'Lorem Ipsum is simply dummy text of the printing and type setting industry...',
  },
  {
    id: '6',
    title: 'Resource Title',
    des: 'Lorem Ipsum is simply dummy text of the printing and type setting industry...',
  },
];

const ResourceAndArticleTab = ({isFocused}: {isFocused: boolean}) => {
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
      {activeList === LISTS[0] && <AllResourceList isFocused={isFocused} />}
      {activeList === LISTS[1] && <MyResourcesList isFocused={isFocused} />}
    </View>
  );
};

export default ResourceAndArticleTab;
