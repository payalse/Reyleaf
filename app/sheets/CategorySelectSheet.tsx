import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {SHEETS} from './sheets';
import {COLORS, FONT_WEIGHT} from '../styles';
import {MyText} from '../components/MyText';
import {api_getCategories} from '../api/category';
import {GetCategoriesResponse} from '../types/apiResponse';
import {CategoryType} from '../types';

const CategorySelectSheet = (props: any) => {
  const close = () => {
    SheetManager.hide(SHEETS.CategorySelectSheet);
  };
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CategoryType[]>([]);

  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getCategories()) as GetCategoriesResponse;
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestApi();
  }, []);

  return (
    <ActionSheet id={props.sheetId} gestureEnabled={false}>
      <MyText
        bold={FONT_WEIGHT.bold}
        style={{textAlign: 'center', paddingTop: 10}}>
        Choose Category
      </MyText>
      <FlatList
        style={{height: 250, padding: 20, marginVertical: 20}}
        data={data}
        ListEmptyComponent={() => {
          return (
            <View>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <MyText center>No Found!</MyText>
              )}
            </View>
          );
        }}
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
                  {item.name}
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

export default CategorySelectSheet;
