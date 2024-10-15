import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AwarenessStackParams} from '../../naviagtion/types';
import {COLORS, D, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MyText} from '../../components/MyText';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {api_getForumDetails} from '../../api/forum';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import FullScreenLoader from '../../components/FullScreenLoader';
import {api_joinLeaveForm} from '../../api/awareness';
import MyButton from '../../components/buttons/MyButton';
import {useAppAlert} from '../../context/AppAlertContext';
import {BUILD_IMAGE_URL} from '../../api';

const ForumDetailScreen = () => {
  useHideBottomBar({});
  const navigation = useNavigation();
  const params =
    useRoute<RouteProp<AwarenessStackParams, 'ForumDetail'>>().params;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const {token} = useSelector((s: RootState) => s.auth);
  const [isJoin, setIsJoin] = useState<null | boolean>(null);
  const {showModal} = useAppAlert()!;

  const requestApi = async () => {
    try {
      setLoading(true);
      const res: any = await api_getForumDetails(token!, params.id);
      console.log(res);
      setData(res.data);
      setIsJoin(res?.data?.isJoined);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      setLoading(false);
      const res: any = await api_joinLeaveForm(token!, params.id);
      console.log(res);
      setIsJoin(!isJoin);
      showModal({text: res?.message});
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
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: 200,
          backgroundColor: COLORS.white,
        }}>
        {loading && <FullScreenLoader />}
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
            source={{uri: BUILD_IMAGE_URL(data?.picture)}}
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
              }}>
              <AntDesign name="clockcircle" size={15} color={COLORS.white} />
              <MyText size={FONT_SIZE.xs} color={COLORS.white}>
                {data?.members?.length || 0} members
              </MyText>
            </View>
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
            {data?.description}{' '}
          </MyText>
          {isJoin ? (
            <MyButton
              containerStyle={{backgroundColor: COLORS.red}}
              textStyle={{color: COLORS.white}}
              onPress={handleJoin}
              text="Leave Community"
            />
          ) : (
            <PrimaryBtn onPress={handleJoin} text="Join Community" />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ForumDetailScreen;
