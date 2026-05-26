import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BUILD_IMAGE_URL} from '../../../api';
import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../../utils/sizeNormalization';

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
      style={styles.card}
      activeOpacity={0.82}>

      {/* Thumbnail */}
      <View style={styles.thumb}>
        {image ? (
          <Image
            source={{uri: BUILD_IMAGE_URL(image)}}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        ) : (
          <Ionicons
            name="calendar-outline"
            color={COLORS.greenDark}
            size={fontPixel(34)}
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.body}>
        <View style={styles.topRow}>
          <MyText
            bold={FONT_WEIGHT.bold}
            size={FONT_SIZE.lg}
            color={COLORS.darkBrown}
            numberOfLines={1}
            style={styles.title}>
            {title}
          </MyText>
          {isAttending && <View style={styles.attendingDot} />}
        </View>

        <MyText
          size={FONT_SIZE.base}
          color={COLORS.grey}
          numberOfLines={2}
          style={styles.desc}>
          {des}
        </MyText>

        <View style={styles.footer}>
          <View style={styles.metaRow}>
            <AntDesign
              name="clockcircle"
              size={fontPixel(13)}
              color={COLORS.greenDark}
            />
            <MyText size={FONT_SIZE.sm} color={COLORS.greenDark} style={styles.metaText}>
              {date}
            </MyText>
          </View>

          {category ? (
            <View style={styles.categoryBadge}>
              <MyText
                size={FONT_SIZE.xs}
                bold={FONT_WEIGHT.semibold}
                color={COLORS.darkBrown}>
                {category}
              </MyText>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventItem;

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
    width: widthPixel(110),
    backgroundColor: '#E8F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    padding: pixelSizeHorizontal(12),
    paddingVertical: pixelSizeVertical(12),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pixelSizeVertical(6),
  },
  title: {
    flex: 1,
  },
  attendingDot: {
    width: widthPixel(10),
    height: widthPixel(10),
    borderRadius: widthPixel(5),
    backgroundColor: COLORS.greenDark,
    marginLeft: pixelSizeHorizontal(8),
  },
  desc: {
    lineHeight: 20,
    marginBottom: pixelSizeVertical(10),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(5),
  },
  metaText: {
    marginLeft: pixelSizeHorizontal(2),
  },
  categoryBadge: {
    backgroundColor: '#E8F5F0',
    paddingVertical: pixelSizeVertical(4),
    paddingHorizontal: pixelSizeHorizontal(10),
    borderRadius: BORDER_RADIUS.Circle,
    borderWidth: 1,
    borderColor: COLORS.greenDark,
  },
});
