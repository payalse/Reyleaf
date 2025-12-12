import {FlatList, Image, View, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE, FONT_WEIGHT} from '../../../styles';
import {MyText} from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ProductSearch} from '.';
import {ProductType} from '../../../types';
import DummyProductImage from '../../../../assets/img/productPlaceholder.jpeg';
import {BUILD_IMAGE_URL} from '../../../api';
import Product from '../../../components/Product';
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '../../../utils/sizeNormalization';

type AllProductListProps = {
  data: ProductType[];
  isSearching?: boolean;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onSearch: (query: string) => void;
  searchLoading: boolean;
};

const listHeaderComponent = (props: {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onSearch: (query: string) => void;
  searchLoading: boolean;
}) => {
  return <ProductSearch {...props} loading={props.searchLoading} />;
};

const AllProductList = ({
  data,
  isSearching = false,
  searchText,
  onSearchTextChange,
  onSearch,
  searchLoading,
}: AllProductListProps) => {
  const displayData = data;
  const isEmpty = displayData.length === 0;

  const renderEmptyComponent = () => {
    if (isSearching && searchLoading) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.greenDark} />
          <MyText style={{ marginTop: 10, color: COLORS.grey }}>
            Searching for "{searchText}"...
          </MyText>
        </View>
      );
    }

    if (isSearching && !searchLoading && searchText.trim()) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <MyText size={FONT_SIZE.lg} color={COLORS.grey}>
            No products found for "{searchText}"
          </MyText>
          <MyText size={FONT_SIZE.sm} color={COLORS.grey} style={{ marginTop: 5 }}>
            Try a different search term
          </MyText>
        </View>
      );
    }

    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <MyText size={FONT_SIZE.lg} color={COLORS.grey}>
          No products available
        </MyText>
      </View>
    );
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => 
        listHeaderComponent({
          searchText,
          onSearchTextChange,
          onSearch,
          searchLoading,
        })
      }
      contentContainerStyle={{
        paddingBottom: pixelSizeVertical(100),
        flexGrow: 1,
      }}
      ItemSeparatorComponent={() => (
        <View style={{ height: pixelSizeVertical(16) }} />
      )}
      ListFooterComponent={() => (
        <View style={{ height: pixelSizeVertical(200) }} />
      )}
      data={displayData}
      renderItem={({item}) => {
        return (
          <View style={{ width: '100%' }}>
            <Product
              photos={item?.photos}
              id={item?._id}
              title={item?.title}
              rating={item?.rating}
              price={String(item?.discountedProce || 0)}
              oldPrice={String(item?.price || 0)}
              category={item?.categoryId?.name}
              isFav={item.isFavourite}
              layout="horizontal"
            />
          </View>
        );
      }}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
};

export default AllProductList;
