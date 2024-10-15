import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {MyText} from '../../../components/MyText';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import InputWrapper from '../../../components/inputs/InputWrapper';
import TextArea from '../../../components/inputs/TextArea';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';

import Feedback1Svg from '../../../../assets/svg/illustrations/feedback1.svg';
import Feedback2Svg from '../../../../assets/svg/illustrations/feedback2.svg';
import Feedback3Svg from '../../../../assets/svg/illustrations/feedback3.svg';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {useAppAlert} from '../../../context/AppAlertContext';
import {api_addFeedback} from '../../../api/feedback';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {ShowAlert} from '../../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState('happy');
  const [text, setText] = useState('');
  const {showModal} = useAppAlert()!;
  const {token} = useSelector((s: RootState) => s.auth);

  const requestApi = async () => {
    try {
      if (!text) {
        ShowAlert({
          textBody: 'Please add your feedback!',
          type: ALERT_TYPE.WARNING,
        });
        return;
      }
      setLoading(true);
      const data = {
        emoji: emoji,
        description: text,
      };
      const res = (await api_addFeedback(token!, data)) as any;
      console.log(res);
      showModal({text: 'Thanks for your feedback'});
      navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FullScreenLoader />;
  }
  return (
    <MainLayout
      headerComp={
        <SecondaryHeader
          onBack={navigation.goBack}
          backBtnContainerStyle={{left: 0}}
          title="Feedback"
        />
      }>
      <View
        style={{
          marginTop: 70,
          marginBottom: 20,
          flexDirection: 'row',
          gap: 20,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <TouchableOpacity onPress={() => setEmoji('sad')}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: emoji == 'sad' ? '' : COLORS.greenDark,
              backgroundColor:
                emoji == 'sad' ? COLORS.greenDark : 'transparent',
              borderWidth: 2,
              borderRadius: emoji == 'sad' ? 55 : 35,
              width: emoji == 'sad' ? 100 : 70,
              height: emoji == 'sad' ? 100 : 70,
              opacity: emoji == 'sad' ? 1 : 0.3,
            }}>
            <Feedback1Svg />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEmoji('happy')}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: emoji == 'happy' ? '' : COLORS.greenDark,
              backgroundColor:
                emoji == 'happy' ? COLORS.greenDark : 'transparent',
              borderWidth: 2,
              borderRadius: 50,
              width: emoji == 'happy' ? 100 : 70,
              height: emoji == 'happy' ? 100 : 70,
              opacity: emoji == 'happy' ? 1 : 0.3,
            }}>
            <Feedback3Svg />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEmoji('frustrated')}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: emoji == 'frustrated' ? '' : COLORS.greenDark,
              backgroundColor:
                emoji == 'frustrated' ? COLORS.greenDark : 'transparent',
              borderWidth: 2,
              borderRadius: emoji == 'frustrated' ? 55 : 35,
              width: emoji == 'frustrated' ? 100 : 70,
              height: emoji == 'frustrated' ? 100 : 70,
              opacity: emoji == 'frustrated' ? 1 : 0.3,
            }}>
            <Feedback2Svg />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{gap: 10, marginBottom: 15}}>
        <MyText
          center
          color={COLORS.greenDark}
          size={FONT_SIZE.xl}
          bold={FONT_WEIGHT.bold}>
          How was your Experience
        </MyText>
        <MyText center color={COLORS.grey}>
          Your feedback helps us improve! Share your thoughts and let us know
          how we can make your experience better. Thank you!
        </MyText>
      </View>

      <InputWrapper title="Feedback">
        <TextArea
          onChangeText={(o: any) => {
            setText(o);
          }}
          value={text}
          placeholder="Type Feedback Here"
        />
      </InputWrapper>
      <PrimaryBtn onPress={requestApi} text="Send Feedback" />
    </MainLayout>
  );
};

export default FeedbackScreen;
