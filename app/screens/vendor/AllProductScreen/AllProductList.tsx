import {FlatList, Image, View} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ProductSearch} from '.';
import {ProductType} from '../../../types';
import DummyProductImage from '../../../../assets/img/productPlaceholder.jpeg';
import {BUILD_IMAGE_URL} from '../../../api';

const listHeaderComponent = () => {
  return <ProductSearch />;
};

const AllProductList = ({data}: {data: ProductType[]}) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={listHeaderComponent}
      data={data}
      renderItem={({item}) => {
        return (
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 8,
              marginBottom: 20,
              borderRadius: 10,
              flexDirection: 'row',
              gap: 10,
            }}>
            <View
              style={{
                backgroundColor: COLORS.grey,
                width: 100,
                height: 100,
                borderRadius: 10,
              }}>
              <Image
                source={
                  item?.photos[0]
                    ? {uri: BUILD_IMAGE_URL(item?.photos[0].url)}
                    : DummyProductImage
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  resizeMode: 'cover',
                }}
              />
            </View>
            <View>
              <MyText bold={FONT_WEIGHT.bold}>{item?.title}</MyText>
              <MyText>{item?.categoryId?.name}</MyText>
              <View style={{flexDirection: 'row', gap: 10, marginVertical: 10}}>
                <View style={{flexDirection: 'row', gap: 5}}>
                  <AntDesign name="star" color={'gold'} size={FONT_SIZE.base} />
                  <AntDesign name="star" color={'gold'} size={FONT_SIZE.base} />
                  <AntDesign name="star" color={'gold'} size={FONT_SIZE.base} />
                  <AntDesign name="star" color={'gold'} size={FONT_SIZE.base} />
                  <AntDesign
                    name="star"
                    color={'lightgrey'}
                    size={FONT_SIZE.base}
                  />
                </View>
                <MyText size={FONT_SIZE.sm}> 4.6 Reviews</MyText>
              </View>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <MyText bold={FONT_WEIGHT.bold}>
                  $ {item?.discountedProce}
                </MyText>
                <MyText
                  size={FONT_SIZE.sm}
                  style={{textDecorationLine: 'line-through'}}>
                  ${item?.price}
                </MyText>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};

export default AllProductList;
