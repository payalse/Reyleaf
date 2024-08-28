import {FlatList, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {SHEETS} from './sheets';
import {countries} from '../utils/countryTable';
import {COLORS, FONT_WEIGHT} from '../styles';
import {MyText} from '../components/MyText';

const list = ['he', 'she', 'we', 'they', 'him', 'her'];
const PronounSelectSheet = (props: any) => {
  const close = () => {
    SheetManager.hide(SHEETS.PronounSelectSheet);
  };

  return (
    <ActionSheet id={props.sheetId} gestureEnabled={false}>
      <MyText
        bold={FONT_WEIGHT.bold}
        style={{textAlign: 'center', paddingTop: 10}}>
        Pick One
      </MyText>
      <FlatList
        style={{height: 450, padding: 20, marginVertical: 20}}
        data={list}
        renderItem={({item, index}) => {
          return (
            <>
              <TouchableOpacity
                style={{padding: 10, flexDirection: 'row'}}
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
                  {item}
                </MyText>
              </TouchableOpacity>
            </>
          );
        }}
      />
    </ActionSheet>
  );
};

export default PronounSelectSheet;
