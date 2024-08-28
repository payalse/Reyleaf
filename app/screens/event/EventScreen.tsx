import React, {useState} from 'react';
import MainHeader from '../../components/header/MainHeader';
import MainLayout from '../../components/layout/MainLayout';
import {TouchableOpacity, View} from 'react-native';
import RenderCalander from './components/RenderCalander';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_WEIGHT} from '../../styles';
import AllEventList from './components/AllEventList';
import AttendingEventList from './components/AttendingEventList';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {EventStackParams} from '../../naviagtion/types';

const Tabs = ['All Events', 'Attending'];
const EventScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EventStackParams>>();
  const [activeTab, setActiveTab] = useState(Tabs[0]);
  const isFocused = useIsFocused();
  return (
    <MainLayout
      headerComp={
        <MainHeader
          onMessagePress={() => navigation.navigate('ChatStack')}
          onNotiPress={() => navigation.navigate('AppNotification')}
        />
      }>
      <View style={{flex: 1, paddingBottom: 200}}>
        <RenderCalander />
        {/* TAB TOGGLE */}
        <View
          style={{
            backgroundColor: COLORS.white,
            paddingHorizontal: 8,
            borderRadius: 30,
            paddingVertical: 8,
            flexDirection: 'row',
            gap: 15,
          }}>
          {Tabs.map(tab => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                onPress={() => setActiveTab(tab)}
                key={tab}
                style={{
                  flex: 1,
                  backgroundColor: isActive ? COLORS.greenDark : COLORS.white,
                  borderRadius: 30,
                  height: 45,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MyText
                  bold={isActive ? FONT_WEIGHT.bold : FONT_WEIGHT.normal}
                  center
                  color={isActive ? COLORS.white : COLORS.grey}>
                  {tab}
                </MyText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TAB View */}
        {activeTab === Tabs[0] && <AllEventList isFocused={isFocused} />}
        {activeTab === Tabs[1] && <AttendingEventList isFocused={isFocused} />}
      </View>
    </MainLayout>
  );
};

export default EventScreen;
