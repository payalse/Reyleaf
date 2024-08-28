import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {MyText} from '../../components/MyText';
import {FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {FlatList} from 'react-native';
import ProductItem from '../../components/ProductItem';
import {ProductType} from '../../types';

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

const RecommendList = ({products}: {products: ProductType[]}) => {
  if (!products.length) {
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
          Recommend for you
        </MyText>
        {/* <MyText>View all</MyText> */}
      </View>
      <FlatList
        data={products}
        contentContainerStyle={{gap: 25}}
        showsHorizontalScrollIndicator={false}
        horizontal
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          return (
            <ProductItem
              category={item.categoryId.name}
              oldPrice={String(item.price)}
              price={String(item.discountedProce)}
              id={item._id}
              rating={item?.rating}
              title={item.title}
              photos={item.photos}
              isFav={item.isFavourite}
            />
          );
        }}
      />
    </View>
  );
};

export default RecommendList;
