import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, D, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MyText} from '../../components/MyText';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {api_forumContent, api_getForumDetails} from '../../api/forum';
import {api_joinLeaveForm} from '../../api/awareness';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import FullScreenLoader from '../../components/FullScreenLoader';
import {useAppAlert} from '../../context/AppAlertContext';
import {BUILD_IMAGE_URL} from '../../api';
import FeatureContent from './components/FeatureContent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyButton from '../../components/buttons/MyButton';
import PrimaryBtn from '../../components/buttons/PrimaryBtn';
import {ShowAlert} from '../../utils/alert';
import {ALERT_TYPE} from 'react-native-alert-notification';
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../../utils/sizeNormalization';
import {BORDER_RADIUS} from '../../styles';

const ForumDetailScreen = () => {
  useHideBottomBar({});
  const navigation = useNavigation<any>();
  const params = useRoute().params as {id: string};
  const {token} = useSelector((s: RootState) => s.auth);
  const {showModal} = useAppAlert()!;

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [posting, setPosting] = useState(false);
  const [data, setData] = useState<any>(null);
  const [contentText, setContentText] = useState('');

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res: any = await api_getForumDetails(token!, params.id);
      setData(res.data);
    } catch (err: any) {
      ShowAlert({
        textBody: err?.message || 'Failed to load forum.',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [params.id]);

  const handleJoinToggle = async () => {
    const wasJoined = data?.isJoined;
    setData((prev: any) => ({
      ...prev,
      isJoined: !wasJoined,
      joinedCount: wasJoined ? prev.joinedCount - 1 : prev.joinedCount + 1,
    }));
    try {
      setJoining(true);
      const res: any = await api_joinLeaveForm(token!, params.id);
      showModal({text: res?.message});
    } catch (err: any) {
      setData((prev: any) => ({
        ...prev,
        isJoined: wasJoined,
        joinedCount: wasJoined ? prev.joinedCount + 1 : prev.joinedCount - 1,
      }));
      ShowAlert({
        textBody: err?.message || 'Action failed.',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setJoining(false);
    }
  };

  const handlePost = async () => {
    const trimmed = contentText.trim();
    if (!trimmed) return;
    try {
      setPosting(true);
      const res: any = await api_forumContent(
        token!,
        {content: trimmed},
        params.id,
      );
      setData((prev: any) => ({
        ...prev,
        forumContent: [res.data, ...(prev.forumContent || [])],
      }));
      setContentText('');
    } catch (err: any) {
      ShowAlert({
        textBody: err?.message || 'Failed to post.',
        type: ALERT_TYPE.DANGER,
      });
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <FullScreenLoader />;

  const isJoined: boolean = data?.isJoined ?? false;
  const forumContent: any[] = data?.forumContent || [];
  const memberCount: number = data?.joinedCount ?? data?.members?.length ?? 0;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>

        {/* Cover image */}
        <View style={styles.cover}>
          {data?.picture ? (
            <Image
              source={{uri: BUILD_IMAGE_URL(data.picture)}}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="document-text" size={48} color={COLORS.white} />
            </View>
          )}
          <View style={styles.coverOverlay} />
          <SafeAreaView>
            <SecondaryHeader
              title="Forum"
              onBack={navigation.goBack}
              backIconColor={COLORS.black}
              backIconBgColor={COLORS.white}
              titleColor={COLORS.white}
            />
          </SafeAreaView>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.titleRow}>
            <MyText
              bold={FONT_WEIGHT.bold}
              size={FONT_SIZE['1.5xl']}
              color={COLORS.darkBrown}
              style={styles.titleText}>
              {data?.title}
            </MyText>
            <View style={styles.membersBadge}>
              <Ionicons name="people" size={14} color={COLORS.white} />
              <MyText size={FONT_SIZE.xs} color={COLORS.white}>
                {memberCount}
              </MyText>
            </View>
          </View>

          <MyText
            size={FONT_SIZE.base}
            bold={FONT_WEIGHT.semibold}
            color={COLORS.darkBrown}
            style={styles.sectionLabel}>
            Description
          </MyText>
          <MyText style={styles.description} color={COLORS.grey}>
            {data?.description}
          </MyText>

          {isJoined ? (
            <MyButton
              containerStyle={styles.leaveBtn}
              textStyle={{color: COLORS.white}}
              onPress={handleJoinToggle}
              text={joining ? 'Leaving…' : 'Leave Community'}
            />
          ) : (
            <PrimaryBtn
              loading={joining}
              onPress={handleJoinToggle}
              text="Join Community"
            />
          )}
        </View>

        {/* Content posts */}
        {forumContent.length > 0 && (
          <View style={styles.contentSection}>
            <View style={styles.contentHeader}>
              <View style={styles.sectionAccent} />
              <MyText
                bold={FONT_WEIGHT.bold}
                size={FONT_SIZE.base}
                color={COLORS.darkBrown}>
                Posts
              </MyText>
              <MyText size={FONT_SIZE.sm} color={COLORS.grey} style={styles.postCount}>
                {forumContent.length}
              </MyText>
            </View>
            {forumContent.map((item: any, i: number) => (
              <FeatureContent
                key={item._id ?? i}
                name={item?.userId?.fullname ?? 'Anonymous'}
                updated_at={item?.updated_at}
                content={item?.content}
                picture={item?.userId?.picture}
              />
            ))}
          </View>
        )}

        {isJoined && forumContent.length === 0 && (
          <View style={styles.emptyContent}>
            <MyText center color={COLORS.grey} size={FONT_SIZE.sm}>
              No posts yet. Be the first to post!
            </MyText>
          </View>
        )}
      </ScrollView>

      {/* Inline post input — visible only when joined */}
      {isJoined && (
        <View style={styles.postBar}>
          <TextInput
            value={contentText}
            onChangeText={setContentText}
            placeholder="Write something…"
            placeholderTextColor={COLORS.grey}
            style={styles.postInput}
            multiline
          />
          <TouchableOpacity
            onPress={handlePost}
            disabled={posting || !contentText.trim()}
            style={[
              styles.sendBtn,
              (!contentText.trim() || posting) && styles.sendBtnDisabled,
            ]}>
            {posting ? (
              <AntDesign name="loading1" size={fontPixel(18)} color={COLORS.white} />
            ) : (
              <AntDesign name="arrowup" size={fontPixel(18)} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ForumDetailScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    paddingBottom: heightPixel(120),
  },
  cover: {
    height: D.height * 0.38,
    backgroundColor: COLORS.darkBrown,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  coverPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  details: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: pixelSizeHorizontal(20),
    paddingTop: pixelSizeVertical(28),
    paddingBottom: pixelSizeVertical(20),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: pixelSizeVertical(16),
  },
  titleText: {
    flex: 1,
    marginRight: pixelSizeHorizontal(12),
  },
  membersBadge: {
    backgroundColor: COLORS.darkBrown,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionLabel: {
    marginBottom: pixelSizeVertical(6),
  },
  description: {
    lineHeight: 24,
    marginBottom: pixelSizeVertical(24),
  },
  leaveBtn: {
    backgroundColor: COLORS.red,
  },
  contentSection: {
    paddingTop: pixelSizeVertical(8),
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pixelSizeHorizontal(20),
    marginBottom: pixelSizeVertical(12),
  },
  sectionAccent: {
    width: 3,
    height: heightPixel(16),
    backgroundColor: COLORS.greenDark,
    borderRadius: 2,
    marginRight: pixelSizeHorizontal(8),
  },
  postCount: {
    marginLeft: pixelSizeHorizontal(6),
  },
  emptyContent: {
    paddingVertical: pixelSizeVertical(30),
    paddingHorizontal: pixelSizeHorizontal(20),
  },
  postBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(10),
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgrey2,
    backgroundColor: COLORS.white,
  },
  postInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: BORDER_RADIUS.Medium,
    paddingHorizontal: pixelSizeHorizontal(14),
    paddingVertical: heightPixel(10),
    fontSize: FONT_SIZE.base,
    color: COLORS.darkBrown,
    maxHeight: heightPixel(100),
    marginRight: pixelSizeHorizontal(10),
  },
  sendBtn: {
    width: heightPixel(40),
    height: heightPixel(40),
    borderRadius: heightPixel(20),
    backgroundColor: COLORS.greenDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
