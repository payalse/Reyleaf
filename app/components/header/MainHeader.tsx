import {TouchableOpacity, View} from 'react-native';
import React from 'react';

// ICONS x Images
import MenuSvg from '../../../assets/svg/icons/menu.svg';
import AppIcon from '../../../assets/svg/icons/icon.svg';
import NotiIcon from '../../../assets/svg/icons/notification.svg';
import MessageSvg from '../../../assets/svg/icons/message.svg';
import {COLORS, FONT_SIZE, wp} from '../../styles';
import GradientBox from '../GradientBox';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from 'app/redux/store';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {MyText} from '../MyText';

const ICON_SIZE = wp(13);

type Props = {
  onNotiPress?: () => void;
  onMessagePress?: () => void;
};
const MainHeader = ({onNotiPress, onMessagePress}: Props) => {
  const navigation = useNavigation();
  const {isAuthenticated} = useSelector((s: RootState) => s.auth);
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
        {isAuthenticated ? (
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
        ) : (
          <TouchableOpacity
          onPress={navigation.goBack}
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                top: 5,
                zIndex: 10,
              },
            ]}>
            <View
              style={{
                backgroundColor: COLORS.greenDark,
                width: wp(6),
                height: wp(6),
                borderRadius: wp(6) / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AntDesign
                name="arrowleft"
                size={FONT_SIZE.sm}
                color={COLORS.white}
              />
            </View>
            <MyText center size={FONT_SIZE.sm} color={COLORS.greenDark}>
              Back
            </MyText>
          </TouchableOpacity>
        )}

        <AppIcon width={wp(15)} height={wp(20)} />
      </View>

      {isAuthenticated && (
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
      )}
    </View>
  );
};

export default MainHeader;
