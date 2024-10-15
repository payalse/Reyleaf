import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ProductItem2 from '../../../components/ProductItem2';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {useNavigation} from '@react-navigation/native';
import SearchBox from '../../../components/SearchBox';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import ProductItem from '../../../components/ProductItem';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParams, ProductDetailParams} from '../../../naviagtion/types';
import Review from '../../../components/Reviews';

const ReviewsScreen = () => {
  useHideBottomBar({});
  const navigation = useNavigation();
  const {reviews} = useSelector((s: RootState) => s.product);

  if (!reviews.length) {
    return null;
  }
  return (
    <FlatList
      ListHeaderComponent={() => {
        return (
          <View>
            <SafeAreaView />
            <SecondaryHeader
              backBtnContainerStyle={{left: 0}}
              onBack={navigation.goBack}
              title="All Reviews"
            />
          </View>
        );
      }}
      contentContainerStyle={{marginHorizontal: 20}}
      ItemSeparatorComponent={() => <View style={{height: 40}} />}
      data={reviews}
      renderItem={({item}) => {
        return (
          <Review
            id={item?._id}
            user={item?.user}
            updateAt={item.updateAt}
            review={String(item?.review)}
            value={item?.rating}
          />
        );
      }}
    />
  );
};

export default ReviewsScreen;
