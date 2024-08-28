import {StyleSheet, TextInput, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AllProductList from './AllProductList';
import {COLORS, FONT_SIZE, FONT_WEIGHT, hp, wp} from '../../../styles';
import {MyText} from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainLayout from '../../../components/layout/MainLayout';
import MainHeader from '../../../components/header/MainHeader';
import React, {useCallback, useEffect, useState} from 'react';
import AddActionButton from '../../../components/buttons/AddActionButton';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AllProductStackParams} from '../../../naviagtion/types';
import FullScreenLoader from '../../../components/FullScreenLoader';
import {ProductType} from '../../../types';
import {api_getSellerProduct} from '../../../api/product';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

const Tab = createMaterialTopTabNavigator();
const topTabConfig = [
  {
    id: 1,
    name: 'All Product',
    comp: (data: ProductType[]) => <AllProductList data={data} />,
  },
  {
    id: 2,
    name: 'In Review',
    comp: (data: ProductType[]) => <AllProductList data={data} />,
  },
  {
    id: 3,
    name: 'Rejected Product',
    comp: (data: ProductType[]) => <AllProductList data={data} />,
  },
];

export const ProductSearch = () => {
  return (
    <View style={styles.searchInputWrapper}>
      <AntDesign name="search1" color={COLORS.grey} size={FONT_SIZE.xl} />
      <TextInput
        style={{paddingVertical: 15, color: COLORS.black}}
        placeholder="Search by Product name "
        placeholderTextColor={COLORS.grey}
      />
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
  const {token} = useSelector((s: RootState) => s.auth);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const requestApi = useCallback(async () => {
    try {
      setLoading(true);
      const res = (await api_getSellerProduct(token!)) as {
        data: {
          all: ProductType[];
          inReview: ProductType[];
          rejected: ProductType[];
        };
      };
      setAllProduct(res.data.all);
      setInReviewProduct(res.data.inReview);
      setRejectedProduct(res.data.rejected);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    requestApi();
  }, [isFocused]);

  const tabBarLabel = useCallback(({children, focused}: TabLableProp) => {
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

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <React.Fragment>
      <View
        style={{
          display: 'flex',
          position: 'absolute',
          width: wp(100),
          height: hp(100),
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
      <MainLayout contentContainerStyle={{flex: 1}}>
        <MainHeader />

        <View style={{height: '100%'}}>
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
                    animationEnabled: false, // Disables the click animation
                  }}
                  component={() => {
                    if (item.id === 1) {
                      return item.comp(allProduct);
                    }
                    if (item.id === 2) {
                      return item.comp(inReviewProduct);
                    }
                    return item.comp(rejectedProduct);
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
    height: 45,
    backgroundColor: COLORS.lightgrey2,
    marginVertical: 10,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    flex: 1,
  },
  locationBtn: {
    backgroundColor: COLORS.darkBrown,
    width: wp(12),
    height: wp(12),
    borderRadius: wp(12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
