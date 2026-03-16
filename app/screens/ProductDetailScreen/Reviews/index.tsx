import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import {useNavigation} from '@react-navigation/native';
import {useHideBottomBar} from '../../../hook/useHideBottomBar';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import Review from '../../../components/Reviews';
import {MyText} from '../../../components/MyText';
import {FONT_SIZE} from '../../../styles';
import {COLORS} from '../../../styles';

const ReviewsScreen = () => {
  useHideBottomBar({});
  const navigation = useNavigation();
  const {reviews} = useSelector((s: RootState) => s.product);

  if (!reviews.length) {
    return (
      <View style={{paddingHorizontal: 20}}>
        <SafeAreaView />
        <SecondaryHeader
          backBtnContainerStyle={{left: 0}}
          onBack={navigation.goBack}
          title="All Reviews"
        />
        <MyText
          size={FONT_SIZE.lg}
          color={COLORS.grey}
          center
          style={{marginTop: 20}}>
          No reviews found
        </MyText>
      </View>
    );
  }
  return (
    <FlatList
      ListHeaderComponent={() => {
        return (
          <View>
            <SafeAreaView />
            <SecondaryHeader
              backBtnContainerStyle={{left: 0}}
              onBack={navigation.goBack}
              title="All Reviews"
            />
          </View>
        );
      }}
      contentContainerStyle={{marginHorizontal: 20}}
      ItemSeparatorComponent={() => <View style={{height: 40}} />}
      data={reviews}
      renderItem={({item}) => {
        return (
          <Review
            id={item?._id}
            user={item?.user}
            updateAt={item.updateAt}
            review={String(item?.review)}
            value={item?.rating}
          />
        );
      }}
    />
  );
};

export default ReviewsScreen;
