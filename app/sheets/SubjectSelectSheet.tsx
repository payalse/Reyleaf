import { FlatList, TouchableOpacity, View } from 'react-native';
import React from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { SHEETS } from './sheets';
import { countries } from '../utils/countryTable';
import { COLORS, FONT_WEIGHT } from '../styles';
import { MyText } from '../components/MyText';

const subjectData = [
  'Payment Failure: Transaction Not Processed',
  'Bug Report: App Crashes on Launch',
  'Order Not Received: Shipping Delay Inquiry',
  'Account Security: Password Reset Assistance',
  'Refund Request for Incorrect Charge',
  'Account Deactivation Request',
  'Invoice Request for Recent Purchase',
  'Other Issues',
];

const SubjectSelectSheet = (props: any) => {
  const close = () => {
    SheetManager.hide(SHEETS.SubjectSelectSheet);
  };

  return (
    <ActionSheet id={props.sheetId} gestureEnabled={false}>
      <MyText
        bold={FONT_WEIGHT.bold}
        style={{ textAlign: 'center', paddingTop: 10 }}
      >
        Pick Your Subject
      </MyText>
      <FlatList
        style={{ height: 450, padding: 20, marginVertical: 20 }}
        data={subjectData}
        renderItem={({ item, index }) => {
          return (
            <>
              <TouchableOpacity
                style={{ padding: 10, flexDirection: 'row' }}
                onPress={() => {
                  props?.payload?.onSelect(item);
                  close();
                }}
              >
                <MyText
                  style={{
                    fontSize: 17,
                    color: 'black',
                    padding: 5,
                    margin: 5,
                    fontWeight: 'bold',
                  }}
                >
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

export default SubjectSelectSheet;
