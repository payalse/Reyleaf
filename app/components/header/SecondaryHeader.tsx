import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT, wp} from '../../styles';
import {MyText} from '../MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Props = {
  onBack?: () => void;
  backIconColor?: string;
  backIconBgColor?: string;
  backTextColor?: string;
  titleColor?: string;
  title: string;
  backBtnContainerStyle?: StyleProp<ViewStyle>;
  RightComp?: () => React.ReactNode;
};

const SecondaryHeader = ({
  onBack,
  title,
  backTextColor,
  backIconColor,
  backIconBgColor,
  titleColor,
  backBtnContainerStyle,
  RightComp,
}: Props) => {
  return (
    <View style={{marginTop: 15}}>
      <TouchableOpacity
        onPress={onBack}
        style={[
          {
            position: 'absolute',
            left: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            top: 5,
            zIndex: 10,
          },
          backBtnContainerStyle,
        ]}>
        <View
          style={{
            backgroundColor: backIconBgColor || COLORS.greenDark,
            width: wp(6),
            height: wp(6),
            borderRadius: wp(6) / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign
            name="arrowleft"
            size={FONT_SIZE.sm}
            color={backIconColor || COLORS.white}
          />
        </View>
        <MyText
          center
          size={FONT_SIZE.sm}
          color={backTextColor || COLORS.greenDark}>
          Back
        </MyText>
      </TouchableOpacity>
      <MyText
      style={{width: '60%', textAlign: 'center', margin: 'auto', alignSelf: 'center'}}
        center
        size={FONT_SIZE.xl}
        bold={FONT_WEIGHT.bold}
        color={titleColor || COLORS.black}>
        {title}
      </MyText>

      {/* RIGHT COMP */}
      {RightComp && (
        <View
          style={[
            {
              position: 'absolute',
              right: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              top: 5,
              zIndex: 10,
            },
          ]}>
          {RightComp()}
        </View>
      )}
      {/* RIGHT COMP */}
    </View>
  );
};

export default SecondaryHeader;

const styles = StyleSheet.create({});
