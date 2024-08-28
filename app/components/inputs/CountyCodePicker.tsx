import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS} from '../../styles';
import {SmallText} from '../MyText';
import {SHEETS} from '../../sheets/sheets';
import {SheetManager} from 'react-native-actions-sheet';

type Props = {
  value: {
    name: string;
    emoji: string;
    tel: string;
    code: string;
  };
  setValue: React.Dispatch<
    React.SetStateAction<{
      name: string;
      emoji: string;
      tel: string;
      code: string;
    }>
  >;
};
const CountyCodePicker = ({value, setValue}: Props) => {
  const onSelect = (res: any) => {
    setValue(res);
  };
  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          SheetManager.show(SHEETS.CountrySelectSheet, {
            payload: {
              onSelect,
            },
          })
        }
        style={{
          backgroundColor: '#F5FAFF',
          borderRadius: 10,
          borderWidth: 2,
          flex: 1,
          width: 75,
          marginRight: 10,
          borderColor: COLORS.borderLight,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <SmallText>{`${value?.emoji}  ${value?.tel}`}</SmallText>
      </TouchableOpacity>
    </View>
  );
};

export default CountyCodePicker;
