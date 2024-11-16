import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ProductHorizontal from '../../../components/ProductHorizontal';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {useNavigation} from '@react-navigation/native';
import SearchBox from '../../../components/SearchBox';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import ProductItem from '../../../components/ProductItem';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParams} from '../../../naviagtion/types';

const TrendingProductsScreen = () => {
  useHideBottomBar({});
  const navigation = useNavigation();
  const navigationHome =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();
  const {trendingProducts} = useSelector((s: RootState) => s.product);

  if (!trendingProducts.length) {
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
              title="Trending Products"
            />
            <SearchBox
              onFilterBtnPress={() => {
                navigationHome.navigate('SearchFilter');
              }}
              disabledOnPress={() => {
                // @ts-ignore
                navigationHome.navigate('SearchTab');
              }}
            />
          </View>
        );
      }}
      contentContainerStyle={{marginHorizontal: 20}}
      ItemSeparatorComponent={() => <View style={{height: 20}} />}
      data={trendingProducts}
      renderItem={({item}) => {
        return (
          <ProductHorizontal
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

export default TrendingProductsScreen;
