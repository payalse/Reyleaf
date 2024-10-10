import {
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {COLORS, FONT_SIZE, FONT_WEIGHT, hp, wp} from '../../../styles';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {MyText} from '../../../components/MyText';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChatStackParams} from '../../../naviagtion/types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GradientBox from '../../../components/GradientBox';
import SmileySvg from '../../../../assets/svg/icons/smiley.svg';
import Tooltip from 'rn-tooltip';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {api_createOrGetRoom} from '../../../api/chat';
import FullScreenLoader from '../../../components/FullScreenLoader';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import {string} from 'yup';
import moment from 'moment';
import { api_updateSupportTicket } from '../../../api/support';

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: 'AIzaSyA4_y27Gcf7ezMiG_wz8GQbL6hAzRC-FUc',
    authDomain: 'reyleaf-5c95f.firebaseapp.com',
    projectId: 'reyleaf-5c95f',
    storageBucket: 'reyleaf-5c95f.appspot.com',
    messagingSenderId: '124903365878',
    appId: '1:124903365878:web:01c3a1d84eb801ab98e0d7',
    measurementId: 'G-X6XLS71QJN',
    databaseURL: 'https://reyleaf-5c95f-default-rtdb.firebaseio.com',
  };

  firebase.initializeApp(firebaseConfig);
}

export type MessageType = {
  message: string;
  isMyMessage: boolean;
  time: string;
  type: 'message' | 'timeChip';
};


export const ChatMessageDisplay = ({
  isMyMessage,
  time,
  type,
  message,
}: MessageType) => {
  if (type === 'timeChip') {
    return (
      <View
        style={{
          paddingHorizontal: 13,
          paddingVertical: 8,
          backgroundColor: COLORS.lightgrey2,
          alignSelf: 'center',
          marginVertical: 10,
          justifyContent: 'center',
          borderRadius: 20,
        }}>
        <MyText color={COLORS.grey} size={FONT_SIZE.xs}>
        {moment(time).fromNow()}
        </MyText>
      </View>
    );
  }

  if (isMyMessage) {
    return (
      <View style={{marginVertical: 10, alignItems: 'flex-end', gap: 10}}>
        <GradientBox
          conatinerStyle={{
            maxWidth: wp(75),
            padding: 15,
            borderRadius: 15,
            borderBottomRightRadius: 0,
          }}>
          <MyText color={COLORS.white} size={FONT_SIZE.sm}>
            {message}
          </MyText>
        </GradientBox>
        <MyText color={COLORS.grey} size={FONT_SIZE.xs * 0.8}>
        {moment(time).fromNow()}
        </MyText>
      </View>
    );
  } else {
    return (
      <View style={{marginVertical: 10, alignItems: 'flex-start', gap: 10}}>
        <View
          style={{
            maxWidth: wp(75),
            padding: 15,
            borderRadius: 15,
            borderBottomLeftRadius: 0,
            backgroundColor: 'rgba(0,0,0,0.12)',
          }}>
          <MyText color={COLORS.black} size={FONT_SIZE.sm}>
            {message}
          </MyText>
        </View>
        <MyText color={COLORS.grey} size={FONT_SIZE.xs}>
        {moment(time).fromNow()}
        </MyText>
      </View>
    );
  }
};

