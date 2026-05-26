import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {MyText} from '../../components/MyText';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import ForumItem from './components/ForumItem';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AwarenessStackParams} from '../../naviagtion/types';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {api_getAllForums, api_getJoinedForums} from '../../api/forum';
import {api_joinLeaveForm} from '../../api/awareness';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../../utils/sizeNormalization';

type ForumType = {
  _id: string;
  title: string;
  description: string;
  picture: string;
  isJoined: boolean;
  joinedCount: number;
  members: any[];
  updated_at: string;
};

const PAGE_SIZE = 10;

// ─── ALL FORUMS ───────────────────────────────────────────────────────────────
const AllFoumsList = ({isFocused}: {isFocused: boolean}) => {
  const {token} = useSelector((s: RootState) => s.auth);
  const navigation =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();

  const [data, setData] = useState<ForumType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchForums = useCallback(
    async (pg: number, q: string, append: boolean) => {
      try {
        if (pg === 1) setLoading(true);
        else setLoadingMore(true);
        const res: any = await api_getAllForums(token!, {
          page: pg,
          limit: PAGE_SIZE,
          search: q || undefined,
        });
        const incoming: ForumType[] = res.data || [];
        setData(prev => (append ? [...prev, ...incoming] : incoming));
        setTotalPages(res.totalPages || 1);
        setPage(pg);
      } catch {
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [token],
  );

  useFocusEffect(
    useCallback(() => {
      fetchForums(1, search, false);
    }, [fetchForums]),
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchForums(1, text, false);
    }, 400);
  };

  const handleJoinToggle = async (item: ForumType) => {
    const wasJoined = item.isJoined;
    setData(prev =>
      prev.map(f =>
        f._id === item._id
          ? {
              ...f,
              isJoined: !wasJoined,
              joinedCount: wasJoined
                ? f.joinedCount - 1
                : f.joinedCount + 1,
            }
          : f,
      ),
    );
    try {
      await api_joinLeaveForm(token!, item._id);
    } catch {
      setData(prev =>
        prev.map(f =>
          f._id === item._id
            ? {
                ...f,
                isJoined: wasJoined,
                joinedCount: wasJoined
                  ? f.joinedCount + 1
                  : f.joinedCount - 1,
              }
            : f,
        ),
      );
    }
  };

  return (
    <View>
      {/* Search */}
      <View style={styles.searchRow}>
        <AntDesign name="search1" size={FONT_SIZE.base} color={COLORS.grey} />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search forums…"
          placeholderTextColor={COLORS.grey}
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <AntDesign name="close" size={FONT_SIZE.base} color={COLORS.grey} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          color={COLORS.greenDark}
          style={styles.loader}
        />
      ) : data.length === 0 ? (
        <MyText center color={COLORS.grey} style={styles.empty}>
          {search ? 'No forums match your search.' : 'No forums yet.'}
        </MyText>
      ) : (
        <>
          {data.map(item => (
            <ForumItem
              key={item._id}
              id={item._id}
              title={item.title}
              des={item.description}
              picture={item.picture}
              noOfMembers={item.joinedCount ?? item.members?.length ?? 0}
              isJoined={item.isJoined}
              onJoinPress={() => handleJoinToggle(item)}
              onPress={() => navigation.navigate('ForumDetail', {id: item._id})}
            />
          ))}

          {page < totalPages && (
            <TouchableOpacity
              onPress={() => fetchForums(page + 1, search, true)}
              style={styles.loadMoreBtn}
              disabled={loadingMore}>
              {loadingMore ? (
                <ActivityIndicator color={COLORS.greenDark} size="small" />
              ) : (
                <MyText
                  color={COLORS.greenDark}
                  bold={FONT_WEIGHT.semibold}
                  size={FONT_SIZE.base}>
                  Load more
                </MyText>
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

// ─── JOINED FORUMS ────────────────────────────────────────────────────────────
const JoinedFoumsList = ({isFocused}: {isFocused: boolean}) => {
  const {token} = useSelector((s: RootState) => s.auth);
  const navigation =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();
  const [data, setData] = useState<ForumType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJoined = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await api_getJoinedForums(token!);
      setData(res.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchJoined();
    }, [fetchJoined]),
  );

  if (loading) {
    return (
      <ActivityIndicator color={COLORS.greenDark} style={styles.loader} />
    );
  }

  return (
    <View>
      {data.length === 0 ? (
        <MyText center color={COLORS.grey} style={styles.empty}>
          You haven't joined any forums yet.
        </MyText>
      ) : (
        data.map(item => (
          <ForumItem
            key={item._id}
            id={item._id}
            title={item.title}
            des={item.description}
            picture={item.picture}
            noOfMembers={item.joinedCount ?? item.members?.length ?? 0}
            isJoined
            onPress={() =>
              navigation.navigate('ForumDetail', {id: item._id})
            }
          />
        ))
      )}
    </View>
  );
};

// ─── TAB CONTAINER ────────────────────────────────────────────────────────────
const LISTS = ['All Forums', 'Joined Forums'];

const AllFormsTab = ({isFocused}: {isFocused: boolean}) => {
  const [activeList, setActiveList] = useState(LISTS[0]);
  return (
    <View>
      <View style={styles.toggle}>
        {LISTS.map(list => {
          const active = activeList === list;
          return (
            <TouchableOpacity
              key={list}
              onPress={() => setActiveList(list)}
              style={[styles.toggleBtn, active && styles.toggleBtnActive]}>
              <MyText
                color={active ? COLORS.white : COLORS.grey}
                size={FONT_SIZE.sm}
                bold={active ? FONT_WEIGHT.semibold : FONT_WEIGHT.normal}>
                {list}
              </MyText>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeList === LISTS[0] && <AllFoumsList isFocused={isFocused} />}
      {activeList === LISTS[1] && <JoinedFoumsList isFocused={isFocused} />}
    </View>
  );
};

export default AllFormsTab;

const styles = {
  searchRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS['Semi-Large'],
    borderWidth: 1,
    borderColor: COLORS.lightgrey2,
    paddingHorizontal: pixelSizeHorizontal(14),
    paddingVertical: heightPixel(10),
    marginBottom: pixelSizeVertical(14),
    gap: pixelSizeHorizontal(8),
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: COLORS.darkBrown,
    padding: 0,
  },
  loader: {
    marginTop: pixelSizeVertical(40),
  },
  empty: {
    marginTop: pixelSizeVertical(40),
  },
  loadMoreBtn: {
    alignItems: 'center' as const,
    paddingVertical: pixelSizeVertical(14),
    borderWidth: 1,
    borderColor: COLORS.greenDark,
    borderRadius: BORDER_RADIUS.Circle,
    marginBottom: pixelSizeVertical(20),
  },
  toggle: {
    flexDirection: 'row' as const,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS['Semi-Large'],
    padding: 4,
    marginBottom: pixelSizeVertical(14),
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: heightPixel(10),
    alignItems: 'center' as const,
    borderRadius: BORDER_RADIUS.Medium,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.greenDark,
  },
};
