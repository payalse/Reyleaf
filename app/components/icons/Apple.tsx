import {Image} from 'react-native';
import React from 'react';
const Apple = () => {
  return (
    <Image
      source={require('../../../assets/img/icons/apple-logo.png')}
      style={{width: 20, height: 20, resizeMode: 'contain'}}
    />
  );
};

export default Apple;