export const ChatMessageSendInput = ({
  sendMessage,
}: {
  sendMessage: (s: string) => void;
}) => {
  const [text, setText] = useState('');
  return (
    <View style={{height: hp(10), marginHorizontal: 20}}>
      <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.05)',
            height: hp(7),
            flex: 1,
            borderRadius: 30,
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
          <View style={{marginLeft: 15, marginRight: 10, opacity: 0.5}}>
            <SmileySvg />
          </View>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholderTextColor={COLORS.grey}
            placeholder="Type here"
            style={{
              flex: 1,
              color: COLORS.black,
              height: '100%',
              fontSize: FONT_SIZE.base,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            sendMessage(text);
            setText('');
          }}
          style={{
            backgroundColor: COLORS.greenDark,
            width: wp(14),
            height: wp(14),
            borderRadius: wp(14) / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FontAwesome
            name="send"
            size={FONT_SIZE['xl']}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const ChatScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParams>>();

  const params = useRoute().params as any;
  const [messages, setMessages] = useState<any>([]);
  const [roomID, setRoomID] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const {token, user} = useSelector((s: RootState) => s.auth);
  const flatListRef = useRef<FlatList>(null);
  console.log(messages, 'message');

  const sendMessage = (text: string) => {
    const messageRef = database().ref(`chats/${roomID}`);
    const newMessage = {
      text: text,
      type: 'text',
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      sender: user!._id,
    };
    console.log(newMessage);
    messageRef.push(newMessage);
  };

  const reportSupportTicket = async () => {
    // try {
    //   setLoading(true);
    //   const data = {
    //     id: params?._id,
    //     action: 'Report',
    //   };
    //   const res: any = await api_updateSupportTicket(token!, data);
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setLoading(false);
    //   navigation.goBack()
    // }
  };

  useEffect(() => {
    const run = async () => {
      if (!roomID) return;
      try {
        const messagesRef = database().ref(`chats/${roomID}`);
        const messagesListener = messagesRef.on('value', snapshot => {
          const messageList: any = [];
          // @ts-ignore
          snapshot.forEach(child => {
            messageList.push({
              id: child.key,
              ...child.val(),
            });
          });
          setMessages(messageList);
        });
      } catch (error) {
        console.log('err', error);
      }
    };
    run();
    return () => {
      // messagesRef.off('value', messagesListener);
    };
  }, [roomID]);

  useEffect(() => {
    const requestAPI = async () => {
      try {
        setLoading(true);
        const payload = {
          receiverId: params?.otherUserId,
        };
        const res: any = await api_createOrGetRoom(token!, payload);
        console.log(res, 'getdata');
        setRoomID(res.data._id);
        const roomRef = database().ref(`chats/${res.data._id}`);
        const snapshot = await roomRef.once('value');
        if (!snapshot.exists()) {
          // Room does not exist, create a new room
          await roomRef.set({});
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    requestAPI();
  }, []);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({animated: true});
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView />
      {loading && <FullScreenLoader />}
      <SecondaryHeader
        onBack={navigation.goBack}
        title={params.fullname || ''}
        // RightComp={() => (
        //   <Tooltip
        //     containerStyle={{
        //       backgroundColor: COLORS.white,
        //       borderRadius: 10,
        //       borderTopRightRadius: 0,
        //       transform: [{translateX: wp(20)}],
        //       shadowColor: '#000',
        //       padding: 0,
        //       width: wp(20),
        //       shadowOffset: {
        //         width: 0,
        //         height: 2,
        //       },
        //       shadowOpacity: 0.25,
        //       shadowRadius: 3.84,
        //       elevation: 5,
        //     }}
        //     overlayColor={COLORS.transparent}
        //     withPointer={false}
        //     actionType="press"
        //     popover={
        //       <TouchableOpacity onPress={reportSupportTicket}>
        //         <MyText color={COLORS.red}>Report</MyText>
        //       </TouchableOpacity>
        //     }>
        //     <Entypo
        //       name="dots-three-horizontal"
        //       size={FONT_SIZE['2xl']}
        //       color={COLORS.black}
        //     />
        //   </Tooltip>
        // )}
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        onContentSizeChange={scrollToBottom}
        contentContainerStyle={{marginHorizontal: 20, marginVertical: 20}}
        renderItem={({item}) => {
          return (
            <ChatMessageDisplay
              isMyMessage={user?._id === item?.sender}
              message={item.text}
              time={item.timestamp}
              type={item.type}
            />
          );
        }}
      />
      <ChatMessageSendInput sendMessage={sendMessage} />
    </View>
  );
};

export default ChatScreen;
