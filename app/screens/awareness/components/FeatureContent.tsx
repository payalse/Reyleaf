import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {BUILD_IMAGE_URL} from '../../../api';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

type Props = {
  name: string;
  updated_at: string | number;
  content: string;
  picture?: string;
};

const FeatureContent = ({name, updated_at, content, picture}: Props) => {
  const {defaultAvatar} = useSelector((s: RootState) => s.app);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image
            source={
              picture
                ? {uri: BUILD_IMAGE_URL(picture)}
                : defaultAvatar.img
            }
            style={styles.avatarImg}
          />
        </View>
        <View style={styles.meta}>
          <MyText size={FONT_SIZE.sm} bold={FONT_WEIGHT.bold}>
            {name}
          </MyText>
          <View style={styles.timeRow}>
            <AntDesign name="clockcircle" size={12} color={COLORS.greenDark} />
            <MyText color={COLORS.greenDark} size={FONT_SIZE.xs}>
              {moment(updated_at).fromNow()}
            </MyText>
          </View>
        </View>
      </View>
      <MyText
        size={FONT_SIZE.sm}
        color={COLORS.grey}
        style={styles.contentText}>
        {content}
      </MyText>
    </View>
  );
};

export default FeatureContent;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: COLORS.lightgrey2,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
    backgroundColor: COLORS.lightgrey2,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contentText: {
    lineHeight: 20,
  },
});
