import {FlatList, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {SHEETS} from './sheets';
import {COLORS, FONT_WEIGHT} from '../styles';
import {MyText} from '../components/MyText';

const taxTypes = [
  {value: 'SalesTax', label: 'Sales Tax'},
  {value: 'GST', label: 'GST'},
  {value: 'PST', label: 'PST'},
  {value: 'HST', label: 'HST'},
  {value: 'VAT', label: 'VAT'},
];

const TaxTypeSelectSheet = (props: any) => {
  const close = () => {
    SheetManager.hide(SHEETS.TaxTypeSelectSheet);
  };

  return (
    <ActionSheet id={props.sheetId} gestureEnabled={false}>
      <MyText
        bold={FONT_WEIGHT.bold}
        style={{textAlign: 'center', paddingTop: 10}}>
        Choose Tax Type
      </MyText>
      <FlatList
        style={{height: 250, padding: 20, marginVertical: 20}}
        data={taxTypes}
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

export default TaxTypeSelectSheet;

