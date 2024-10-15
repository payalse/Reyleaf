import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {MyText} from '../../../components/MyText';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {COLORS, FONT_WEIGHT, wp} from '../../../styles';
import LogoSvg from '../../../../assets/svg/icons/icon.svg';
import LayoutBG from '../../../components/layout/LayoutBG';

import GoogleImg from '../../../../assets/img/icons/google-logo.png';
import FacebookImg from '../../../../assets/img/icons/facebook-logo.png';
import AppleImg from '../../../../assets/img/icons/apple-logo.png';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AboutUsStackParams} from '../../../naviagtion/DrawerNavigator';

const des =
  "“Reyleaf is committed to keeping its promise to the environment by helping to better human behavior, that directly impacts nature. We believe that changing small habits in our everyday lives, also without compromising an individual's identity, can have a great impact on planet earth. Every person has a responsibility towards Mother Nature, to keep Her and every creature She is hosting, safe with pollution free habitats. Reyleaf is the App that will assist communities to be kinder to the environment. Reyleaf will provide the convenience to all to be better at implementing habits that are less damaging to nature. Reyleaf will help revive ecosystems. Reyleaf is the one stop shop App, where you can support local Eco-Friendly merchants. Also, a social media platform, where friendships are rooted in the shared love of preserving nature. Together we can change for the Better!”";
const googleAppUrl = 'google://';
const googleWebUrl = 'https://www.google.com';
const facebookAppUrl = 'fb://';
const facebookWebUrl = 'https://www.facebook.com';
const AboutUsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AboutUsStackParams>>();

  const openGoogle = async () => {
    try {
      const supported = await Linking.canOpenURL(googleAppUrl);
      if (supported) {
        await Linking.openURL(googleAppUrl);
      } else {
        await Linking.openURL(googleWebUrl);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  const openFacebook = async () => {
    try {
      const supported = await Linking.canOpenURL(facebookAppUrl);
      if (supported) {
        await Linking.openURL(facebookAppUrl);
      } else {
        await Linking.openURL(facebookWebUrl);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };
  return (
    <LayoutBG type="bg-tr">
      <SafeAreaView />
      <SecondaryHeader onBack={navigation.goBack} title="About Us" />
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          gap: 50,
        }}>
        <LogoSvg height={120} />
        <MyText center color={COLORS.grey} style={{lineHeight: 20}}>
          {des}
        </MyText>
      </ScrollView>

      <View style={{padding: 20, marginVertical: 20}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            gap: 20,
          }}>
          <TouchableOpacity onPress={openGoogle}>
            <View style={styles.socialIconContainer}>
              <Image source={GoogleImg} style={styles.socialIcon} />
            </View>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <View style={styles.socialIconContainer}>
              <Image source={AppleImg} style={styles.socialIcon} />
            </View>
          )}

          <TouchableOpacity onPress={openFacebook}>
            <View style={styles.socialIconContainer}>
              <Image source={FacebookImg} style={styles.socialIcon} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <TouchableOpacity>
            <MyText
              style={{
                fontWeight: FONT_WEIGHT.semibold,
                color: COLORS.greenDark,
                textDecorationLine: 'underline',
              }}
              onPress={() => navigation.navigate('PrivacyPolicy')}>
              Privacy Policy
            </MyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('TermAndCondition')}>
            <MyText
              style={{
                fontWeight: FONT_WEIGHT.semibold,
                color: COLORS.greenDark,
                textDecorationLine: 'underline',
              }}>
              Terms & Condition
            </MyText>
          </TouchableOpacity>
        </View>
      </View>
    </LayoutBG>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  socialIconContainer: {
    width: wp(15),
    height: wp(15),
    backgroundColor: COLORS.white,
    borderRadius: wp(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: '40%',
    height: '40%',
    zIndex: 1,
  },
});
