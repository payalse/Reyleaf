import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SupportStackParams} from '../../../naviagtion/DrawerNavigator';
import {FlatList} from 'react-native';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {MyText} from '../../../components/MyText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {api_getFAQ} from '../../../api/feedback';
import {FAQ} from '../../../types';
import {GetMyFAQResponse} from '../../../types/apiResponse';

const FAQScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SupportStackParams>>();
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FAQ[]>([]);
  const isFocused = useIsFocused();
  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getFAQ()) as GetMyFAQResponse;
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestApi();
  }, [isFocused]);

  if (loading) {
    return <FullScreenLoader />;
  }
  return (
    <View style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={() => {
          return (
            <View>
              <SafeAreaView />
              <SecondaryHeader
                backBtnContainerStyle={{left: 0}}
                onBack={navigation.goBack}
                title="FAQs"
              />
            </View>
          );
        }}
        data={data}
        contentContainerStyle={{marginHorizontal: 20, gap: 20}}
        renderItem={({item, index}) => {
          const isOpen = activeIndex === index;
          return (
            <TouchableOpacity
              onPress={() => setActiveIndex(isOpen ? null : index)}
              style={{
                padding: 20,
                backgroundColor: COLORS.white,
                borderRadius: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
                  {item.title}
                </MyText>
                <View
                  style={{
                    backgroundColor: COLORS.greenDark,
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AntDesign
                    name={!isOpen ? 'caretdown' : 'caretup'}
                    color={COLORS.white}
                    size={FONT_SIZE.sm}
                  />
                </View>
              </View>
              <MyText
                style={{
                  color: COLORS.grey,
                  fontSize: FONT_SIZE.sm,
                  lineHeight: 20,
                  paddingVertical: 20,
                  display: isOpen ? 'flex' : 'none',
                }}>
                {item.description}
              </MyText>
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('SupportTicket')}
        style={{
          backgroundColor: COLORS.greenDark,
          padding: 20,
          borderRadius: 20,
          marginTop: 'auto',
          marginBottom: 25,
          marginHorizontal: 20,
          flexDirection: 'row',
          gap: 10,
        }}>
        <View style={{gap: 5, flex: 1}}>
          <MyText color={COLORS.white} bold={FONT_WEIGHT.semibold}>
            Contact Support
          </MyText>
          <MyText style={{flex: 1}} color={COLORS.white} size={FONT_SIZE.xs}>
            Need help or have a question? Check out our FAQ or reach out to our
            support team. We're here to assist you!
          </MyText>
        </View>
        <View
          style={{
            backgroundColor: COLORS.white,
            width: 50,
            height: 50,
            borderRadius: 50 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            name="chatbubbles"
            size={FONT_SIZE['2xl']}
            color={COLORS.greenDark}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FAQScreen;
