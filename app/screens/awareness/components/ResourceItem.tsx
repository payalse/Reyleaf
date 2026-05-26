import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {MyText} from '../../../components/MyText';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {BUILD_IMAGE_URL} from '../../../api';
import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../../utils/sizeNormalization';

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
      style={styles.card}
      activeOpacity={0.82}>

      {/* Thumbnail */}
      <View style={styles.thumb}>
        {picture ? (
          <Image
            source={{uri: BUILD_IMAGE_URL(picture)}}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        ) : (
          <Ionicons
            name="document-text-outline"
            color={COLORS.greenDark}
            size={fontPixel(32)}
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.body}>
        <MyText
          bold={FONT_WEIGHT.bold}
          size={FONT_SIZE.lg}
          color={COLORS.darkBrown}
          numberOfLines={1}
          style={styles.title}>
          {title}
        </MyText>
        <MyText
          size={FONT_SIZE.base}
          color={COLORS.grey}
          numberOfLines={2}
          style={styles.desc}>
          {des}
        </MyText>
        <View style={styles.readMore}>
          <MyText
            bold={FONT_WEIGHT.semibold}
            size={FONT_SIZE.sm}
            color={COLORS.greenDark}>
            Read more
          </MyText>
          <Entypo
            name="chevron-right"
            color={COLORS.greenDark}
            size={fontPixel(14)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ResourceItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.Medium,
    borderWidth: 1,
    borderColor: COLORS.lightgrey2,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: pixelSizeVertical(16),
    overflow: 'hidden',
  },
  thumb: {
    width: widthPixel(100),
    backgroundColor: '#E8F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    paddingHorizontal: pixelSizeHorizontal(14),
    paddingVertical: pixelSizeVertical(14),
    justifyContent: 'center',
  },
  title: {
    marginBottom: pixelSizeVertical(5),
  },
  desc: {
    lineHeight: 20,
    marginBottom: pixelSizeVertical(10),
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(2),
  },
});
