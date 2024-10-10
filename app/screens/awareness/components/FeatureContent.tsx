import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { MyText } from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import { BUILD_IMAGE_URL } from '../../../api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

type Props = {
  name: string;
  updated_at: number;
  status: string;
  picture?: string;
};

const FeatureContent = ({ name, updated_at, status, picture }: Props) => {
  const { defaultAvatar } = useSelector((s: RootState) => s.app);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: COLORS.lightgrey,
        borderRadius: 20,
        margin: 20,
        padding: 15,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
          }}
        >
          {picture ? (
            <Image
              source={{ uri: BUILD_IMAGE_URL(picture) }}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
              }}
            />
          ) : (
            <Image
              source={defaultAvatar.img}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 200,
              }}
            />
          )}
        </View>
        <View style={{ gap: 8 }}>
          <MyText size={FONT_SIZE.sm} bold={FONT_WEIGHT.bold}>
            {name}
          </MyText>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <AntDesign name="clockcircle" size={15} color={COLORS.greenDark} />
            <MyText color={COLORS.greenDark} size={FONT_SIZE.xs}>
            {moment(updated_at).fromNow()}
            </MyText>
          </View>
        </View>
      </View>
      {/*mid */}
      <MyText
        size={FONT_SIZE.xs}
        color={COLORS.grey}
        style={{ marginVertical: 10, lineHeight: 18 }}
      >
        {status}
      </MyText>
      {/* bottom */}
      {/* <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
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
      </View> */}
    </View>
  );
};

export default FeatureContent;

const styles = StyleSheet.create({});
