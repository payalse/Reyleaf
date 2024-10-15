import React, {useState} from 'react';
import MainHeader from '../../components/header/MainHeader';
import MainLayout from '../../components/layout/MainLayout';
import {TouchableOpacity, View} from 'react-native';
import RenderCalander from './components/RenderCalander';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import AllEventList from './components/AllEventList';
import AttendingEventList from './components/AttendingEventList';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {EventStackParams} from '../../naviagtion/types';

const Tabs = ['All Events', 'Attending', 'My Created'];
const VendorEventScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EventStackParams>>();
  const [activeTab, setActiveTab] = useState(Tabs[0]);
  const isFocused = useIsFocused();
  return (
    <MainLayout>
      <View style={{flex: 1, paddingBottom: 200}}>
        <RenderCalander />
        <View
          style={{
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}>
                <MyText
                  style={{fontSize: isActive ? FONT_SIZE.lg : FONT_SIZE.sm}}
                  bold={isActive ? FONT_WEIGHT.bold : FONT_WEIGHT.normal}
                  center
                  color={isActive ? COLORS.black : COLORS.grey}>
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

export default VendorEventScreen;
