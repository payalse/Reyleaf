import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import InputWrapper from '../../../components/inputs/InputWrapper';
import TextArea from '../../../components/inputs/TextArea';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {OrderStackParams} from '../../../naviagtion/DrawerNavigator';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {Reviews} from '../../../types';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {api_addReviewByUser} from '../../../api/user';
import {useAppAlert} from '../../../context/AppAlertContext';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {ShowAlert} from '../../../utils/alert';
import {Rating} from 'react-native-ratings';

const OrderReviewScreen = () => {
  const navigation = useNavigation();
  const params = useRoute<RouteProp<OrderStackParams, 'OrderDetail'>>().params;
  const {token} = useSelector((s: RootState) => s.auth);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const {showModal} = useAppAlert()!;
  const [loading, setLoading] = useState(false);
  console.log(params.orderId);
  const requestApi = async () => {
    try {
      if (!text || !rating) {
        ShowAlert({
          textBody: 'Please add your feedback!',
          type: ALERT_TYPE.WARNING,
        });
        return;
      }
      setLoading(true);
      const data = {
        rating: rating,
        review: text,
      };
      console.log(data);
      setLoading(true);
      const res = await api_addReviewByUser(token!, data, params.orderId);
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
          backBtnContainerStyle={{left: 0}}
          onBack={navigation.goBack}
          title=""
        />
      }>
      <View style={{flex: 1, paddingVertical: 20, marginTop: 50}}>
        <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE['xl']}>
          Enter your Review
        </MyText>
        <MyText style={{marginTop: 5}} color={COLORS.grey}>
          Share your thoughts about our service or product experience.
        </MyText>

        <View
          style={{
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{margin: 10, flexDirection: 'row', gap: 18}}>
            <Rating
              type="star"
              imageSize={40}
              onFinishRating={(o: any) => setRating(o)}
            />
          </View>
          <MyText size={FONT_SIZE.sm} style={{marginTop: 5}}>
            Select Stars for review
          </MyText>
        </View>

        <InputWrapper title="Write Review">
          <TextArea
            onChangeText={(o: any) => {
              setText(o);
            }}
            value={text}
            placeholder="Type Here"
          />
        </InputWrapper>
        <PrimaryBtn onPress={requestApi} text="Submit" />
      </View>
    </MainLayout>
  );
};

export default OrderReviewScreen;

const styles = StyleSheet.create({});
