import {FlatList, SafeAreaView, View} from 'react-native';
import React from 'react';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONT_SIZE, FONT_WEIGHT, wp} from '../../styles';
import {MyText} from '../../components/MyText';
import AntDesgin from 'react-native-vector-icons/AntDesign';
const LikeScreen = () => {
  const navigation = useNavigation();
  return (
    <FlatList
      contentContainerStyle={{paddingBottom: 180}}
      data={new Array(12).fill(null)}
      ListHeaderComponent={() => {
        return (
          <View style={{marginBottom: 30}}>
            <SafeAreaView />
            <SecondaryHeader onBack={navigation.goBack} title="Likes" />
          </View>
        );
      }}
      renderItem={() => {
        return (
          <View
            style={{
              paddingBottom: 15,
              marginBottom: 10,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              borderBottomWidth: 0.7,
              borderColor: COLORS.lightgrey,
            }}>
            <View
              style={{
                width: wp(15),
                height: wp(15),
                backgroundColor: COLORS.grey,
                borderRadius: wp(15),
              }}></View>
            <View style={{}}>
              <MyText size={FONT_SIZE.base} bold={FONT_WEIGHT.bold}>
                Linda Grodan
              </MyText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 5,
                }}>
                <AntDesgin size={12} color={COLORS.grey} name="clockcircle" />
                <MyText size={FONT_SIZE.xs} color={COLORS.grey}>
                  15 Dec, 2023 10:35 AM
                </MyText>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};

export default LikeScreen;
