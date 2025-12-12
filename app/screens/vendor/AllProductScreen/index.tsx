import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AllProductList from './AllProductList';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT } from '../../../styles';
import { MyText } from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainLayout from '../../../components/layout/MainLayout';
import MainHeader from '../../../components/header/MainHeader';
import React, { useCallback, useEffect, useState } from 'react';
import AddActionButton from '../../../components/buttons/AddActionButton';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AllProductStackParams } from '../../../naviagtion/types';
import FullScreenLoader from '../../../components/FullScreenLoader';
import { ProductType } from '../../../types';
import { api_getSellerProduct } from '../../../api/product';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { heightPixel, pixelSizeVertical } from '../../../utils/sizeNormalization';

const Tab = createMaterialTopTabNavigator();
const topTabConfig = [
  {
    id: 1,
    name: 'All Product',
    comp: (
      data: ProductType[], 
      isSearching?: boolean,
      searchText?: string,
      onSearchTextChange?: (text: string) => void,
      onSearch?: (query: string) => void,
      searchLoading?: boolean
    ) => 
      <AllProductList 
        data={data} 
        isSearching={isSearching}
        searchText={searchText || ''}
        onSearchTextChange={onSearchTextChange || (() => {})}
        onSearch={onSearch || (() => {})}
        searchLoading={searchLoading || false}
      />,
  },
  {
    id: 2,
    name: 'In Review',
    comp: (
      data: ProductType[], 
      isSearching?: boolean,
      searchText?: string,
      onSearchTextChange?: (text: string) => void,
      onSearch?: (query: string) => void,
      searchLoading?: boolean
    ) => 
      <AllProductList 
        data={data} 
        isSearching={isSearching}
        searchText={searchText || ''}
        onSearchTextChange={onSearchTextChange || (() => {})}
        onSearch={onSearch || (() => {})}
        searchLoading={searchLoading || false}
      />,
  },
  {
    id: 3,
    name: 'Rejected Product',
    comp: (
      data: ProductType[], 
      isSearching?: boolean,
      searchText?: string,
      onSearchTextChange?: (text: string) => void,
      onSearch?: (query: string) => void,
      searchLoading?: boolean
    ) => 
      <AllProductList 
        data={data} 
        isSearching={isSearching}
        searchText={searchText || ''}
        onSearchTextChange={onSearchTextChange || (() => {})}
        onSearch={onSearch || (() => {})}
        searchLoading={searchLoading || false}
      />,
  },
];

type ProductSearchProps = {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onSearch: (query: string) => void;
  loading: boolean;
};

export const ProductSearch = ({ searchText, onSearchTextChange, onSearch, loading }: ProductSearchProps) => {
  const debounce = (fn: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedSearch = useCallback(debounce(onSearch, 1000), [onSearch]);

  const handleInputChange = (s: string) => {
    onSearchTextChange(s);
    debouncedSearch(s);
  };

  return (
    <View style={styles.searchInputWrapper}>
      <AntDesign name="search1" color={COLORS.grey} size={FONT_SIZE.xl} />
      <TextInput
        style={{ 
          paddingVertical: 15, 
          color: COLORS.black,
          flex: 1,
          fontSize: FONT_SIZE.base
        }}
        placeholder="Search by Product name "
        placeholderTextColor={COLORS.grey}
        value={searchText}
        onChangeText={handleInputChange}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {loading && (
        <View style={{ marginLeft: 10 }}>
          <ActivityIndicator size="small" color={COLORS.greenDark} />
        </View>
      )}
    </View>
  );
};

type TabLableProp = {
  focused: boolean;
  color: string;
  children: string;
};

const AllProductScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AllProductStackParams>>();
  const [allProduct, setAllProduct] = useState<ProductType[]>([]);
  const [inReviewProduct, setInReviewProduct] = useState<ProductType[]>([]);
  const [rejectedProduct, setRejectedProduct] = useState<ProductType[]>([]);
  const { token } = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  // Search state
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const requestApi = useCallback(async (searchQuery?: string) => {
    try {
      setLoading(true);
      const res = (await api_getSellerProduct(token!, searchQuery)) as {
        data: {
          all: ProductType[];
          inReview: ProductType[];
          rejected: ProductType[];
        };
      };
      setAllProduct(res.data?.all || []);
      setInReviewProduct(res.data?.inReview || []);
      setRejectedProduct(res.data?.rejected || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchLoading(false);
      await requestApi('');
      return;
    }

    setIsSearching(true);
    setSearchLoading(true);
    try {
      await requestApi(query);
    } finally {
      setSearchLoading(false);
    }
  }, [requestApi]);

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setIsSearching(false);
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    requestApi();
  }, [isFocused]);

  const tabBarLabel = useCallback(({ children, focused }: TabLableProp) => {
    const color = focused ? COLORS.black : COLORS.grey;
    const bold = focused ? FONT_WEIGHT.bold : FONT_WEIGHT.normal;
    return (
      <View
        style={{
          marginVertical: 5,
          width: FONT_SIZE.xl * children.length * 0.6,
        }}>
        <MyText size={FONT_SIZE.xl} color={color} bold={bold}>
          {children}
        </MyText>
      </View>
    );
  }, []);

  if (loading && !searchLoading) {
    return <FullScreenLoader />;
  }

  return (
    <React.Fragment>
      <View
        style={{
          display: 'flex',
          position: 'absolute',
          height: heightPixel(800),
          zIndex: 1,
          left: 0,
          top: 0,
          pointerEvents: 'box-none',
          opacity: 1,
        }}>
        <AddActionButton
          onPress={() => {
            navigation.navigate('ProductCreate');
          }}
        />
      </View>
      <MainLayout contentContainerStyle={{ flex: 1 }}>
        <MainHeader />

        <View style={{ height: '100%' }}>
          <View style={styles.searchContainer} />
          <Tab.Navigator
            screenOptions={{
              animationEnabled: false,
              tabBarAllowFontScaling: true,
              tabBarScrollEnabled: true,
              tabBarIndicator: () => null,
              tabBarStyle: {
                backgroundColor: COLORS.transparent,
              },
              tabBarItemStyle: {
                width: 'auto',
              },
              tabBarLabel: tabBarLabel,
            }}>
            {topTabConfig.map(item => {
              return (
                <Tab.Screen
                  key={item.id}
                  name={item.name}
                  options={{
                    animationEnabled: false,
                  }}
                  component={() => {
                    if (item.id === 1) {
                      return item.comp(
                        allProduct, 
                        isSearching, 
                        searchText, 
                        handleSearchTextChange, 
                        handleSearch, 
                        searchLoading
                      );
                    }
                    if (item.id === 2) {
                      return item.comp(
                        inReviewProduct, 
                        isSearching, 
                        searchText, 
                        handleSearchTextChange, 
                        handleSearch, 
                        searchLoading
                      );
                    }
                    return item.comp(
                      rejectedProduct, 
                      isSearching, 
                      searchText, 
                      handleSearchTextChange, 
                      handleSearch, 
                      loading
                    );
                  }}
                />
              );
            })}
          </Tab.Navigator>
        </View>
      </MainLayout>
    </React.Fragment>
  );
};

export default AllProductScreen;

const styles = StyleSheet.create({
  seprator: {
    height: 0.3,
    width: '90%',
    backgroundColor: COLORS.lightgrey,
    alignSelf: 'center',
  },
  headerWrapper: {
    marginHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  searchInputWrapper: {
    height: heightPixel(52),
    backgroundColor: COLORS.lightgrey2,
    marginVertical: pixelSizeVertical(10),
    borderRadius: BORDER_RADIUS.Circle,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    flex: 1,
  },
});
