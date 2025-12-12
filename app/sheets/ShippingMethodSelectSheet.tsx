import {FlatList, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {SHEETS} from './sheets';
import {COLORS, FONT_WEIGHT} from '../styles';
import {MyText} from '../components/MyText';

const shippingMethods = [
  {value: 'standard', label: 'Standard'},
  {value: 'express', label: 'Express'},
  {value: 'two_day', label: 'Two Day'},
  {value: 'next_day', label: 'Next Day'},
  {value: 'pickup', label: 'Pickup'},
];

const ShippingMethodSelectSheet = (props: any) => {
  const close = () => {
    SheetManager.hide(SHEETS.ShippingMethodSelectSheet);
  };

  return (
    <ActionSheet id={props.sheetId} gestureEnabled={false}>
      <MyText
        bold={FONT_WEIGHT.bold}
        style={{textAlign: 'center', paddingTop: 10}}>
        Choose Shipping Method
      </MyText>
      <FlatList
        style={{height: 250, padding: 20, marginVertical: 20}}
        data={shippingMethods}
        renderItem={({item}) => {
          return (
            <>
              <TouchableOpacity
                style={{padding: 5, flexDirection: 'row'}}
                onPress={() => {
                  props?.payload?.onSelect(item);
                  close();
                }}>
                <MyText
                  style={{
                    fontSize: 17,
                    color: 'black',
                    padding: 5,
                    margin: 5,
                    fontWeight: 'bold',
                  }}>
                  {item.label}
                </MyText>
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: COLORS.grey,
                  height: 1,
                  opacity: 0.2,
                }}
              />
            </>
          );
        }}
      />
    </ActionSheet>
  );
};

export default ShippingMethodSelectSheet;

