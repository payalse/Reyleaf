import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {MyText} from '../../components/MyText';
import {BORDER_RADIUS, COLORS} from '../../styles';
import {api_getCategories} from '../../api/category';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {
  setCategories,
  updateHomeActiveCategory,
} from '../../redux/features/category/categorySlice';
import {GetCategoriesResponse} from '../../types/apiResponse';
import { pixelSizeHorizontal, pixelSizeVertical } from '../../utils/sizeNormalization';

const OptionsList = () => {
  const [loading, setLoading] = useState(false);
  const {categories, homeActiveCategory} = useSelector(
    (s: RootState) => s.category,
  );
  const dispatch = useDispatch<AppDispatch>();
  const requestApi = async () => {
    try {
      setLoading(true);
      const res = (await api_getCategories()) as GetCategoriesResponse;
      // console.log(res);
      dispatch(setCategories(res.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestApi();
  }, []);

  return (
    <FlatList
      horizontal
      data={categories}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{marginBottom: pixelSizeVertical(20)}}
      ListFooterComponent={() => {
        return loading ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <ActivityIndicator size={'small'} color={COLORS.greenDark} />
          </View>
        ) : null;
      }}
      renderItem={({item}) => {
        const isActive = homeActiveCategory._id === item._id;
        return (
          <TouchableOpacity
            onPress={() => {
              if (isActive) {
                dispatch(updateHomeActiveCategory(null));
              } else {
                dispatch(updateHomeActiveCategory(item));
              }
            }}
            style={{
              marginRight: pixelSizeHorizontal(10),
              borderRadius: BORDER_RADIUS.Circle,
              backgroundColor: isActive ? COLORS.darkBrown : COLORS.lightgrey2,
            }}>
            <MyText
              color={isActive ? COLORS.white : COLORS.lightgrey}
              style={{
                paddingHorizontal: pixelSizeHorizontal(16),
                paddingVertical: pixelSizeVertical(8),
              }}>
              {item.name}
            </MyText>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default OptionsList;

const styles = StyleSheet.create({});
