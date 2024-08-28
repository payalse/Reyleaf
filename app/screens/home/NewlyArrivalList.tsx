import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {MyText} from '../../components/MyText';
import {FONT_SIZE, FONT_WEIGHT} from '../../styles';
import {FlatList} from 'react-native';
import ProductItem from '../../components/ProductItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParams} from '../../naviagtion/types';
import {RootState} from '../../redux/store';
import {useSelector} from 'react-redux';


const NewlyArrivalList = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();

  const {newlyProducts} = useSelector((s: RootState) => s.product);
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
          Newly Arrival
        </MyText>
        <TouchableOpacity onPress={() => navigation.navigate('NewlyArrival')}>
          <MyText>View all</MyText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={newlyProducts}
        contentContainerStyle={{gap: 25}}
        showsHorizontalScrollIndicator={false}
        horizontal
        keyExtractor={item => item?._id}
        renderItem={({item}) => {
          return (
            <ProductItem
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
    </View>
  );
};

export default NewlyArrivalList;

const styles = StyleSheet.create({});
