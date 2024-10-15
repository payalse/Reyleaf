import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ProductItem2 from '../../../components/ProductItem2';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {useNavigation} from '@react-navigation/native';
import SearchBox from '../../../components/SearchBox';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import ProductItem from '../../../components/ProductItem';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParams} from '../../../naviagtion/types';

const BestSellingScreen = () => {
  useHideBottomBar({});
  const navigation = useNavigation();

  const navigationHome =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();
    const {isAuthenticated} = useSelector((s: RootState) => s.auth);
  const {bestSellingProducts} = useSelector((s: RootState) => s.product);

  return (
    <FlatList
      ListHeaderComponent={() => {
        return (
          <View>
            <SafeAreaView />
            <SecondaryHeader
              backBtnContainerStyle={{left: 0}}
              onBack={navigation.goBack}
              title="Best Sellers"
            />
            {isAuthenticated ? (
            <SearchBox
              onFilterBtnPress={() => {
                navigationHome.navigate('SearchFilter');
              }}
              disabledOnPress={() => {
                // @ts-ignore
                navigationHome.navigate('SearchTab');
              }}
            />
            ): (
              <View style={{height: 20}} />
            )}
          </View>
        );
      }}
      contentContainerStyle={{marginHorizontal: 20}}
      ItemSeparatorComponent={() => <View style={{height: 20}} />}
      data={bestSellingProducts}
      renderItem={({item}) => {
        return (
          <ProductItem2
            photos={item?.photos}
            id={item?._id}
            title={item?.title}
            rating={item?.rating}
            price={String(item?.discountedProce)}
            oldPrice={String(item?.price)}
            category={item.categoryId?.name}
            isFav={item.isFavourite}
          />
        );
      }}
    />
  );
};

export default BestSellingScreen;
