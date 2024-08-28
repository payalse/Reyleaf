import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {MARGIN_TOP} from '..';
import {COLORS, FONT_SIZE, FONT_WEIGHT, wp} from '../../../styles';
import {MyText} from '../../../components/MyText';

type Props = {
  heading: string;
  subHeading: string;
  stripeComp: React.ReactNode;
};

const RenderBody = ({heading, subHeading, stripeComp}: Props) => {
  return (
    <View
      style={{
        width: wp(100),
      }}>
      {stripeComp}
      <View
        style={{
          height: MARGIN_TOP,
          width: wp(100),
        }}
      />
      <View
        style={{
          width: wp(100),
          gap: 10,
          flex: 1,
          justifyContent: 'space-evenly',
          paddingBottom: 20,
        }}>
        <MyText
          style={{marginHorizontal: wp(4)}}
          center
          size={FONT_SIZE['1.5xl']}
          bold={FONT_WEIGHT.bold}>
          {heading}
        </MyText>
        <MyText
          style={{lineHeight: 22, marginHorizontal: wp(10)}}
          center
          color={COLORS.grey}
          size={FONT_SIZE.base}>
          {subHeading}
        </MyText>
      </View>
    </View>
  );
};

export default RenderBody;

const styles = StyleSheet.create({});
