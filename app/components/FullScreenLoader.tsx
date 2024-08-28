import {View, ActivityIndicator, Modal} from 'react-native';
import React from 'react';
import {COLORS} from '../styles';
import FastImage from 'react-native-fast-image';
const FullScreenLoader = () => {
  return (
    <Modal visible transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(1,1,1,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 200,
            width: 200,
            backgroundColor: COLORS.white,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <ActivityIndicator
            color={COLORS.greenDark}
            size={'large'}
            style={{transform: [{scale: 1}]}}
          /> */}
          <FastImage
            style={{width: 200, height: 200}}
            source={require('../../assets/loader.gif')}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </View>
    </Modal>
  );
};

export default FullScreenLoader;
