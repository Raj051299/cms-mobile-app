import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

const isTablet = DeviceInfo.isTablet();

// Common scaling logic
const responsiveFontSize = (size: number) => {
  return isTablet ? size * 1.3 : size;
};

export {
  isTablet,
  width,
  height,
  wp,
  hp,
  responsiveFontSize
};
