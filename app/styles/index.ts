import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dimensions} from 'react-native';

type FONT_WEIGHT_Type = {
  thin: '100';
  extralight: '200';
  light: '300';
  normal: '400';
  medium: '500';
  semibold: '600';
  bold: '700';
  extrabold: '800';
  black: '900';
};
export const FONT_WEIGHT: FONT_WEIGHT_Type = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// export const FONT_SIZE = {
//   xs: 12,
//   sm: 14,
//   base: 16,
//   lg: 18,
//   xl: 20,
//   '2xl': 24,
//   '3xl': 30,
//   '4xl': 36,
//   '5xl': 48,
//   '6xl': 60,
// };

export const FONT_SIZE = {
  xs: wp(2.5),
  sm: wp(3),
  sml: wp(3.3),
  base: wp(3.7),
  lg: wp(4.5),
  xl: wp(5),
  '1.5xl': wp(5.8),
  '2xl': wp(7),
  '3xl': wp(9),
  '4xl': wp(11),
  '5xl': wp(12.5),
  '6xl': wp(14),
};

export const COLORS = {
  black: '#222',
  white: '#fff',
  grey: 'grey',
  lightgrey: 'rgba(0,0,0,0.2)',
  lightgrey2: '#EBEBEB',
  greenDark: '#056145',
  greenLight: '#0f7c5d',
  transparent: 'transparent',
  transparentBlack: 'rgba(0,0,0,0.2)',
  darkBrown: '#362B24',
  red: 'rgba(234, 67, 53, 1)',
};

const {width, height} = Dimensions.get('screen');
export const D = {
  width,
  height,
};

export {wp, hp};
