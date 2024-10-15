import React, {useEffect} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONT_SIZE, FONT_WEIGHT, wp} from '../../styles';

// COMPONENTS
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import MyButton from '../../components/buttons/MyButton';
import {MyText} from '../../components/MyText';

// ICONS
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Apple from '../../components/icons/Apple';
import Facebook from '../../components/icons/Facebook';
import APPLOGO from '../../../assets/svg/icons/icon.svg';
import LayoutBG from '../../components/layout/LayoutBG';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../naviagtion/types';
import GoogleButton from './GoogleButton';
const WelcomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  return (
    <LayoutBG type="bg-tr-bl">
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <View
          style={{
            width: wp(35),
            height: wp(55),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <APPLOGO width={wp(35)} height={wp(55)} />
        </View>
        <MyText
          bold={FONT_WEIGHT.bold}
          color={COLORS.black}
          size={FONT_SIZE['3xl']}>
          Welcome Back!
        </MyText>

        <MyText
          center
          size={FONT_SIZE.sm}
          style={{marginTop: 5}}
          color={COLORS.grey}>
          Welcome back to Reynette - your eco- friendly heaven!
        </MyText>

        <View style={{width: '90%', paddingVertical: 20, gap: 20}}>
          {/* <GoogleButton /> */}

          {/* <MyButton
            text="Continue with Facebook"
            leftComp={() => <Facebook />}
          /> */}
          <PrimaryBtn
            text="Continue with Email"
            onPress={() => navigation.navigate('Login')}
            leftComp={() => (
              <Ionicons size={24} color={COLORS.white} name="mail-outline" />
            )}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 1,
              opacity: 0.4,
              backgroundColor: COLORS.grey,
              flex: 1,
            }}
          />

          <MyText
            size={FONT_SIZE.sm}
            style={{opacity: 0.5, paddingHorizontal: 20}}>
            Or Login as seller account
          </MyText>
          <View
            style={{
              height: 1,
              opacity: 0.4,
              backgroundColor: COLORS.grey,
              flex: 1,
            }}
          />
        </View>
        <View style={{width: '90%', paddingVertical: 20}}>
          <MyButton
            onPress={() => navigation.navigate('VendorLogin')}
            leftComp={() => (
              <FontAwesome size={20} color={'#444'} name="user-circle-o" />
            )}
            text="Continue with Seller account"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 1,
              opacity: 0.4,
              backgroundColor: COLORS.grey,
              flex: 1,
            }}
          />

          <MyText
            size={FONT_SIZE.sm}
            style={{opacity: 0.5, paddingHorizontal: 20}}>
            Or explore products
          </MyText>
          <View
            style={{
              height: 1,
              opacity: 0.4,
              backgroundColor: COLORS.grey,
              flex: 1,
            }}
          />
        </View>
        <View style={{width: '90%', paddingVertical: 20}}>
          <MyButton
            onPress={() => navigation.navigate('Home')}
            leftComp={() => (
              <FontAwesome size={20} color={'#444'} name="user-circle-o" />
            )}
            text="Explore Products"
          />
        </View>
      </ScrollView>
    </LayoutBG>
  );
};

export default WelcomeScreen;
