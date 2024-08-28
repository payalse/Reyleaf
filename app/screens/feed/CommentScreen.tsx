import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {MyText} from '../../components/MyText';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import MyInput from '../../components/inputs/MyInput';
import GradientBox from '../../components/GradientBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {FeedStackParams} from '../../naviagtion/types';
import {api_addComment} from '../../api/feeds';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import moment from 'moment';
import {BUILD_IMAGE_URL} from '../../api';

const CommentScreen = () => {
  useHideBottomBar({});
  const {feedId, comments} =
    useRoute<RouteProp<FeedStackParams, 'CommentScreen'>>().params;
  const navigation = useNavigation();
  const {token, user} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [cmts, setCmts] = useState(comments || []);

  const onSubmit = async () => {
    if (!text) return;
    try {
      setLoading(true);
      const res: any = await api_addComment(token!, feedId, text);
      console.log(res);
      setCmts([
        ...cmts,
        {
          ...res.data,
          userId: {fullname: user?.fullname, picture: user?.picture},
        },
      ]);
      setText('');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FlatList
        contentContainerStyle={{paddingBottom: 180}}
        data={cmts}
        ListHeaderComponent={() => {
          return (
            <View style={{marginBottom: 30}}>
              <SafeAreaView />
              <SecondaryHeader onBack={navigation.goBack} title="Comments" />
            </View>
          );
        }}
        renderItem={({item}) => {
          return (
            <View
              style={{
                paddingBottom: 15,
                marginBottom: 20,
                marginHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                borderBottomWidth: 0.7,
                borderColor: COLORS.lightgrey,
              }}>
              <View
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: COLORS.grey,
                  borderRadius: 70,
                  overflow: 'hidden',
                }}>
                {item.userId?.picture && (
                  <Image
                    source={{uri: BUILD_IMAGE_URL(item.userId.picture)}}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
              </View>
              <View style={{}}>
                <MyText size={FONT_SIZE.sm} bold={FONT_WEIGHT.bold}>
                  {item?.userId?.fullname}
                </MyText>
                <View style={{flex: 1, marginRight: 80}}>
                  <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                    {item.comment}
                  </MyText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 5,
                  }}>
                  <AntDesgin size={18} color={COLORS.grey} name="clockcircle" />
                  <MyText size={FONT_SIZE.xs} color={COLORS.grey}>
                    {moment(item.created_at).format('DD MMM, YYYY hh:mm A')}
                  </MyText>
                </View>
              </View>
            </View>
          );
        }}
      />
      <View style={{flexDirection: 'row', gap: 10, marginHorizontal: 20}}>
        <MyInput
          value={text}
          onChangeText={setText}
          placeholder="Type Here"
          inputStyle={{backgroundColor: 'rgba(0,0,0,0.05)', borderWidth: 0}}
          leftIcon={() => {
            return <AntDesign name="smileo" size={24} color={COLORS.grey} />;
          }}
        />
        <TouchableOpacity style={{marginBottom: 20}} onPress={onSubmit}>
          <GradientBox
            conatinerStyle={{
              width: 55,
              height: 55,
              borderRadius: 55,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {loading ? (
              <ActivityIndicator color={COLORS.white} size={'small'} />
            ) : (
              <FontAwesome name={'send'} color={COLORS.white} size={20} />
            )}
          </GradientBox>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CommentScreen;
