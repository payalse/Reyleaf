import {
  Image,
  ScrollView,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, D, FONT_SIZE, FONT_WEIGHT, hp} from '../../styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MyText} from '../../components/MyText';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AwarenessStackParams} from '../../naviagtion/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {BUILD_IMAGE_URL} from '../../api';
import moment from 'moment';
const IMAGE_URI =
  'https://media.istockphoto.com/id/1421993924/photo/creative-writing-at-home-by-female-hands-enjoying-a-calm-peaceful-day-off-indoors-woman.webp?b=1&s=170667a&w=0&k=20&c=GstM6PeYECR0ftSIk-60TIO2b6JUhkMG3tlUhFDpR8k=';

const ResourceDetailScreen = () => {
  useHideBottomBar({});
  const navigation =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();
  const {isReadOnly, data} =
    useRoute<RouteProp<AwarenessStackParams, 'ResourceDetail'>>().params;

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: 200,
          backgroundColor: COLORS.white,
        }}>
        <View style={{height: D.height * 0.45, backgroundColor: COLORS.grey}}>
          <SafeAreaView>
            <SecondaryHeader
              title="Resource Detail"
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
            source={{
              uri: data?.picture ? BUILD_IMAGE_URL(data.picture) : IMAGE_URI,
            }}
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
          {isReadOnly ? (
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
                  {moment(data?.updated_at).format('YYYY-MM-DD')}
                </MyText>
              </View>
            </View>
          ) : (
            <View>
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
                    gap: 5,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('EditResource', {
                        id: data.id,
                        title: data.title,
                        description: data.description,
                        picture: data.picture,
                      })
                    }
                    style={{
                      backgroundColor: COLORS.greenDark,
                      width: 45,
                      height: 45,
                      borderRadius: 45,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <MaterialIcons name="edit" color={COLORS.white} size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.red,
                      width: 45,
                      height: 45,
                      borderRadius: 45,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name="delete"
                      color={COLORS.white}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.darkBrown,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  borderRadius: 20,
                  flexDirection: 'row',
                  gap: 5,
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                }}>
                <AntDesign name="clockcircle" size={15} color={COLORS.white} />
                <MyText size={FONT_SIZE.xs} color={COLORS.white}>
                  {moment(data?.updated_at).format('YYYY-MM-DD')}
                </MyText>
              </View>
            </View>
          )}

          <MyText
            size={FONT_SIZE.base}
            bold={FONT_WEIGHT.bold}
            style={{marginTop: 20}}>
            Description
          </MyText>
          <MyText
            style={{marginBottom: 30, marginTop: 10, lineHeight: 25}}
            color={COLORS.grey}>
            {data?.description}
          </MyText>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResourceDetailScreen;
