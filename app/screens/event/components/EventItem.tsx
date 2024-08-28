import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BUILD_IMAGE_URL} from '../../../api';

type Props = {
  title: string;
  category: string;
  des: string;
  image: string;
  date: string;
  isAttending?: boolean;
  onPress?: () => void;
};

const EventItem = ({
  date,
  category,
  des,
  image,
  title,
  isAttending,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: COLORS.white,
        marginVertical: 10,
        padding: 15,
        borderRadius: 30,
        flexDirection: 'row',
      }}>
      <View
        style={{
          width: 91,
          backgroundColor: COLORS.grey,
          borderRadius: 20,
        }}>
        {image && (
          <Image
            source={{uri: BUILD_IMAGE_URL(image)}}
            style={StyleSheet.absoluteFillObject}
          />
        )}
      </View>
      <View style={{flex: 1, padding: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyText
            size={FONT_SIZE.lg}
            bold={FONT_WEIGHT.bold}
            numberOfLines={1}
            style={{width: '52%'}}>
            {title}
          </MyText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <AntDesign name="clockcircle" size={15} color={COLORS.greenDark} />
            <MyText size={FONT_SIZE.xs} color={COLORS.greenDark}>
              {date}
            </MyText>
          </View>
        </View>
        <MyText size={FONT_SIZE.sm} style={{marginVertical: 5}}>
          {category} {isAttending && ' | Attending'}
        </MyText>
        <MyText size={FONT_SIZE.xs}>{des}</MyText>
      </View>
    </TouchableOpacity>
  );
};

export default EventItem;
