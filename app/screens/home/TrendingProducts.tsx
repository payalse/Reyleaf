import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {MyText} from '../../components/MyText';
import {FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {FlatList} from 'react-native';
import ProductItem from '../../components/ProductItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParams} from '../../naviagtion/types';
import {Touchable} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

const data = [
  {
    id: '1',
    rating: '4.6',
    title: 'Product title',
    category: 'Product Category',
    price: '$60.00',
    oldPrice: '$70.00',
  },
  {
    id: '2',
    rating: '4.6',
    title: 'Product title',
    category: 'Product Category',
    price: '$60.00',
    oldPrice: '$70.00',
  },

  {
    id: '3',
    rating: '4.6',
    title: 'Product title',
    category: 'Product Category',
    price: '$60.00',
    oldPrice: '$70.00',
  },
];

const TrendingProducts = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();
  const {trendingProducts} = useSelector((s: RootState) => s.product);

  if (!trendingProducts.length) {
    return null;
  }
  return (
    <View style={{marginBottom: 20}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <MyText bold={FONT_WEIGHT.bold} size={FONT_SIZE.xl}>
          Trending Products
        </MyText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('TrendingProduct');
          }}>
          <MyText>View all</MyText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={trendingProducts}
        contentContainerStyle={{gap: 25}}
        showsHorizontalScrollIndicator={false}
        horizontal
        keyExtractor={item => item?._id}
        renderItem={({item}) => {
          return (
            <ProductItem
              id={item?._id}
              title={item?.title}
              rating={item?.rating}
              price={String(item?.discountedProce)}
              oldPrice={String(item?.price)}
              category={item?.categoryId?.name}
              photos={item?.photos}
              isFav={item.isFavourite}
            />
          );
        }}
      />
    </View>
  );
};

export default TrendingProducts;

const styles = StyleSheet.create({});
