import { SafeAreaView, View } from 'react-native';
import React, { useState } from 'react';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MyText } from '../../../components/MyText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SupportStackParams } from '../../../naviagtion/DrawerNavigator';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { api_updateSupportTicket } from '../../../api/support';
import FullScreenLoader from '../../../components/FullScreenLoader';

const TicketDetailScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SupportStackParams>>();
  const { item } =
    useRoute<RouteProp<SupportStackParams, 'TicketDetail'>>().params;
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();

  const requestApi = async () => {
    try {
      setLoading(true);
      const data = {
        id: item?._id,
        action: 'Closed',
      };
      const res: any = await api_updateSupportTicket(token!, data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      navigation.goBack()
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      {loading && <FullScreenLoader />}
      <SecondaryHeader onBack={navigation.goBack} title="Ticket Details" />

      <View style={{ margin: 20, flex: 1 }}>
        <View style={{ gap: 10, marginVertical: 20 }}>
          <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
            Title
          </MyText>
          <MyText
            bold={FONT_WEIGHT.normal}
            size={FONT_SIZE.sm}
            color={COLORS.grey}
          >
            {item?.title}
          </MyText>
        </View>
        <View style={{ gap: 10, marginVertical: 20 }}>
          <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
            Subject Category
          </MyText>
          <MyText
            bold={FONT_WEIGHT.normal}
            size={FONT_SIZE.sm}
            color={COLORS.grey}
          >
            Category name
          </MyText>
        </View>
        <View style={{ gap: 10, marginVertical: 20 }}>
          <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
            Description
          </MyText>
          <MyText
            bold={FONT_WEIGHT.normal}
            size={FONT_SIZE.sm}
            color={COLORS.grey}
          >
            {item?.description}
          </MyText>
        </View>
        <View style={{ gap: 10, marginVertical: 20 }}>
          <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
            Status
          </MyText>
          <MyText
            bold={FONT_WEIGHT.normal}
            size={FONT_SIZE.sm}
            color={item?.status === 'Open' ? COLORS.greenDark : COLORS.red}
          >
            {item?.status}
          </MyText>
        </View>
        <View style={{ gap: 10, marginVertical: 20 }}>
          <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
            Created on
          </MyText>
          <MyText
            bold={FONT_WEIGHT.normal}
            size={FONT_SIZE.sm}
            color={COLORS.grey}
          >
            28th Nov 2023 at 10:34 AM
          </MyText>
        </View>
        {item?.status === 'Open' ? (
          <PrimaryBtn
            onPress={requestApi}
            conatinerStyle={{ marginTop: 'auto', marginBottom: 10 }}
            text="Mark as Resolved"
          />
        ) : null}
      </View>
    </View>
  );
};

export default TicketDetailScreen;
