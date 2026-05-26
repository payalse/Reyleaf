import React, {useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import MainHeader from '../../components/header/MainHeader';
import MainLayout from '../../components/layout/MainLayout';
import RenderCalander from './components/RenderCalander';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import AllEventList from './components/AllEventList';
import AttendingEventList from './components/AttendingEventList';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {EventStackParams} from '../../naviagtion/types';
import {pixelSizeHorizontal, pixelSizeVertical} from '../../utils/sizeNormalization';

const Tabs = ['All Events', 'Attending'];

const EventScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EventStackParams>>();
  const [activeTab, setActiveTab] = useState(Tabs[0]);
  const isFocused = useIsFocused();

  return (
    <MainLayout
      bgColor={COLORS.white}
      headerComp={
        <MainHeader
          onMessagePress={() => navigation.navigate('ChatStack')}
          onNotiPress={() => navigation.navigate('AppNotification')}
        />
      }>
      <View style={{flex: 1, paddingBottom: 200}}>
        <RenderCalander />

        {/* TAB TOGGLE */}
        <View style={styles.tabContainer}>
          {Tabs.map(tab => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                onPress={() => setActiveTab(tab)}
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

        {activeTab === Tabs[0] && <AllEventList isFocused={isFocused} />}
        {activeTab === Tabs[1] && <AttendingEventList isFocused={isFocused} />}
      </View>
    </MainLayout>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    paddingHorizontal: pixelSizeHorizontal(6),
    paddingVertical: pixelSizeVertical(6),
    flexDirection: 'row',
    gap: pixelSizeHorizontal(6),
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
