import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, hp, wp} from '../../../styles';
import DummyProductImage from '../../../../assets/img/productPlaceholder.jpeg';

const data = [
  'https://cdn.dummyjson.com/product-images/6/1.png',
  'https://cdn.dummyjson.com/product-images/6/2.jpg',
  'https://cdn.dummyjson.com/product-images/6/3.png',
  'https://cdn.dummyjson.com/product-images/6/4.jpg',
];

const ProductShow = ({images}: {images: string[]}) => {
  const [activeImage, setActiveImage] = useState<null | string>(null);

  useEffect(() => {
    if (images.length) {
      setActiveImage(images[0]);
    }
  }, [images]);
  return (
    <View
      style={{
        height: hp(55),
        marginTop: 20,
      }}>
      <View
        style={{
          width: wp(80),
          height: hp(40),
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={activeImage !== null ? {uri: activeImage} : DummyProductImage}
          style={{width: '100%', height: '100%', resizeMode: 'contain'}}
        />
      </View>
      {images.length ? (
        <FlatList
          contentContainerStyle={{
            gap: wp(3),
            alignItems: 'center',
            paddingHorizontal: wp(10),
          }}
          data={images}
          renderItem={({item}) => {
            const isActive = item === activeImage;
            return (
              <Pressable
                onPress={() => setActiveImage(item)}
                style={{
                  opacity: isActive ? 1 : 0.5,
                  width: wp(20),
                  height: wp(20),
                  backgroundColor: COLORS.white,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: item}}
                  style={{width: '100%', height: '100%', resizeMode: 'contain'}}
                />
              </Pressable>
            );
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      ) : null}
    </View>
  );
};

export default ProductShow;

const styles = StyleSheet.create({});
