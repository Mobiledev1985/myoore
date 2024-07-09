import {I18nManager, Platform} from 'react-native';

const OOREDOO_HEAVY_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Bold'
  : 'Rubik-Bold';

const OUTFIT_Black_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Bold'
  : 'Outfit-Black';

const OUTFIT_Bold_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Bold'
  : 'Outfit-Bold';

const OUTFIT_ExtraBold_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Bold'
  : 'Outfit-ExtraBold';

const RUBIK_SEMIBOLD_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Bold'
  : 'Rubik-SemiBold';
const RUBIC_LIGHT_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Regular'
  : 'Rubik-Light';

const RUBIK_LIGHT_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Regular'
  : 'Rubik-Light';

const RUBIK_MEDIUM_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Regular'
  : 'Rubik-Medium';

const RUBIK_REGULAR_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Regular'
  : 'Rubik-Regular';

const RUBIK_BOLD_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Bold'
  : 'Rubik-Bold';
// Confirmation

const OOREDOO_HEAVY_FONT_STANDARD = 'NotoKufiArabic-Bold';
const NOTOSANS_BOLD_FONT_ENGLISH = 'NotoSansUI-Bold';

const OOREDOO_REGULAR_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Regular'
  : 'Rubik-Regular';

const OOREDOO_MEDIUM_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Regular'
  : 'Rubik-Medium';

const NOTOSANS_REGULAR_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Regular'
  : Platform.OS === 'ios'
  ? 'NotoSansUI'
  : 'NotoSansUI-Regular';

const NOTOSANS_STANDARD_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Regular'
  : Platform.OS === 'ios'
  ? 'NotoSansUI'
  : 'NotoSansUI-Regular';

const NOTOSANS_LIGHT_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Regular'
  : 'NotoSans-Light';

const NOTOSANS_BOLD_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Bold'
  : 'NotoSansUI-Bold';

const NOTOSANS_SEMIBOLD_FONT = I18nManager.isRTL
  ? 'NotoKufiArabic-Bold'
  : 'NotoSans-SemiBold';

const OOREDOO_HEAVY_REVERSE_FONT = I18nManager.isRTL
  ? 'Rubik-Bold'
  : 'NotoKufiArabic-Bold';

const NOTOSANS_REGULAR_REVERSE_FONT = I18nManager.isRTL
  ? Platform.OS === 'ios'
    ? 'NotoSansUI'
    : 'NotoSansUI-Regular'
  : 'NotoKufiArabic-Regular';

const GOOGLEPAY_FONT = I18nManager.isRTL
  ? 'GoogleSans-Regular'
  : 'GoogleSans-Regular';

export {
  OOREDOO_HEAVY_FONT,
  NOTOSANS_REGULAR_FONT,
  NOTOSANS_BOLD_FONT,
  OOREDOO_REGULAR_FONT,
  NOTOSANS_STANDARD_FONT,
  OOREDOO_HEAVY_FONT_STANDARD,
  OOREDOO_HEAVY_REVERSE_FONT,
  NOTOSANS_REGULAR_REVERSE_FONT,
  OOREDOO_MEDIUM_FONT,
  GOOGLEPAY_FONT,
  RUBIK_SEMIBOLD_FONT,
  OUTFIT_Black_FONT,
  NOTOSANS_LIGHT_FONT,
  OUTFIT_Bold_FONT,
  RUBIC_LIGHT_FONT,
  NOTOSANS_SEMIBOLD_FONT,
  OUTFIT_ExtraBold_FONT,
  NOTOSANS_BOLD_FONT_ENGLISH,
  RUBIK_LIGHT_FONT,
  RUBIK_MEDIUM_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_BOLD_FONT,
};
