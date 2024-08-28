import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
type Props = {
  id: string;
  title: string;
  noOfMembers: number;
  des: string;
  onPress?: () => void;
};

const ForumItem = ({id, title, noOfMembers, des, onPress}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 15,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        marginBottom: 20,
        flexDirection: 'row',
      }}>
      <View
        style={{
          width: 100,
          minHeight: 100,
          backgroundColor: COLORS.grey,
          borderRadius: 20,
        }}></View>
      <View style={{gap: 5, flex: 1, padding: 5, marginHorizontal: 10}}>
        <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
          {title}
        </MyText>
        <View
          style={{
            backgroundColor: COLORS.darkBrown,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 30,
            flexDirection: 'row',
            gap: 5,
            alignSelf: 'flex-start',
          }}>
          <Ionicons name="people" color={COLORS.white} size={15} />
          <MyText
            color={COLORS.white}
            size={FONT_SIZE.sm}>{`${noOfMembers} Members`}</MyText>
        </View>
        <MyText size={FONT_SIZE.xs} color={COLORS.grey}>
          {des}
        </MyText>
      </View>
    </TouchableOpacity>
  );
};

export default ForumItem;

const styles = StyleSheet.create({});
