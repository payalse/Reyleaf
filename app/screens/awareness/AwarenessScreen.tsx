import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MainHeader from '../../components/header/MainHeader';
import MainLayout from '../../components/layout/MainLayout';
import { COLORS, D, FONT_WEIGHT, hp } from '../../styles';
import { MyText } from '../../components/MyText';
import AllFormsTab from './AllFormsTab';
import ResourceAndArticleTab from './ResourceAndArticleTab';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AwarenessStackParams } from '../../naviagtion/types';
import AddActionButton from '../../components/buttons/AddActionButton';
import { TAB_BAR_BG_HEIGHT } from '../../naviagtion/MainTab';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import VendorEventScreen from '../event/VandorEvents';

let Tabs = ['All Forums', 'Resource & Articles'];
const AwarenessScreen = () => {
  const [activeTab, setActiveTab] = useState(Tabs[0]);
  const navigation =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();
  const isFocused = useIsFocused();
  const { token, user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    if (user?.role == 2) {
      Tabs = ['Discussions', 'Events'];
    }
  }, [isFocused]);
  return (
    <View style={{ flex: 1 }}>
      {user?.role == 2 ? (
        <>
          <View
            style={{
              position: 'absolute',
              width: D.width,
              height: hp(100) - TAB_BAR_BG_HEIGHT * 0.8,
              zIndex: 1,
              left: 0,
              top: 0,
              pointerEvents: 'box-none',
            }}
          >
            {activeTab == Tabs[1] && (
              <TouchableOpacity
                onPress={() => navigation.navigate('AddEvent')}
                style={{ position: 'absolute', zIndex: 2, bottom: 10 }}
              >
                <AddActionButton
                  containerStyle={{ paddingBottom: 0 }}
                  onPress={() => navigation.navigate('AddEvent')}
                />
              </TouchableOpacity>
            )}
          </View>
          <MainLayout
            headerComp={
              <MainHeader
                onMessagePress={() => navigation.navigate('ChatStack')}
                onNotiPress={() => navigation.navigate('AppNotification')}
              />
            }
          >
            <View style={{ flex: 1, paddingBottom: 160 }}>
              {/* TAB TOGGLE */}
              <View
                style={{
                  backgroundColor: COLORS.white,
                  paddingHorizontal: 8,
                  borderRadius: 30,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  gap: 15,
                  marginTop: 20,
                }}
              >
                {Tabs.map(tab => {
                  const isActive = tab === activeTab;
                  return (
                    <TouchableOpacity
                      onPress={() => setActiveTab(tab)}
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
              {activeTab === Tabs[0] && <AllFormsTab isFocused={isFocused} />}
              {activeTab === Tabs[1] && (
                <VendorEventScreen />
              )}
            </View>
          </MainLayout>
        </>
      ) : (
        <>
          <View
            style={{
              position: 'absolute',
              width: D.width,
              height: hp(100) - TAB_BAR_BG_HEIGHT * 0.8,
              zIndex: 1,
              left: 0,
              top: 0,
              pointerEvents: 'box-none',
            }}
          >
            {activeTab == Tabs[1] && (
              <TouchableOpacity
                onPress={() => navigation.navigate('AddResource')}
                style={{ position: 'absolute', zIndex: 2, bottom: 10 }}
              >
                <AddActionButton
                  containerStyle={{ paddingBottom: 0 }}
                  onPress={() => navigation.navigate('AddResource')}
                />
              </TouchableOpacity>
            )}
          </View>
          <MainLayout
            headerComp={
              <MainHeader
                onMessagePress={() => navigation.navigate('ChatStack')}
                onNotiPress={() => navigation.navigate('AppNotification')}
              />
            }
          >
            <View style={{ flex: 1, paddingBottom: 160 }}>
              {/* TAB TOGGLE */}
              <View
                style={{
                  backgroundColor: COLORS.white,
                  paddingHorizontal: 8,
                  borderRadius: 30,
                  paddingVertical: 8,
                  flexDirection: 'row',
                  gap: 15,
                  marginTop: 20,
                }}
              >
                {Tabs.map(tab => {
                  const isActive = tab === activeTab;
                  return (
                    <TouchableOpacity
                      onPress={() => setActiveTab(tab)}
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
              {activeTab === Tabs[0] && <AllFormsTab isFocused={isFocused} />}
              {activeTab === Tabs[1] && (
                <ResourceAndArticleTab isFocused={isFocused} />
              )}
            </View>
          </MainLayout>
        </>
      )}
    </View>
  );
};

export default AwarenessScreen;
