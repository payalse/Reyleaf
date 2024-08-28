import { ScrollView, Text, View } from 'react-native';
import React from 'react';

import UnderReviewSvg from '../../../../assets/svg/illustrations/UnderReview.svg';
import LayoutBG from '../../../components/layout/LayoutBG';
import { MyText } from '../../../components/MyText';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { setIsAuthenticated } from '../../../redux/features/auth/authSlice';
import {
  changeAppMode,
  setFirstLaunched,
} from '../../../redux/features/app/appSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';

const ApplicationUnderReviewScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <LayoutBG type="bg-tr-bl">
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 20,
        }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <UnderReviewSvg style={{ marginTop: 100, marginBottom: 50 }} />
          <MyText
            color={COLORS.black}
            size={FONT_SIZE['3xl']}
            center
            bold={FONT_WEIGHT.bold}
          >
            Your Application is
          </MyText>
          <MyText
            color={COLORS.black}
            size={FONT_SIZE['3xl']}
            center
            bold={FONT_WEIGHT.bold}
          >
            Under Review
          </MyText>
          <MyText
            style={{ marginVertical: 20, lineHeight: 25 }}
            center
            color={COLORS.grey}
          >
            Thank you for completing your profile. We are currently reviewing your
            profile and will notify you once a decision is made. We
            appreciate your patience.
          </MyText>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <PrimaryBtn
          text="Connect with Us"
          onPress={() => {
            dispatch(changeAppMode('VENDOR'));
            dispatch(setFirstLaunched(false));
            dispatch(setIsAuthenticated(true));
          }}
        />
      </View>
    </LayoutBG>
  );
};

export default ApplicationUnderReviewScreen;
