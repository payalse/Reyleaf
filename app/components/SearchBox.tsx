import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE } from '../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FilterSvg from '../../assets/svg/icons/filter.svg';
import GradientBox from '../components/GradientBox';
import { MyText } from './MyText';
import { heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel } from '../utils/sizeNormalization';

type Props = {
  value?: string;
  onChange?: (s: string) => void;
  onSearch?: () => void;
  disabledOnPress?: () => void; 
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
      style={{ flexDirection: 'row', gap: widthPixel(10), marginVertical: pixelSizeVertical(20) }}>
      <View
        style={{
          backgroundColor: '#EBEBEB',
          height: heightPixel(64),
          flex: 1,
          borderRadius: BORDER_RADIUS.Circle,
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        {disabledOnPress !== undefined ? (
          <MyText
            size={FONT_SIZE.base}
            color={COLORS.grey}
            style={{ paddingLeft: pixelSizeHorizontal(12) }}>
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
              fontSize: FONT_SIZE.base,
              paddingLeft: pixelSizeHorizontal(10),
              color: COLORS.black,
            }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={onSearch}
        style={{
          width: widthPixel(58),
          height: heightPixel(60),
          borderRadius: BORDER_RADIUS.Circle,
          backgroundColor: '#EBEBEB',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AntDesign name="search1" size={widthPixel(20)} color={COLORS.grey} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onFilterBtnPress}>
        <GradientBox
          conatinerStyle={{
            width: widthPixel(54),
            height: heightPixel(56),
            borderRadius: BORDER_RADIUS.Circle,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FilterSvg width={widthPixel(24)} height={heightPixel(24)} />
        </GradientBox>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SearchBox;

const styles = StyleSheet.create({});
