import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {MyText} from '../../../components/MyText';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BUILD_IMAGE_URL} from '../../../api';
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../../utils/sizeNormalization';

type Props = {
  id: string;
  title: string;
  noOfMembers: number;
  des: string;
  picture?: string;
  isJoined?: boolean;
  onPress?: () => void;
  onJoinPress?: () => void;
};

const ForumItem = ({
  title,
  noOfMembers,
  des,
  picture,
  isJoined,
  onPress,
  onJoinPress,
}: Props) => {
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
            name="chatbubbles-outline"
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
          {isJoined && (
            <View style={styles.joinedDot} />
          )}
        </View>

        <MyText
          size={FONT_SIZE.base}
          color={COLORS.grey}
          numberOfLines={2}
          style={styles.desc}>
          {des}
        </MyText>

        <View style={styles.footer}>
          <View style={styles.membersRow}>
            <Ionicons
              name="people-outline"
              size={fontPixel(16)}
              color={COLORS.greenDark}
            />
            <MyText size={FONT_SIZE.base} color={COLORS.grey} style={styles.membersText}>
              {noOfMembers} members
            </MyText>
          </View>

          {onJoinPress && (
            <TouchableOpacity
              onPress={e => {
                e.stopPropagation?.();
                onJoinPress();
              }}
              style={[styles.actionBtn, isJoined ? styles.leaveBtn : styles.joinBtn]}
              activeOpacity={0.8}>
              <MyText
                bold={FONT_WEIGHT.semibold}
                size={FONT_SIZE.sm}
                color={isJoined ? '#B91C1C' : COLORS.white}>
                {isJoined ? 'Leave' : 'Join'}
              </MyText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ForumItem;

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
  joinedDot: {
    width: widthPixel(10),
    height: widthPixel(10),
    borderRadius: widthPixel(5),
    backgroundColor: COLORS.greenDark,
    marginLeft: pixelSizeHorizontal(8),
  },
  desc: {
    lineHeight: 20,
    marginBottom: pixelSizeVertical(12),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(5),
  },
  membersText: {
    marginLeft: pixelSizeHorizontal(2),
  },
  actionBtn: {
    paddingVertical: pixelSizeVertical(8),
    paddingHorizontal: pixelSizeHorizontal(20),
    borderRadius: BORDER_RADIUS.Circle,
  },
  joinBtn: {
    backgroundColor: COLORS.greenDark,
  },
  leaveBtn: {
    backgroundColor: '#FEE2E2',
  },
});
