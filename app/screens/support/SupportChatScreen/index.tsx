import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import ThreeDotSvg from '../../../../assets/svg/icons/threeDot.svg';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, hp, wp } from '../../../styles';
import {
  ChatMessageDisplay,
  ChatMessageSendInput,
  MessageType,
} from '../../message/ChatScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SupportStackParams } from '../../../naviagtion/DrawerNavigator';
import Tooltip from 'react-native-walkthrough-tooltip';
import { MyText } from '../../../components/MyText';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  api_getSupportTicketsChats,
  api_sendSupportTicketChat,
  api_updateSupportTicket,
} from '../../../api/support';
import { setSupportTicketChat } from '../../../redux/features/support/supportSlice';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel } from '../../../utils/sizeNormalization';

const SupportChatScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SupportStackParams>>();
  const params =
    useRoute<RouteProp<SupportStackParams, 'SupportChat'>>().params;
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const { token, user } = useSelector((s: RootState) => s.auth);
  const isFocused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const { supportTicketChatList } = useSelector((s: RootState) => s.support);

  const fetchSupportTicketChats = async () => {
    try {
      const res: any = await api_getSupportTicketsChats(
        token!,
        params?.item?._id,
      );

      dispatch(setSupportTicketChat(res?.data));
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (message: any) => {
    try {
      if (!message.trim().length) {
        return;
      }
      const payload = {
        id: params?.item?._id,
        message: message,
      };
      const res: any = await api_sendSupportTicketChat(token!, payload);
      const messageList: any = supportTicketChatList;
      messageList.push(res?.data);
      dispatch(setSupportTicketChat(messageList));
    } catch (error) {
      console.log(error);
    } finally {
      fetchSupportTicketChats();
    }
  };

  const reportSupportTicket = async () => {
    try {
      const data = {
        id: params?.item?._id,
        action: 'Reported',
      };
      await api_updateSupportTicket(token!, data);
    } catch (error) {
      console.log(error);
    } finally {
      navigation.goBack();
    }
  };

  useEffect(() => {
    fetchSupportTicketChats();
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <SecondaryHeader
        onBack={() => navigation.navigate('SupportTicket')}
        title={
          params?.item?.title.length > 34
            ? `${params?.item?.title.slice(0, 34)}...`
            : params?.item?.title
        }
        RightComp={() => {
          return (
            <Tooltip
              backgroundColor={COLORS.transparent}
              arrowStyle={{
                backgroundColor: 'red',
                display: 'none',
                opacity: 0,
              }}
              placement="bottom"
              isVisible={isTooltipOpen}
              contentStyle={{
                borderRadius: BORDER_RADIUS.XMedium,
                borderTopRightRadius: 0,
                maxHeight: heightPixel(80),
                height: heightPixel(74),
                width: widthPixel(120),
                maxWidth: widthPixel(140),
                shadowColor: '#000',
                transform: [{ translateX: heightPixel(-24) }],
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                position: 'absolute',
                zIndex: 1,
                gap: 10,
              }}
              content={
                <View style={{ justifyContent: 'space-evenly', flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsTooltipOpen(false);
                      navigation.navigate('TicketDetail', {
                        item: params.item,
                      });
                    }}>
                    <MyText>Ticket Details</MyText>
                  </TouchableOpacity>
                  {params.item?.status === 'Open' && (
                    <MyText color={COLORS.red} onPress={reportSupportTicket}>
                      Report
                    </MyText>
                  )}
                </View>
              }
              onClose={() => setIsTooltipOpen(false)}>
              <TouchableOpacity
                onPress={() => setIsTooltipOpen(true)}
                style={{
                  width: widthPixel(26),
                  height: heightPixel(26),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ThreeDotSvg />
              </TouchableOpacity>
            </Tooltip>
          );
        }}
      />
      {params.item?.status === 'Report' && (
        <MyText
          color={COLORS.red}
          style={{ textAlign: 'center', marginTop: pixelSizeVertical(20) }}>
          You have reported this support ticket!
        </MyText>
      )}
      <FlatList
        data={supportTicketChatList}
        contentContainerStyle={{
          marginHorizontal: pixelSizeHorizontal(20),
          marginVertical: pixelSizeVertical(20)
        }}
        renderItem={({ item }) => {
          return (
            <ChatMessageDisplay
              isMyMessage={item?.sender?._id === user?._id ? true : false}
              message={item.message}
              time={item.updatedAt}
              type={'message'}
            />
          );
        }}
      />
      {params.item?.status === 'Open' && (
        <ChatMessageSendInput sendMessage={(text: any) => sendMessage(text)} />
      )}
    </View>
  );
};

export default SupportChatScreen;

const styles = StyleSheet.create({});
