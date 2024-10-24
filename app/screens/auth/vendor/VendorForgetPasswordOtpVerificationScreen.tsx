import {ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import LayoutBG from '../../../components/layout/LayoutBG';
import BackBtn from '../../../components/buttons/BackBtn';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import OTPInput from '../../../components/inputs/OtpInput';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../../naviagtion/types';
import {
  api_OtpResend,
  api_verifyEmail,
  api_verifyForgetPasswordOTP,
} from '../../../api/auth';
import {VerifyEmailResponse} from '../../../types/apiResponse';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {ShowAlert} from '../../../utils/alert';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';

const VendorForgetPasswordOtpVerificationScreen = () => {
  const params =
    useRoute<
      RouteProp<RootStackParams, 'VendorForgetPasswordOtpVerification'>
    >().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const resendOTPStartTimmer = () => {
    setMinutes(2);
    setSeconds(59);
  };

  const onSubmit = async () => {
    if (code.length < 4) return;
    console.log(code);

    try {
      setLoading(true);
      const res = (await api_verifyForgetPasswordOTP({
        refId: params.verifyToken,
        otp: code,
      })) as any;
      console.log(res);
      ShowAlert({textBody: res?.message});
      navigation.navigate('VendorSetNewPassword', {
        verifyToken: params.verifyToken,
        otp: code,
      });
    } catch (error: any) {
      ShowAlert({textBody: error.message, type: ALERT_TYPE.DANGER});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  return (
    <LayoutBG type="bg-leaf">
      <ScrollView contentContainerStyle={{marginHorizontal: 20}}>
        <BackBtn onPress={navigation.goBack} />
        <View>
          <MyText
            bold={FONT_WEIGHT.bold}
            size={FONT_SIZE['2xl']}
            style={{marginTop: 100, marginBottom: 10}}>
            Enter Verfication Code
          </MyText>
          <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
            We have sent a verification code to your email
          </MyText>

          <View style={{marginVertical: 40}}>
            <OTPInput
              onOTPChange={e => {
                setCode(e);
              }}
            />
          </View>
          {seconds > 0 || minutes > 0 ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <MyText>
                Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </MyText>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignSelf: 'center', gap: 5}}>
              <MyText center size={FONT_SIZE.sm} color={COLORS.grey}>
                Didn’t Receive the Code{' '}
              </MyText>
              <TouchableOpacity onPress={resendOTPStartTimmer}>
                <MyText
                  size={FONT_SIZE.sm}
                  color={COLORS.greenDark}
                  bold={FONT_WEIGHT.bold}>
                  Resend
                </MyText>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={{marginTop: 40}}>
          <PrimaryBtn
            onPress={() => {
              onSubmit();
            }}
            text="Submit"
            loading={loading}
          />
        </View>
      </ScrollView>
    </LayoutBG>
  );
};

export default VendorForgetPasswordOtpVerificationScreen;
