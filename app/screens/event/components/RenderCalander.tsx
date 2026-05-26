import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../redux/store';
import {setActiveEventDate} from '../../../redux/features/event/eventSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fontPixel, widthPixel} from '../../../utils/sizeNormalization';

const TODAY = new Date().toISOString().slice(0, 10);

const RenderCalander = () => {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setActiveEventDate(TODAY));
  }, []);

  const handleDayPress = (date: {dateString: string}) => {
    setSelectedDate(date.dateString);
    dispatch(setActiveEventDate(date.dateString));
  };

  return (
    <Calendar
      current={TODAY}
      onDayPress={handleDayPress}
      markedDates={{
        [selectedDate]: {
          selected: true,
          selectedColor: COLORS.greenDark,
        },
      }}
      renderArrow={direction => (
        <View style={styles.arrowBtn}>
          <Ionicons
            name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
            size={fontPixel(18)}
            color={COLORS.greenDark}
          />
        </View>
      )}
      theme={{
        backgroundColor: COLORS.transparent,
        calendarBackground: COLORS.transparent,
        textSectionTitleColor: COLORS.grey,
        monthTextColor: COLORS.darkBrown,
        textMonthFontWeight: FONT_WEIGHT.bold,
        textMonthFontSize: fontPixel(16),
        dayTextColor: COLORS.black,
        textDayFontSize: fontPixel(14),
        textDayHeaderFontSize: fontPixel(12),
        todayTextColor: COLORS.greenDark,
        selectedDayTextColor: COLORS.white,
        selectedDayBackgroundColor: COLORS.greenDark,
        arrowColor: COLORS.greenDark,
      }}
      style={styles.calendar}
    />
  );
};

export default RenderCalander;

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: COLORS.transparent,
  },
  arrowBtn: {
    width: widthPixel(34),
    height: widthPixel(34),
    borderRadius: widthPixel(17),
    borderWidth: 1,
    borderColor: COLORS.lightgrey2,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
