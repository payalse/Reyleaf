import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ChatStackParams} from './types';
import AllRequestScreen from '../screens/message/AllRequestScreen';
import ChatScreen from '../screens/message/ChatScreen';
import MessagesScreen from '../screens/message/MessagesScreen';
import {useHideBottomBar} from '../hook/useHideBottomBar';

const Stack = createNativeStackNavigator<ChatStackParams>();

const ChatStack = () => {
  useHideBottomBar({});
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="AllRequest" component={AllRequestScreen} />
    </Stack.Navigator>
  );
};

export default ChatStack;
