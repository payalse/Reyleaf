import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import SecondaryHeader from '../../components/header/SecondaryHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import SearchBox from '../../components/SearchBox';
import {useHideBottomBar} from '../../hook/useHideBottomBar';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import Product from '../../components/Product';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParams} from '../../naviagtion/types';

type RouteParams = {
  title: string;
  productData: any[]; // Replace with your product data type
};

const AllProductList = () => {
  useHideBottomBar({});
  const navigation = useNavigation();
  const route = useRoute();
  const navigationHome =
  useNavigation<NativeStackNavigationProp<HomeStackParams>>();
  const {title, productData} = route.params as RouteParams;
  const {isAuthenticated} = useSelector((s: RootState) => s.auth);

  return (
    <FlatList
      ListHeaderComponent={() => {
        return (
          <View>
            <SafeAreaView />
            <SecondaryHeader
              backBtnContainerStyle={{left: 0}}
              onBack={navigation.goBack}
              title={title}
            />
            {isAuthenticated ? (
              <SearchBox
                onFilterBtnPress={() => {
                    navigationHome.navigate('SearchFilter');
                }}
                disabledOnPress={() => {
                  // @ts-ignore
                  navigationHome.navigate('SearchTab');
                }}
              />
            ) : (
              <View style={{height: 20}} />
            )}
          </View>
        );
      }}
      contentContainerStyle={{marginHorizontal: 20}}
      ItemSeparatorComponent={() => <View style={{height: 20}} />}
      data={productData}
      keyExtractor={item => item._id}
      renderItem={({item}) => (
        <Product
          photos={item?.photos}
          id={item?._id}
          title={item?.title}
          rating={item?.rating}
          price={String(item?.discountedProce)}
          oldPrice={String(item?.price)}
          category={item?.categoryId?.name}
          isFav={item.isFavourite}
          layout="horizontal"
        />
      )}
    />
  );
};

export default AllProductList;
