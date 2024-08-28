import {
  View,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import React from 'react';

import BG_Leaf from '../../../assets/img/bg/bg-leaf.png';
import BG_TL from '../../../assets/img/bg/bg-tl.png';
import BG_TR_BL from '../../../assets/img/bg/bg-tr-bl.png';
import BG_TR from '../../../assets/img/bg/bg-tr.png';
import {hp, wp} from '../../styles';

type Props = {
  children: React.ReactNode;
  hideSafeArea?: boolean;
  type?: 'bg-leaf' | 'bg-tl' | 'bg-tr-bl' | 'bg-tr';
};

const isAndroid = Platform.OS === 'android';

const LayoutBG = ({children, type, hideSafeArea}: Props) => {
  let source = BG_TR;

  if (type === 'bg-tl') {
    source = BG_TL;
  } else if (type === 'bg-leaf') {
    source = BG_Leaf;
  } else if (type === 'bg-tr-bl') {
    source = BG_TR_BL;
  }

  return (
    <View style={{flex: 1, paddingTop: hideSafeArea ? 0 : 15}}>
      {hideSafeArea || <SafeAreaView />}

      <Image
        source={source}
        style={{
          resizeMode: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: -1000,
          height: hp(isAndroid ? 110 : 100),
          width: wp(100),
        }}
      />
      {children}
    </View>
  );
};

export default LayoutBG;
