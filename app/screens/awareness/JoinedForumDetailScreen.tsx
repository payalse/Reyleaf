import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, D, FONT_SIZE, FONT_WEIGHT, hp, wp} from '../../styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MyText} from '../../components/MyText';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GradientBox from '../../components/GradientBox';
import FeatureContent from './components/FeatureContent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AwarenessStackParams} from '../../naviagtion/types';
import {api_getForumDetails} from '../../api/forum';
import {useAppAlert} from '../../context/AppAlertContext';
import {RootState} from '../../redux/store';
import {useSelector} from 'react-redux';
import FullScreenLoader from '../../components/FullScreenLoader';
import {api_joinLeaveForm} from '../../api/awareness';

const IMAGE_URI =
  'https://media.istockphoto.com/id/1421993924/photo/creative-writing-at-home-by-female-hands-enjoying-a-calm-peaceful-day-off-indoors-woman.webp?b=1&s=170667a&w=0&k=20&c=GstM6PeYECR0ftSIk-60TIO2b6JUhkMG3tlUhFDpR8k=';

const JoinedForumDetailScreen = () => {
  useHideBottomBar({});

  const navigation =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();
  const params =
    useRoute<RouteProp<AwarenessStackParams, 'JoinedForumDetail'>>().params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const {token} = useSelector((s: RootState) => s.auth);
  const {showModal} = useAppAlert()!;
  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getForumDetails(token!, params.id);
      console.log(res);
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveForum = async () => {
    try {
      setLoading(true);
      const res: any = await api_joinLeaveForm(token!, params.id);
      console.log(res);
      showModal({text: res?.message});
      navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestApi();
  }, []);

  return (
    <View style={{flex: 1}}>
      {loading && <FullScreenLoader />}
      <View
        style={{
          position: 'absolute',
          width: D.width,
          height: hp(100),
          zIndex: 1,
          left: 0,
          top: 0,
          pointerEvents: 'box-none',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddContent')}
          style={{
            position: 'absolute',
            bottom: hp(5),
            right: wp(4),
            zIndex: 10,
          }}>
          <GradientBox
            conatinerStyle={{
              width: 80,
              borderRadius: 80,
              height: 80,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Entypo name="plus" color={COLORS.white} size={45} />
          </GradientBox>
        </TouchableOpacity>
      </View>
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: 200,
          backgroundColor: COLORS.white,
        }}>
        <View style={{height: D.height * 0.45, backgroundColor: COLORS.grey}}>
          <SafeAreaView>
            <SecondaryHeader
              title="Forum Detail"
              onBack={navigation.goBack}
              backIconColor={COLORS.black}
              backIconBgColor={COLORS.white}
              backTextColor={COLORS.white}
              titleColor={COLORS.white}
            />
          </SafeAreaView>
          <Image
            style={{
              position: 'absolute',
              zIndex: -1,
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              resizeMode: 'cover',
            }}
            source={{uri: IMAGE_URI}}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            marginTop: -30,
            position: 'relative',
            paddingTop: 40,
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View>
              <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
                {data?.title}
              </MyText>
              <View
                style={{
                  backgroundColor: COLORS.darkBrown,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  borderRadius: 20,
                  flexDirection: 'row',
                  gap: 5,
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <AntDesign name="clockcircle" size={15} color={COLORS.white} />
                <MyText size={FONT_SIZE.xs} color={COLORS.white}>
                  {data?.members?.length || 0} members
                </MyText>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleLeaveForum}
              style={{
                backgroundColor: 'red',
                width: 60,
                height: 60,
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons name={'exit'} color={COLORS.white} size={24} />
            </TouchableOpacity>
          </View>

          <MyText
            size={FONT_SIZE.base}
            bold={FONT_WEIGHT.bold}
            style={{marginTop: 20}}>
            Description
          </MyText>
          <MyText
            style={{marginBottom: 30, marginTop: 10, lineHeight: 25}}
            color={COLORS.grey}>
            {data?.description || ''}
          </MyText>
          <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
            Featured Contents
          </MyText>
        </View>

        {[1, 1, 1, 1, 1, 1, 1].map((_, index) => {
          return <FeatureContent key={index} />;
        })}
      </ScrollView>
    </View>
  );
};

export default JoinedForumDetailScreen;
