import {ScrollView, View} from 'react-native';
import React from 'react';

import UnderReviewSvg from '../../../../assets/svg/illustrations/UnderReview.svg';
import LayoutBG from '../../../components/layout/LayoutBG';
import {MyText} from '../../../components/MyText';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../../naviagtion/types';

const ApplicationUnderReviewScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const params =
    useRoute<RouteProp<RootStackParams, 'ApplicationUnderReview'>>().params;

  const isRejected = params?.vendorStatus === 3;
  const rejectReason = params?.rejectReason;

  return (
    <LayoutBG type="bg-tr-bl">
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 20,
        }}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <UnderReviewSvg style={{marginTop: 100, marginBottom: 50}} />

          <MyText
            color={COLORS.black}
            size={FONT_SIZE['3xl']}
            center
            bold={FONT_WEIGHT.bold}>
            {isRejected ? 'Application Rejected' : 'Your Application is'}
          </MyText>
          {!isRejected && (
            <MyText
              color={COLORS.black}
              size={FONT_SIZE['3xl']}
              center
              bold={FONT_WEIGHT.bold}>
              Under Review
            </MyText>
          )}

          <MyText
            style={{marginVertical: 20, lineHeight: 25}}
            center
            color={COLORS.grey}>
            {isRejected
              ? rejectReason ||
                'Your application was not approved at this time. Please contact support for more information.'
              : 'Thank you for completing your profile. We are currently reviewing your account and will notify you once a decision is made. We appreciate your patience.'}
          </MyText>
        </View>
      </ScrollView>
      <View style={{paddingHorizontal: 20, paddingBottom: 40}}>
        <PrimaryBtn
          text="Go to Login"
          onPress={() => navigation.navigate('VendorLogin')}
        />
      </View>
    </LayoutBG>
  );
};

export default ApplicationUnderReviewScreen;
