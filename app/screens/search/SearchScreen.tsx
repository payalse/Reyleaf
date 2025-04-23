import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import MainHeader from '../../components/header/MainHeader';
import SearchBox from '../../components/SearchBox';
import { MyText } from '../../components/MyText';
import FullScreenLoader from '../../components/FullScreenLoader';
import Product from '../../components/Product';
import RecommendList from './RecommendList';

import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../styles';
import { SearchStackParams } from '../../naviagtion/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { api_searchProduct } from '../../api/product';
import { RootState } from '../../redux/store';
import { ProductType } from '../../types';
import { TAB_BAR_BG_HEIGHT } from '../../naviagtion/MainTab';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '../../utils/sizeNormalization';

const SearchScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SearchStackParams>>();
  const { token } = useSelector((s: RootState) => s.auth);

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [recommendedList, setRecommendedList] = useState([]);
  const [resultProduct, setResultProduct] = useState<ProductType[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('history').then(res => {
      if (res) setHistory(JSON.parse(res));
    });
  }, []);

  const saveHistory = (query: string) => {
    const updated = [...history];
    if (updated.includes(query)) return;
    if (updated.length >= 5) updated.shift();
    updated.push(query);
    setHistory(updated);
    AsyncStorage.setItem('history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    AsyncStorage.removeItem('history');
    setHistory([]);
  };

  const handleSearch = async (query?: string) => {
    const searchValue = query || text;
    if (!searchValue) return;

    saveHistory(searchValue);
    setLoading(true);
    try {
      const res: any = await api_searchProduct(token!, searchValue);
      setResultProduct(res.data?.searched || []);
      setRecommendedList(res.data?.recommended || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const debounce = (fn: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleInputChange = (s: string) => {
    setText(s);
    debouncedSearch(s);
  };

  const renderHistory = () =>
    history.map((item, index) => (
      <View key={index} style={styles.historyRow}>
        <AntDesign name="search1" size={widthPixel(18)} color={COLORS.grey} />
        <Pressable onPress={() => setText(item)} style={styles.historyPress}>
          <MyText color={COLORS.grey}>{item}</MyText>
        </Pressable>
      </View>
    ));

  return (
    <>
      {loading && <FullScreenLoader />}
      <SafeAreaView />
      <View style={styles.headerWrapper}>
        <MainHeader
          onMessagePress={() => navigation.navigate('ChatStack')}
          onNotiPress={() => navigation.navigate('AppNotification')}
        />
        <SearchBox
          value={text}
          onChange={handleInputChange}
          onSearch={handleSearch}
          onFilterBtnPress={() => navigation.navigate('SearchFilter')}
        />
      </View>

      <FlatList
        data={resultProduct}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.historyHeader}>
              <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
                Recent Search
              </MyText>
              <MyText size={FONT_SIZE.base} onPress={clearHistory}>
                Clear History
              </MyText>
            </View>
            <View>{renderHistory()}</View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.productWrapper}>
            <Product
              id={item._id}
              photos={item.photos}
              title={item.title}
              price={String(item.discountedProce)}
              oldPrice={String(item.price)}
              category={item.categoryId.name}
              rating={item?.rating}
              isFav={item.isFavourite}
              layout="horizontal"
            />
          </View>
        )}
        ListFooterComponentStyle={{ marginBottom: TAB_BAR_BG_HEIGHT }}
        ListFooterComponent={
          <View style={styles.recommendWrapper}>
            <RecommendList products={recommendedList} />
          </View>
        }
      />
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  headerWrapper: {
    marginHorizontal: pixelSizeVertical(20),
  },
  listHeader: {
    marginHorizontal: pixelSizeHorizontal(20),
  },
  historyHeader: {
    flexDirection: 'row',
    marginBottom: pixelSizeVertical(16),
    justifyContent: 'space-between',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: pixelSizeVertical(20),
  },
  historyPress: {
    marginTop: pixelSizeVertical(-2),
  },
  productWrapper: {
    marginBottom: pixelSizeVertical(10),
    paddingHorizontal: pixelSizeHorizontal(20),
  },
  recommendWrapper: {
    marginHorizontal: pixelSizeHorizontal(20),
  },
});
