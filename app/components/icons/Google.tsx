import {Image} from 'react-native';
import React from 'react';
const Google = () => {
  return (
    <Image
      source={require('../../../assets/img/icons/google-logo.png')}
      style={{width: 20, height: 20, resizeMode: 'contain'}}
    />
  );
};

export default Google;
