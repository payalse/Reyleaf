import React, { useEffect, useState } from 'react';
import MainHeader from '../../components/header/MainHeader';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, D, FONT_SIZE, FONT_WEIGHT, hp, wp } from '../../styles';
import { MyText } from '../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeedItem from './components/FeedItem';
import AddActionButton from '../../components/buttons/AddActionButton';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FeedStackParams } from '../../naviagtion/types';
import LoactionPermissionModal from '../../components/modal/LoactionPermissionModal';
import FriendsTab from './FriendsTab';
import FeedsTab from './FeedsTab';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { FeedType } from '../../types';
import { api_getFeeds, api_getFeedsByZipCode } from '../../api/feeds';
import { addFeed } from '../../redux/features/feed/feedSlice';
import FullScreenLoader from '../../components/FullScreenLoader';
const Tabs = ['Feeds', 'Friends'];

const FeedScreen = () => {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParams>>();
  const [activeTab, setActiveTab] = useState(Tabs[1]);
  const [text, setText] = useState('');
  const [isLoactionPermissionModalOpen, setIsLoactionPermissionModalOpen] =
    useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((s: RootState) => s.auth);

  const handleLocationPermissionModalClose = async () => {
    setIsLoactionPermissionModalOpen(false);
    try {
      if (!text || !text.trim().length) {
        return;
      }
      setLoading(true);
      const res = (await api_getFeedsByZipCode(token!, text)) as {
        data: FeedType[];
      };
      dispatch(addFeed(res?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setText('');
      setLoading(false);
    }
  };

  const requestApi = async () => {
    try {
      const res = (await api_getFeeds(token!, '')) as {
        data: FeedType[];
      };
      dispatch(addFeed(res?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: any) => {
    setActiveTab(tab);
    tab == 1 ? requestApi() : null;
  };

  useEffect(() => {
    requestApi();
    setActiveTab(user?.role == 2 ? Tabs[0] : Tabs[1]);
  }, [isFocused]);

  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      <View
        style={{
          display: activeTab === Tabs[1] ? 'none' : 'flex',
          position: 'absolute',
          width: wp(100),
          height: hp(100),
          zIndex: 1,
          left: 0,
          top: -20,
          pointerEvents: 'box-none',
          opacity: 1,
        }}
      >
        <AddActionButton
          onPress={() => {
            navigation.navigate(activeTab === Tabs[0] ? 'CreateFeed' : 'Feed');
          }}
        />
      </View>
      {user?.role == 2 ? (
        <View style={{ flex: 1 }}>
          <View style={styles.headerWrapper}>
            <SafeAreaView />
            <MainHeader
              onMessagePress={() => navigation.navigate('ChatStack')}
              onNotiPress={() => navigation.navigate('AppNotification')}
            />
            <FeedsTab
              isFocused={isFocused}
              modalView={isLoactionPermissionModalOpen}
              zipCode={text}
              onLocationPress={() => setIsLoactionPermissionModalOpen(true)}
            />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <LoactionPermissionModal
            value={text}
            onChange={s => setText(s)}
            visible={isLoactionPermissionModalOpen}
            onPress={handleLocationPermissionModalClose}
          />
          <View style={styles.headerWrapper}>
            <SafeAreaView />
            <MainHeader
              onMessagePress={() => navigation.navigate('ChatStack')}
              onNotiPress={() => navigation.navigate('AppNotification')}
            />
            {/* TAB TOGGLE */}
            <View
              style={{
                backgroundColor: COLORS.white,
                paddingHorizontal: 8,
                borderRadius: 30,
                paddingVertical: 8,
                flexDirection: 'row',
                gap: 15,
              }}
            >
              {Tabs.map(tab => {
                const isActive = tab === activeTab;
                return (
                  <TouchableOpacity
                    onPress={() => switchTab(tab)}
                    key={tab}
                    style={{
                      flex: 1,
                      backgroundColor: isActive
                        ? COLORS.greenDark
                        : COLORS.white,
                      borderRadius: 30,
                      height: 45,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <MyText
                      bold={isActive ? FONT_WEIGHT.bold : FONT_WEIGHT.normal}
                      center
                      color={isActive ? COLORS.white : COLORS.grey}
                    >
                      {tab}
                    </MyText>
                  </TouchableOpacity>
                );
              })}
            </View>
            {activeTab === Tabs[0] && (
              <FeedsTab
                isFocused={isFocused}
                modalView={isLoactionPermissionModalOpen}
                zipCode={text}
                onLocationPress={() => setIsLoactionPermissionModalOpen(true)}
              />
            )}
            {activeTab === Tabs[1] && <FriendsTab />}
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

export default FeedScreen;

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
    flex: 1,
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
  locationBtn: {
    backgroundColor: COLORS.darkBrown,
    width: wp(12),
    height: wp(12),
    borderRadius: wp(12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
