import {Dimensions, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const widthBaseScale = SCREEN_WIDTH / 375;
const heightBaseScale = SCREEN_HEIGHT / 812;

function normalize(size: number, based = 'width') {
  const newSize =
    based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

//for width  pixel
const widthPixel = (size: number) => {
  return normalize(size, 'width');
};

//for height  pixel
const heightPixel = (size: number) => {
  return normalize(size, 'height');
};

//for font  pixel
const fontPixel = (size: number) => {
  return heightPixel(size);
};

//for Margin and Padding vertical pixel
const pixelSizeVertical = (size: number) => {
  return heightPixel(size);
};

//for Margin and Padding horizontal pixel
const pixelSizeHorizontal = (size: number) => {
  return widthPixel(size);
};

export {
  widthPixel, //for width  pixel
  heightPixel, //for height  pixel
  fontPixel, //for font  pixel
  pixelSizeVertical, //for Margin and Padding vertical pixel
  pixelSizeHorizontal, //for Margin and Padding horizontal pixel
};
