import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ProductItem2 from '../../../components/ProductItem2';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import SearchBox from '../../../components/SearchBox';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SearchStackParams} from '../../../naviagtion/types';
import {ProductType} from '../../../types';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {api_searchProductWithFilters} from '../../../api/product';
import FullScreenLoader from '../../../components/FullScreenLoader';
import styles from 'rn-range-slider/styles';

const SearchResultScreen = () => {
  useHideBottomBar({});
  const navigation =
    useNavigation<NativeStackNavigationProp<SearchStackParams>>();
  const params =
    useRoute<RouteProp<SearchStackParams, 'SearchResult'>>().params;
  const [resultProduct, setResultProduct] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const {token} = useSelector((s: RootState) => s.auth);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const body = {
        query: text,
        vendorId: params.vendorId || [],
        categoryId:
          params.categoryId && params.categoryId != '0'
            ? params.categoryId
            : '',
        priceStart: params.priceStart || 0,
        priceEnd: params.priceEnd || null,
      };
      const res: any = await api_searchProductWithFilters(token!, body);
      console.log(res);
      setResultProduct(res.data.searched);
      setText('');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      <SafeAreaView />
      <View style={{width: '90%', marginLeft: 22}}>
        <SecondaryHeader
          backBtnContainerStyle={{left: 0}}
          onBack={navigation.goBack}
          title="Search Result"
        />
        <SearchBox
          value={text}
          onChange={s => setText(s)}
          onSearch={handleSearch}
          onFilterBtnPress={navigation.goBack}
        />
      </View>
      <FlatList
        contentContainerStyle={{marginHorizontal: 20}}
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
            />
          );
        }}
      />
    </React.Fragment>
  );
};

export default SearchResultScreen;
