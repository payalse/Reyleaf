import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MainHeader from '../../components/header/MainHeader';
import RecommendList from './RecommendList';
import SearchBox from '../../components/SearchBox';
import { MyText } from '../../components/MyText';
import { COLORS, FONT_SIZE, FONT_WEIGHT } from '../../styles';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchStackParams } from '../../naviagtion/types';
import { api_searchProduct } from '../../api/product';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import FullScreenLoader from '../../components/FullScreenLoader';
import ProductItem2 from '../../components/ProductItem2';
import ProductItem from '../../components/ProductItem';
import { ProductType } from '../../types';
import { TAB_BAR_BG_HEIGHT } from '../../naviagtion/MainTab';
import AsyncStorage from '@react-native-async-storage/async-storage';

const data = [
  'Natural Skin Caream',
  'Room Cleaner',
  'Toilet Paper',
  'Side Bag',
];

const SearchScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SearchStackParams>>();
  const [recommendedList, setRecommendedList] = useState([]);
  const [resultProduct, setResultProduct] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const { token } = useSelector((s: RootState) => s.auth);
  const [history, setHistory] = useState<string[]>([]);
  // const handleTabPress = (e: any) => {

  const saveHistory = (searchString: string) => {
    const tempHistory = [...history];
    if (tempHistory.length < 5) {
      tempHistory.push(searchString);
    } else {
      tempHistory.shift();
      tempHistory.push(searchString);
    }
    setHistory(tempHistory);
    AsyncStorage.setItem('history', JSON.stringify(tempHistory));
  };


  const handleSearch = async () => {
    if (!text) {
      return;
    }
    saveHistory(text);

    try {
      setLoading(true);
      const res: any = await api_searchProduct(token!, text);
      console.log(res);
      setResultProduct(res.data.searched);
      if (res?.data?.recommended) {
        setRecommendedList(res?.data?.recommended);
      }
      setText('');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getHistory = () => {
    AsyncStorage.getItem('history').then((res: any) => {
      if (res !== null) {
        const localHistory: any = JSON.parse(res);
        setHistory(localHistory);
      }
    });
  };

  const clearHistory = () => {
    AsyncStorage.removeItem('history');
    setHistory([])
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <React.Fragment>
      {loading && <FullScreenLoader />}
      <SafeAreaView />
      <View style={{ marginHorizontal: 20 }}>
        <MainHeader
          onMessagePress={() => navigation.navigate('ChatStack')}
          onNotiPress={() => navigation.navigate('AppNotification')}
        />
        <SearchBox
          value={text}
          onChange={s => setText(s)}
          onSearch={handleSearch}
          onFilterBtnPress={() => navigation.navigate('SearchFilter')}
        />
      </View>
      <FlatList
        data={resultProduct}
        ListHeaderComponent={() => {
          return (
            <View style={{ marginHorizontal: 20 }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 20,
                    justifyContent: 'space-between',
                  }}
                >
                  <MyText size={FONT_SIZE.xl} bold={FONT_WEIGHT.bold}>
                    Recent Search
                  </MyText>
                  <MyText size={FONT_SIZE.sm} onPress={clearHistory}>
                    Clear History
                  </MyText>
                </View>
                <View>
                  {history?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          marginBottom: 20,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <AntDesgin
                          name="search1"
                          size={18}
                          color={COLORS.grey}
                        />
                        <Pressable onPress={() => setText(item)}>
                          <MyText size={FONT_SIZE.sm} color={COLORS.grey}>
                            {item}
                          </MyText>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          );
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ marginBottom: 10 }}>
              <ProductItem2
                id={item._id}
                photos={item.photos}
                title={item.title}
                price={String(item.discountedProce)}
                oldPrice={String(item.price)}
                category={item.categoryId.name}
                rating={item?.rating}
                isFav={item.isFavourite}
              />
            </View>
          );
        }}
        ListFooterComponentStyle={{ marginBottom: TAB_BAR_BG_HEIGHT }}
        ListFooterComponent={() => {
          return (
            <View style={{ marginHorizontal: 20 }}>
              <RecommendList products={recommendedList} />
            </View>
          );
        }}
      />
    </React.Fragment>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
