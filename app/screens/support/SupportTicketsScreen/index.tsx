import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT, hp, wp} from '../../../styles';
import Entypo from 'react-native-vector-icons/Entypo';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {MyText} from '../../../components/MyText';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SupportStackParams} from '../../../naviagtion/DrawerNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../redux/store';
import {api_getAllSupportTickets} from '../../../api/support';
import {setSupportTicket} from '../../../redux/features/support/supportSlice';
import FullScreenLoader from '../../../components/FullScreenLoader';

const SupportTicketsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SupportStackParams>>();
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((s: RootState) => s.auth);
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const {supportTicket} = useSelector((s: RootState) => s.support);

  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getAllSupportTickets(token!);
      dispatch(setSupportTicket(res?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    !supportTicket?.length && setLoading(true);
    requestApi();
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView />
      {loading && <FullScreenLoader />}
      <SecondaryHeader onBack={navigation.goBack} title="Support Ticket" />
      <FlatList
        style={{marginVertical: 20}}
        data={supportTicket}
        ListEmptyComponent={() => (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{color: COLORS.grey, fontSize: FONT_SIZE.base}}>
              No Support Ticket Found
            </Text>
          </View>
        )}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SupportChat', {item});
              }}
              style={{
                padding: 20,
                backgroundColor: COLORS.white,
                marginHorizontal: 20,
                marginVertical: 10,
                borderRadius: 15,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
                  {item?.title}
                </MyText>
                <View
                  style={{
                    backgroundColor:
                      item?.status === 'Open' ? COLORS.greenDark : COLORS.red,
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                    {item?.status}
                  </MyText>
                </View>
              </View>
              <MyText color={COLORS.grey} size={FONT_SIZE.sm}>
                {item?.description}
              </MyText>
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateNewTicket')}
        style={{
          backgroundColor: COLORS.greenDark,
          width: wp(20),
          height: wp(20),
          borderRadius: wp(20) / 2,
          position: 'absolute',
          bottom: hp(5),
          right: wp(5),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Entypo name="plus" size={FONT_SIZE['4xl']} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

export default SupportTicketsScreen;

const styles = StyleSheet.create({});
