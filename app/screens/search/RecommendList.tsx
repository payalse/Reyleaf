import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {MyText} from '../../components/MyText';
import {FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {FlatList} from 'react-native';
import Product from '../../components/Product';
import {ProductType} from '../../types';


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
            <Product
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
