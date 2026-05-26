import React, {useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import MainHeader from '../../components/header/MainHeader';
import MainLayout from '../../components/layout/MainLayout';
import {COLORS, D, FONT_SIZE, FONT_WEIGHT, hp} from '../../styles';
import {MyText} from '../../components/MyText';
import AllFormsTab from './AllFormsTab';
import ResourceAndArticleTab from './ResourceAndArticleTab';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AwarenessStackParams} from '../../naviagtion/types';
import AddActionButton from '../../components/buttons/AddActionButton';
import {TAB_BAR_BG_HEIGHT} from '../../naviagtion/MainTab';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import VendorEventScreen from '../event/VandorEvents';
import {pixelSizeHorizontal, pixelSizeVertical} from '../../utils/sizeNormalization';

const VENDOR_TABS = ['Discussions', 'Events'];
const USER_TABS = ['All Forums', 'Resource & Articles'];

type TabToggleProps = {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
};

const TabToggle = ({tabs, activeTab, onTabPress}: TabToggleProps) => (
  <View style={styles.tabContainer}>
    {tabs.map(tab => {
      const isActive = tab === activeTab;
      return (
        <TouchableOpacity
          onPress={() => onTabPress(tab)}
          key={tab}
          activeOpacity={0.75}
          style={[styles.tabItem, isActive ? styles.tabItemActive : styles.tabItemInactive]}>
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
);

const FloatingAddButton = ({onPress}: {onPress: () => void}) => (
  <View
    style={{
      position: 'absolute',
      width: D.width,
      height: hp(100) - TAB_BAR_BG_HEIGHT * 0.8,
      zIndex: 1,
      left: 0,
      top: 0,
      pointerEvents: 'box-none',
    }}>
    <TouchableOpacity
      onPress={onPress}
      style={{position: 'absolute', zIndex: 2, bottom: 10}}>
      <AddActionButton containerStyle={{paddingBottom: 0}} onPress={onPress} />
    </TouchableOpacity>
  </View>
);

const AwarenessScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();
  const isFocused = useIsFocused();
  const {user} = useSelector((s: RootState) => s.auth);
  const isVendor = user?.role == 2;
  const Tabs = isVendor ? VENDOR_TABS : USER_TABS;
  const [activeTab, setActiveTab] = useState(Tabs[0]);

  const header = (
    <MainHeader
      onMessagePress={() => navigation.navigate('ChatStack')}
      onNotiPress={() => navigation.navigate('AppNotification')}
    />
  );

  return (
    <View style={{flex: 1}}>
      {activeTab === Tabs[1] && (
        <FloatingAddButton
          onPress={() =>
            navigation.navigate(isVendor ? 'AddEvent' : 'AddResource')
          }
        />
      )}
      <MainLayout headerComp={header}>
        <View style={{flex: 1, paddingBottom: 160}}>
          <TabToggle tabs={Tabs} activeTab={activeTab} onTabPress={setActiveTab} />
          {isVendor ? (
            <>
              {activeTab === Tabs[0] && <AllFormsTab isFocused={isFocused} />}
              {activeTab === Tabs[1] && <VendorEventScreen />}
            </>
          ) : (
            <>
              {activeTab === Tabs[0] && <AllFormsTab isFocused={isFocused} />}
              {activeTab === Tabs[1] && <ResourceAndArticleTab isFocused={isFocused} />}
            </>
          )}
        </View>
      </MainLayout>
    </View>
  );
};

export default AwarenessScreen;

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    paddingHorizontal: pixelSizeHorizontal(6),
    paddingVertical: pixelSizeVertical(6),
    flexDirection: 'row',
    gap: pixelSizeHorizontal(6),
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(16),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
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
