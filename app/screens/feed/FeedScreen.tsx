import React, {useEffect, useState} from 'react';
import MainHeader from '../../components/header/MainHeader';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONT_SIZE, FONT_WEIGHT, hp, wp} from '../../styles';
import {MyText} from '../../components/MyText';
import AddActionButton from '../../components/buttons/AddActionButton';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FeedStackParams} from '../../naviagtion/types';
import LoactionPermissionModal from '../../components/modal/LoactionPermissionModal';
import FriendsTab from './FriendsTab';
import FeedsTab from './FeedsTab';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {FeedType} from '../../types';
import {api_getFeeds, api_getFeedsByZipCode} from '../../api/feeds';
import {addFeed} from '../../redux/features/feed/feedSlice';
import FullScreenLoader from '../../components/FullScreenLoader';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../utils/sizeNormalization';

const Tabs = ['Feeds', 'Friends'];

const FeedScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParams>>();
  const [activeTab, setActiveTab] = useState(Tabs[0]);
  const [text, setText] = useState('');
  const [isLoactionPermissionModalOpen, setIsLoactionPermissionModalOpen] =
    useState(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {token, user} = useSelector((s: RootState) => s.auth);

  const handleLocationPermissionModalClose = async () => {
    setIsLoactionPermissionModalOpen(false);
    try {
      if (!text?.trim()) return;
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
      const res = (await api_getFeeds(token!, '')) as {data: FeedType[]};
      dispatch(addFeed(res?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === Tabs[0]) requestApi();
  };

  useEffect(() => {
    requestApi();
  }, [isFocused]);

  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}

      {/* Floating add button */}
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
        }}>
        <AddActionButton
          onPress={() =>
            navigation.navigate(activeTab === Tabs[0] ? 'CreateFeed' : 'Feed')
          }
        />
      </View>

      {user?.role == 2 ? (
        <View style={{flex: 1}}>
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
        <View style={{flex: 1}}>
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

            {/* Tab toggle */}
            <View style={styles.tabContainer}>
              {Tabs.map(tab => {
                const isActive = tab === activeTab;
                return (
                  <TouchableOpacity
                    onPress={() => switchTab(tab)}
                    key={tab}
                    activeOpacity={0.75}
                    style={[
                      styles.tabItem,
                      isActive ? styles.tabItemActive : styles.tabItemInactive,
                    ]}>
                    <MyText
                      bold={isActive ? FONT_WEIGHT.semibold : FONT_WEIGHT.medium}
                      size={FONT_SIZE.base}
                      center
                      color={isActive ? COLORS.white : COLORS.grey}>
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
  headerWrapper: {
    marginHorizontal: 20,
    flex: 1,
    minHeight: 0,
  },
  tabContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    paddingHorizontal: pixelSizeHorizontal(6),
    paddingVertical: pixelSizeVertical(6),
    flexDirection: 'row',
    gap: pixelSizeHorizontal(6),
    marginBottom: pixelSizeVertical(4),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: {elevation: 3},
    }),
  },
  tabItem: {
    flex: 1,
    borderRadius: 30,
    height: pixelSizeVertical(44),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pixelSizeHorizontal(12),
  },
  tabItemActive: {
    backgroundColor: COLORS.greenDark,
  },
  tabItemInactive: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightgrey2,
  },
});
