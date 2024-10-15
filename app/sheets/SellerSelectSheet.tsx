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
import {api_getSellers} from '../api/seller';
import {GetSellersResponse} from '../types/apiResponse';
import {Sellers} from '../types/index';
import {setSellers} from '../redux/features/seller/sellerSlice';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';

const SellerSelectSheet = (props: any) => {
  const close = () => {
    SheetManager.hide(SHEETS.SellerSelectSheet);
  };
  const {sellers} = useSelector((s: RootState) => s.sellers);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getSellers()) as GetSellersResponse;
      console.log(res);
      dispatch(setSellers(res.data));
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
        Select Seller
      </MyText>
      <FlatList
        style={{height: 250, padding: 20, marginVertical: 20}}
        data={sellers.filter(seller => seller.fullname)}
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
                  {item?.fullname}
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

export default SellerSelectSheet;
