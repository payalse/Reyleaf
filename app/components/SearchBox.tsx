import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE, wp} from '../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FilterSvg from '../../assets/svg/icons/filter.svg';
import GradientBox from '../components/GradientBox';
import {MyText} from './MyText';

type Props = {
  value?: string;
  onChange?: (s: string) => void;
  onSearch?: () => void;
  disabledOnPress?: () => void; //if this true make it touchable
  onFilterBtnPress?: () => void;
};

const SearchBox = ({
  disabledOnPress,
  onFilterBtnPress,
  value,
  onChange,
  onSearch,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={!disabledOnPress}
      onPress={disabledOnPress}
      style={{flexDirection: 'row', gap: wp(2), marginVertical: 20}}>
      <View
        style={{
          backgroundColor: '#EBEBEB',
          height: 60,
          flex: 1,
          borderRadius: 30,
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
        {disabledOnPress !== undefined ? (
          <MyText size={FONT_SIZE.sml} color={COLORS.grey} style={{paddingLeft: 12}}>
            Search by Product name, brand
          </MyText>
        ) : (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholderTextColor={COLORS.grey}
            placeholder="Search by Product name, brand"
            style={{
              flex: 1,
              height: '100%',
              fontSize: FONT_SIZE.sml,
              paddingLeft: 10,
              color: COLORS.black,
            }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={onSearch}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#EBEBEB',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AntDesign name="search1" size={FONT_SIZE.xl} color={COLORS.grey} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onFilterBtnPress}>
        <GradientBox
          conatinerStyle={{
            width: wp(14),
            height: wp(14),
            borderRadius: wp(14) / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FilterSvg width={25} height={25} />
        </GradientBox>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SearchBox;

const styles = StyleSheet.create({});
