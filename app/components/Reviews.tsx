import {
  ActivityIndicator,
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {COLORS, FONT_SIZE} from '../styles';
import {BUILD_IMAGE_URL} from '../api';
import {MyText} from './MyText';
import moment from 'moment';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import {Rating} from 'react-native-ratings';

type Props = {
  id: string;
  user: any;
  updateAt: string;
  review: string;
  value: any;
};

const Review = ({id, user, updateAt, review, value}: Props) => {
  return (
    <View
      key={id}
      style={{
        // marginBottom:-0,
        marginTop: 20,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: COLORS.lightgrey2,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 5,
        }}>
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: COLORS.grey,
            borderRadius: 25,
          }}>
          {user?.picture && (
            <Image
              source={{
                uri: BUILD_IMAGE_URL(user?.picture),
              }}
              style={StyleSheet.absoluteFillObject}
            />
          )}
        </View>
        <View>
          <MyText>{user?.fullname}</MyText>
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
              marginTop: 5,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Rating
                type="star"
                ratingCount={5}
                imageSize={15}
                readonly
                startingValue={value}
              />
            </View>
            <MyText size={FONT_SIZE.xs} color={COLORS.grey}>
              {moment(updateAt).format('MM/DD/YYYY')}
            </MyText>
          </View>
        </View>
      </View>
      <MyText color={COLORS.grey} size={FONT_SIZE.sm}>
        {review}
      </MyText>
    </View>
  );
};

export default Review;
