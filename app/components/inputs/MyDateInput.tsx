import {View, TextInput, KeyboardType, TouchableOpacity} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {COLORS} from '../../styles';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {RegularText} from '../MyText';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
type Props = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  placeholder?: string;
};
const MyDateInput = ({placeholder, date, setDate}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <TouchableOpacity
        onPress={() => {
          setOpen(true);
        }}>
        <View
          style={{
            backgroundColor: '#F5FAFF',
            padding: 20,
            borderRadius: 10,
            borderWidth: 2,
            height: 60,
            borderColor: COLORS.borderLight,
          }}>
          <RegularText style={{color: COLORS.grey}}>
            {date ? moment(date).format('L') : 'DD/MM/YYYY'}
          </RegularText>
        </View>

        <View
          style={{
            width: 40,
            height: 40,
            position: 'absolute',
            top: 10,
            right: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Fontisto name={'date'} size={24} color={COLORS.grey} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MyDateInput;
