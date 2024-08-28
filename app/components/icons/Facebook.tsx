import {Image} from 'react-native';
import React from 'react';
const Facebook = () => {
  return (
    <Image
      source={require('../../../assets/img/icons/facebook-logo.png')}
      style={{width: 25, height: 25, resizeMode: 'contain'}}
    />
  );
};

export default Facebook;
