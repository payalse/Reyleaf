import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Calendar} from 'react-native-calendars';
import {COLORS} from '../../../styles';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../redux/store';
import {setActiveEventDate} from '../../../redux/features/event/eventSlice';

const RenderCalander = () => {
  const [markedDates, setMarkedDates] = useState({
    [new Date().toISOString().slice(0, 10)]: {
      selected: true,
      marked: true,
      selectedColor: COLORS.greenDark,
    },
  });
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Calendar
      theme={{
        backgroundColor: COLORS.transparent,
        calendarBackground: COLORS.transparent,
      }}
      style={{
        height: 350,
        backgroundColor: COLORS.transparent,
      }}
      onDayPress={date => {
        console.log('--', date);
        setMarkedDates({
          [date.dateString]: {
            selected: true,
            marked: true,
            selectedColor: COLORS.greenDark,
          },
        });
        dispatch(setActiveEventDate(date.dateString));
      }}
      current={new Date().toISOString().slice(0, 10)}
      markedDates={markedDates}
      // markedDates={{
      //   '2012-03-01': {
      //     selected: true,
      //     marked: true,
      //     selectedColor: COLORS.greenDark,
      //   },
      //   '2012-03-02': {marked: true},
      //   '2012-03-03': {
      //     selected: true,
      //     marked: true,
      //     selectedColor: COLORS.greenDark,
      //   },
      // }}
    />
  );
};

export default RenderCalander;

const styles = StyleSheet.create({});
