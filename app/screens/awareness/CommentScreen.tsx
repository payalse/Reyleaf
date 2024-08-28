import {FlatList, SafeAreaView, TouchableOpacity, View} from 'react-native';
import React from 'react';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {MyText} from '../../components/MyText';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import MyInput from '../../components/inputs/MyInput';
import GradientBox from '../../components/GradientBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
const CommentScreen = () => {
  const navigation = useNavigation();
  return (
    <>
      <FlatList
        contentContainerStyle={{paddingBottom: 180}}
        data={new Array(7).fill(null)}
        ListHeaderComponent={() => {
          return (
            <View style={{marginBottom: 30}}>
              <SafeAreaView />
              <SecondaryHeader onBack={navigation.goBack} title="Comments" />
            </View>
          );
        }}
        renderItem={() => {
          return (
            <View
              style={{
                paddingBottom: 15,
                marginBottom: 20,
                marginHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                borderBottomWidth: 0.7,
                borderColor: COLORS.lightgrey,
              }}>
              <View
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: COLORS.grey,
                  borderRadius: 70,
                }}></View>
              <View style={{}}>
                <MyText size={FONT_SIZE.sm} bold={FONT_WEIGHT.bold}>
                  Jane Doe
                </MyText>
                <View style={{flex: 1, marginRight: 80}}>
                  <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                    Lorem Ipsum is simply dummy text of the printing and type
                    setting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever.
                  </MyText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 5,
                  }}>
                  <AntDesgin size={18} color={COLORS.grey} name="clockcircle" />
                  <MyText size={FONT_SIZE.xs} color={COLORS.grey}>
                    15 Dec, 2023 10:35 AM
                  </MyText>
                </View>
              </View>
            </View>
          );
        }}
      />
      <View style={{flexDirection: 'row', gap: 10, marginHorizontal: 20}}>
        <MyInput
          placeholder="Type Here"
          inputStyle={{backgroundColor: 'rgba(0,0,0,0.05)', borderWidth: 0}}
          leftIcon={() => {
            return <AntDesign name="smileo" size={24} color={COLORS.grey} />;
          }}
        />
        <TouchableOpacity style={{marginBottom: 20}}>
          <GradientBox
            conatinerStyle={{
              width: 55,
              height: 55,
              borderRadius: 55,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome name={'send'} color={COLORS.white} size={20} />
          </GradientBox>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CommentScreen;
