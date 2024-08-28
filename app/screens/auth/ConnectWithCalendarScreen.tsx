import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import LayoutBG from '../../components/layout/LayoutBG';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {MyText} from '../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import AppleCalanderSvg from '../../../assets/img/icons/AppleCalander.svg';
import GoogleCalanderSvg from '../../../assets/img/icons/GoogleCalander.svg';
import OutlookCalanderSvg from '../../../assets/img/icons/OutlookCalendar.svg';
import UiSwitch from '../../components/buttons/UiSwitch';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../naviagtion/types';

const data = [
  {
    id: 1,
    name: 'Google Calendar',
  },
  {
    id: 2,
    name: 'Apple Calendar',
  },
  {
    id: 3,
    name: 'Outlook Calendar',
  },
];

const ConnectWithCalendarScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <LayoutBG type="bg-leaf">
      <SecondaryHeader title="" />
      <ScrollView
        contentContainerStyle={{
          padding: 25,
        }}>
        <MyText size={FONT_SIZE['1.5xl']} bold={FONT_WEIGHT.bold}>
          Connect you Calendar
        </MyText>
        <MyText style={{marginVertical: 10}} color={COLORS.grey}>
          Lorem ipsom is simple dummy Text that can
        </MyText>
        <View>
          {data.map((i, index) => {
            const thisIsActive = index === activeIndex;
            if (Platform.OS === 'android' && index === 1) {
              return null;
            }
            if (Platform.OS === 'ios' && index === 0) {
              return null;
            }
            return (
              <View
                style={{
                  height: 150,
                  backgroundColor: thisIsActive
                    ? COLORS.greenDark
                    : `rgba(0,0,0,0.1)`,
                  marginVertical: 10,
                  borderRadius: 20,
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    paddingLeft: 20,
                  }}>
                  <UiSwitch
                    onChange={() => {
                      setActiveIndex(index);
                    }}
                    value={thisIsActive}
                  />
                  <View style={{marginTop: 20}}>
                    <MyText
                      color={thisIsActive ? COLORS.white : COLORS.black}
                      size={FONT_SIZE.xl}
                      bold={FONT_WEIGHT.bold}>
                      Connect to
                    </MyText>
                    <MyText
                      color={thisIsActive ? COLORS.white : COLORS.black}
                      size={FONT_SIZE.xl}
                      bold={FONT_WEIGHT.bold}>
                      {i.name}
                    </MyText>
                  </View>
                </View>
                <View
                  style={{
                    width: 120,
                    height: 120,
                    backgroundColor: `rgba(0,0,0,0.05)`,
                    borderRadius: 120 / 2,
                    position: 'absolute',
                    top: -15,
                    right: -15,
                  }}>
                  {i.id === 1 && (
                    <GoogleCalanderSvg
                      style={{position: 'absolute', left: 30, bottom: 30}}
                    />
                  )}
                  {i.id === 2 && (
                    <AppleCalanderSvg
                      style={{position: 'absolute', left: 30, bottom: 30}}
                    />
                  )}
                  {i.id === 3 && (
                    <OutlookCalanderSvg
                      style={{position: 'absolute', left: 30, bottom: 30}}
                    />
                  )}
                </View>
                <View
                  style={{
                    width: 175,
                    height: 175,
                    backgroundColor: `rgba(0,0,0,0.05)`,
                    borderRadius: 170 / 2,
                    position: 'absolute',
                    top: -40,
                    right: -40,
                  }}></View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <PrimaryBtn
        text="Next"
        onPress={() => navigation.navigate('AccountCreatedSuccess')}
        conatinerStyle={{marginBottom: 20, alignSelf: 'center', width: '90%'}}
      />
    </LayoutBG>
  );
};

export default ConnectWithCalendarScreen;

const styles = StyleSheet.create({});
