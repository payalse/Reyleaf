import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchStackParams } from '../../../naviagtion/types';
import MainLayout from '../../../components/layout/MainLayout';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import PrimaryBtn from '../../../components/buttons/PrimaryBtn';
import InputWrapper from '../../../components/inputs/InputWrapper';
import SelectInput from '../../../components/inputs/SelectInput';
import GradientBox from '../../../components/GradientBox';
import { MyText } from '../../../components/MyText';
import { COLORS, FONT_SIZE, FONT_WEIGHT, wp } from '../../../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RangeSlider from '../../../components/RangeSlider';
import { useHideBottomBar } from '../../../hook/useHideBottomBar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import {
  GetCategoriesResponse,
  GetSellersResponse,
} from '../../../types/apiResponse';
import { api_getCategories } from '../../../api/category';
import { setCategories } from '../../../redux/features/category/categorySlice';
import { SheetManager } from 'react-native-actions-sheet';
import { SHEETS } from '../../../sheets/sheets';
import { Sellers } from '../../../types';

const Chip = ({
  onPress,
  text,
  isActive,
}: {
  onPress: () => void;
  text: string;
  isActive: boolean;
}) => {
  if (isActive) {
    return (
      <TouchableOpacity onPress={onPress} style={{ width: wp(90 / 3) }}>
        <GradientBox
          conatinerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 20,
            flexDirection: 'row',
            gap: 5,
            marginHorizontal: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MyText center color={COLORS.white} size={FONT_SIZE.sm}>
            {text}
          </MyText>
        </GradientBox>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: wp(82 / 3),
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        flexDirection: 'row',
        gap: 5,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.lightgrey,
        borderWidth: 1,
        backgroundColor: COLORS.lightgrey2,
      }}
    >
      <MyText center color={COLORS.lightgrey} size={FONT_SIZE.sm}>
        {text}
      </MyText>
    </TouchableOpacity>
  );
};

const SearchFilterScreen = () => {
  useHideBottomBar({});
  const navigation =
    useNavigation<NativeStackNavigationProp<SearchStackParams>>();

  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [minPriceRange, setMinPriceRange] = useState(0);
  const [maxPriceRange, setMaxPriceRange] = useState(500);
  const [selectedSellers, setSelectedSellers] = useState<Sellers[]>([]);
  const { categories, homeActiveCategory } = useSelector(
    (s: RootState) => s.category,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    try {
      setLoading(true);
      const res = (await api_getCategories()) as GetCategoriesResponse;
      dispatch(setCategories(res.data));
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    let vendorId: any[] = [];
    if (selectedSellers && selectedSellers.length) {
      selectedSellers.forEach(element => {
        vendorId.push(element._id);
      });
    }
    navigation.navigate('SearchResult', {
      categoryId: selectedCategoryId,
      vendorId: vendorId,
      priceStart: minPriceRange,
      priceEnd: maxPriceRange
    });
  };

  const handleRemoveSeller = (index: any) => {
    setSelectedSellers(prevSellers =>
      prevSellers.filter((_, i) => i !== index),
    );
  };

  return (
    <MainLayout
      headerComp={
        <SecondaryHeader
          backBtnContainerStyle={{ left: 0 }}
          onBack={navigation.goBack}
          title="Filters"
        />
      }
    >
      <View style={{ marginTop: 30 }}>
        <InputWrapper title="Product Category">
          <FlatList
            numColumns={3}
            contentContainerStyle={{
              columnGap: 10,
              rowGap: 10,
            }}
            scrollEnabled={false}
            ListFooterComponent={() => {
              return loading ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}
                >
                  <ActivityIndicator size={'small'} color={COLORS.greenDark} />
                </View>
              ) : null;
            }}
            data={categories}
            renderItem={({ item }) => {
              const isActive = item._id === selectedCategoryId;
              return (
                <Chip
                  text={item.name}
                  onPress={() => setSelectedCategoryId(item._id)}
                  isActive={isActive}
                />
              );
            }}
          />
        </InputWrapper>

        <InputWrapper title="Select Vendor">
          <SelectInput
            placeholder="Select from here"
            onPress={() => {
              SheetManager.show(SHEETS.SellerSelectSheet, {
                // @ts-ignore
                payload: {
                  onSelect: (data: Sellers) => {
                    setSelectedSellers(value => [...value, data]);
                  },
                },
              });
            }}
          />
        </InputWrapper>

        <View style={{ marginTop: 30 }}>
          {selectedSellers.length === 0 ? (
            <MyText color={COLORS.lightgrey} size={FONT_SIZE.sm} center>
              No sellers selected
            </MyText>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                columnGap: 10,
                rowGap: 10,
              }}
            >
              {selectedSellers.map((item: any, index) => (
                <GradientBox
                  key={index}
                  conatinerStyle={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    alignSelf: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <MyText color={COLORS.white} size={FONT_SIZE.sm}>
                    {item?.fullname}
                  </MyText>
                  <TouchableOpacity onPress={() => handleRemoveSeller(index)}>
                    <AntDesign
                      name="close"
                      size={FONT_SIZE.base}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                </GradientBox>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={{ marginVertical: 15 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}
        >
          <MyText bold={FONT_WEIGHT.bold}>Price Range</MyText>
          <MyText color={COLORS.greenDark}>
            ${minPriceRange}-${maxPriceRange}
          </MyText>
        </View>
        <RangeSlider
          min={minPriceRange}
          max={maxPriceRange}
          onValueChange={(min: number, max: number) => {
            setMaxPriceRange(max);
            setMinPriceRange(min);
          }}
        />
      </View>
      <PrimaryBtn
        onPress={handleApplyFilter}
        conatinerStyle={{ marginVertical: 20 }}
        text="Apply Filter"
      />
    </MainLayout>
  );
};

export default SearchFilterScreen;
