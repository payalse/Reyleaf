import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AwarenessStackParams} from '../../../naviagtion/types';
const FeatureContent = () => {
  const naviagtion =
    useNavigation<NativeStackNavigationProp<AwarenessStackParams>>();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: COLORS.lightgrey,
        borderRadius: 20,
        margin: 20,
        padding: 15,
      }}>
      {/* top */}
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <View
          style={{
            backgroundColor: COLORS.grey,
            width: 50,
            height: 50,
            borderRadius: 50,
          }}></View>
        <View style={{gap: 8}}>
          <MyText size={FONT_SIZE.sm} bold={FONT_WEIGHT.bold}>
            Linda Grodan
          </MyText>
          <View style={{flexDirection: 'row', gap: 5}}>
            <AntDesign name="clockcircle" size={15} color={COLORS.greenDark} />
            <MyText color={COLORS.greenDark} size={FONT_SIZE.xs}>
              15 Dec, 2023
            </MyText>
          </View>
        </View>
      </View>
      {/*mid */}
      <MyText
        size={FONT_SIZE.xs}
        color={COLORS.grey}
        style={{marginVertical: 10, lineHeight: 18}}>
        Lorem Ipsum is simply dummy text of the printing and type setting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type
      </MyText>
      {/* bottom */}
      <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
        <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
          <AntDesign
            onPress={() => naviagtion.navigate('LikeScreen')}
            name="heart"
            color={COLORS.red}
            size={24}
          />
          <MyText size={FONT_SIZE.xs}>42 Likes</MyText>
        </View>
        <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
          <Entypo
            onPress={() => naviagtion.navigate('CommentScreen')}
            name="typing"
            color={COLORS.greenDark}
            size={24}
          />
          <MyText size={FONT_SIZE.xs}>12 Comments</MyText>
        </View>
      </View>
    </View>
  );
};

export default FeatureContent;

const styles = StyleSheet.create({});
