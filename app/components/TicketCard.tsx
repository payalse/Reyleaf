import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT} from '../styles';
import {MyText} from './MyText';
import {useNavigation} from '@react-navigation/native';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../utils/sizeNormalization';

export interface ITicketItem {
  _id: string;
  title: string;
  subject: string;
  status: 'Open' | 'Closed' | string;
  description: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketCardProps {
  item: ITicketItem;
}

const TicketCard: React.FC<TicketCardProps> = ({item}) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        navigation.navigate('SupportChat', {item});
      }}
      style={styles.container}>
      <View style={styles.header}>
        <MyText bold={FONT_WEIGHT.bold} style={styles.title}>
          {item?.title}
        </MyText>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item?.status === 'Open' ? COLORS.greenDark : COLORS.red,
            },
          ]}>
          <MyText color={COLORS.white} size={FONT_SIZE.base}>
            {item?.status}
          </MyText>
        </View>
      </View>
      <MyText color={COLORS.grey} size={FONT_SIZE.base}>
        {item?.description}
      </MyText>
    </TouchableOpacity>
  );
};

export default TicketCard;

const styles = StyleSheet.create({
  container: {
    padding: heightPixel(20),
    backgroundColor: COLORS.white,
    marginHorizontal: pixelSizeHorizontal(20),
    marginVertical: pixelSizeVertical(10),
    borderRadius: BORDER_RADIUS.Medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: pixelSizeVertical(8),
  },
  title: {
    width: '80%',
  },
  statusBadge: {
    paddingVertical: pixelSizeVertical(6),
    paddingHorizontal: pixelSizeHorizontal(10),
    borderRadius: BORDER_RADIUS['Semi-Large'],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
