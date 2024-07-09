import {PixelRatio, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// based on mockup dimension
const widthBaseScale = SCREEN_WIDTH / 375;
const heightBaseScale = SCREEN_HEIGHT / 812;


export const isTablet = DeviceInfo.isTablet()
  ? DeviceInfo.isTablet()
  : SCREEN_WIDTH > 540
  ? true
  : false;

export const isSmallHeight = () => {
  if (SCREEN_HEIGHT < 680) {
    return true;
  } else {
    return false;
  }
};
export const isSmallHandset = () => {
  if (SCREEN_WIDTH < 340) {
    return true;
  } else {
    return false;
  }
};

function normalize(size, based = 'width') {
  const newSize =
    based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const widthPixel = size => {
  let size1 = size - (size * 20) / 100;
  if (isTablet) {
    return normalize(size1, 'width');
  } else {
    return normalize(size, 'width');
  }
};

const windowWidthPixel = () => {
  let size1 = SCREEN_WIDTH - (SCREEN_WIDTH * 20) / 100;
  if (isTablet) {
    return size1;
  } else {
    return SCREEN_WIDTH;
  }
};
const tabletMargin = () => {
  let size1 = (SCREEN_WIDTH * 10) / 100;

  if (isTablet) {
    return size1;
  } else {
    return 0;
  }
};


//for height  pixel
const heightPixel = size => {
  if (SCREEN_HEIGHT < 680) {
    return Math.round(PixelRatio.roundToNearestPixel(size));
  } else {
    return normalize(size, 'height');
  }
};
//for font  pixel
const fontPixel = size => {
 

  if (SCREEN_HEIGHT < 680) {
    return Math.round(PixelRatio.roundToNearestPixel(size));
  } else {
    return heightPixel(size);
  }
};
//for Margin and Padding vertical pixel
const pixelSizeVertical = size => {
  return heightPixel(size);
};
//for Margin and Padding horizontal pixel
const pixelSizeHorizontal = size => {
  return widthPixel(size);
};

const getConst30Height = () => {
  const height = (SCREEN_HEIGHT * 30) / 100;
  return height;
};

export {
  widthPixel,
  heightPixel,
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  windowWidthPixel,
  tabletMargin,
  getConst30Height,
};
