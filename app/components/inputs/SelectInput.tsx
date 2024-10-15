import {View, TouchableOpacity} from 'react-native';
import {COLORS} from '../../styles';
import Entypo from 'react-native-vector-icons/Entypo';
import {MyText} from '../MyText';
type Props = {
  placeholder?: string;
  onPress?: () => void;
  hideRightIcon?: boolean;
  hasError?: boolean;
  value?: string;
};

const SelectInput = ({
  placeholder,
  onPress,
  hideRightIcon = false,
  hasError,
  value,
}: Props) => {
  console.log(value);
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          paddingVertical: 18,
          paddingRight: 20,
          paddingLeft: 20,
          borderRadius: 50,
          borderWidth: hasError ? 1.5 : 1,
          borderColor: hasError ? COLORS.red : COLORS.lightgrey,
          backgroundColor: 'transparent',
        }}>
        {value ? (
          <MyText color={COLORS.black}>{value}</MyText>
        ) : (
          <MyText color={COLORS.grey}>{placeholder}</MyText>
        )}
      </View>
      {hideRightIcon || (
        <View
          style={{
            width: 40,
            height: 40,
            position: 'absolute',
            top: 5,
            right: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Entypo name={'chevron-down'} size={24} color={COLORS.grey} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SelectInput;
