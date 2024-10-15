import {Image, Touchable, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {MyText} from '../../../components/MyText';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {BUILD_IMAGE_URL} from '../../../api';
import {StyleSheet} from 'react-native';
type Props = {
  id: string;
  title: string;
  des: string;
  onPress: () => void;
  picture: string | undefined;
};

const ResourceItem = ({picture, title, des, onPress}: Props) => {
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
          width: 80,
          minHeight: 80,
          backgroundColor: 'rgba(6, 95, 70, 0.2)',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {picture ? (
          <Image
            source={{uri: BUILD_IMAGE_URL(picture)}}
            style={StyleSheet.absoluteFillObject}
          />
        ) : (
          <Ionicons name="document-text" color={COLORS.greenDark} size={30} />
        )}
      </View>
      <View
        style={{
          gap: 5,
          flex: 1,
          padding: 5,
          marginHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.lg}>
            {title}
          </MyText>
          <View style={{flex: 1, marginTop: 5}}>
            <MyText size={FONT_SIZE.xs} color={COLORS.grey}>
              {des.length > 90 ? `${des.substring(0, 100)}...` : des}
            </MyText>
          </View>
        </View>
        <Entypo name="chevron-right" color={COLORS.grey} size={20} />
      </View>
    </TouchableOpacity>
  );
};

export default ResourceItem;
