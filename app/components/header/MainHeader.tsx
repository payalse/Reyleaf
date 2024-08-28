import {TouchableOpacity, View} from 'react-native';
import React from 'react';

// ICONS x Images
import MenuSvg from '../../../assets/svg/icons/menu.svg';
import AppIcon from '../../../assets/svg/icons/icon.svg';
import NotiIcon from '../../../assets/svg/icons/notification.svg';
import MessageSvg from '../../../assets/svg/icons/message.svg';
import {COLORS, wp} from '../../styles';
import GradientBox from '../GradientBox';
import {DrawerActions, useNavigation} from '@react-navigation/native';

const ICON_SIZE = wp(13);

type Props = {
  onNotiPress?: () => void;
  onMessagePress?: () => void;
};
const MainHeader = ({onNotiPress, onMessagePress}: Props) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{
            backgroundColor: COLORS.white,
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MenuSvg width={ICON_SIZE / 2.5} height={ICON_SIZE / 2.5} />
        </TouchableOpacity>
        <AppIcon width={wp(15)} height={wp(20)} />
      </View>

      <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity onPress={onNotiPress}>
          <GradientBox
            conatinerStyle={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: ICON_SIZE / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <NotiIcon width={ICON_SIZE / 2.5} height={ICON_SIZE / 2.5} />
          </GradientBox>
        </TouchableOpacity>
        <TouchableOpacity onPress={onMessagePress}>
          <GradientBox
            conatinerStyle={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: ICON_SIZE / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MessageSvg width={ICON_SIZE / 2.5} height={ICON_SIZE / 2.5} />
          </GradientBox>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainHeader;
