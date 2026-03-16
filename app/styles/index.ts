import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dimensions} from 'react-native';
import {fontPixel, widthPixel} from '../utils/sizeNormalization';

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
  xs: fontPixel(10),
  sm: fontPixel(12),
  sml: fontPixel(13),
  base: fontPixel(14),
  lg: fontPixel(16),
  xl: fontPixel(18),
  '1.5xl': fontPixel(20),
  '2xl': fontPixel(24),
  '3xl': fontPixel(30),
  '4xl': fontPixel(36),
  '5xl': fontPixel(40),
  '6xl': fontPixel(44),
};

export const BORDER_RADIUS = {
  XSmall: widthPixel(4),
  Small: widthPixel(8),
  XMedium: widthPixel(12),
  Medium: widthPixel(16),
  'Semi-Large': widthPixel(20),
  Large: widthPixel(24),
  ExtraLarge: widthPixel(32),
  Circle: widthPixel(50),
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
