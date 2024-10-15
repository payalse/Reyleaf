import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ProductItem2 from '../../../components/ProductItem2';
import {ScrollView} from 'react-native-gesture-handler';
import {MyText} from '../../../components/MyText';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../../naviagtion/types';
import {ProductType} from '../../../types';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {api_getFavouriteList} from '../../../api/product';
import FullScreenLoader from '../../../components/FullScreenLoader';

const FavouriteScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const isFocused = useIsFocused();

  const [resultProduct, setResultProduct] = useState<ProductType[]>([]);
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      setResultProduct([]);
      const body = {
        skip: 0,
        take: 20,
      };
      const res: any = await api_getFavouriteList(token!, body);
      console.log(res);
      setResultProduct(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [isFocused]);
  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      <SafeAreaView />
      <View style={{width: '90%', marginLeft: 22}}>
        <SecondaryHeader
          backBtnContainerStyle={{left: 0}}
          onBack={navigation.goBack}
          title="Favourite Product"
        />
      </View>
      <FlatList
        contentContainerStyle={{marginHorizontal: 20, marginTop: 50}}
        ItemSeparatorComponent={() => <View style={{height: 20}} />}
        data={resultProduct}
        renderItem={({item}) => {
          return (
            <ProductItem2
              id={item._id}
              photos={item.photos}
              title={item.title}
              rating={item?.rating}
              price={item.discountedProce.toString()}
              oldPrice={item.price}
              category={item.categoryId.name}
              isFav={item.isFavourite}
              onValueChange={(productId: any) => {
                if (productId) {
                  getData();
                }
              }}
            />
          );
        }}
      />
    </React.Fragment>
  );
};

export default FavouriteScreen;
