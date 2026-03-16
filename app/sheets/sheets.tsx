import {registerSheet} from 'react-native-actions-sheet';
import CountrySelectSheet from './CountrySelectSheet';
import CategorySelectSheet from './CategorySelectSheet';
import PronounSelectSheet from './PronounSelectSheet';
import SellerSelectSheet from './SellerSelectSheet';
import SubjectSelectSheet from './SubjectSelectSheet';
import ShippingMethodSelectSheet from './ShippingMethodSelectSheet';
import TaxTypeSelectSheet from './TaxTypeSelectSheet';

export const SHEETS = {
  CountrySelectSheet: 'CountrySelectSheet',
  CategorySelectSheet: 'CategorySelectSheet',
  PronounSelectSheet: 'PronounSelectSheet',
  SellerSelectSheet: 'SellerSelectSheet',
  SubjectSelectSheet: 'SubjectSelectSheet',
  ShippingMethodSelectSheet: 'ShippingMethodSelectSheet',
  TaxTypeSelectSheet: 'TaxTypeSelectSheet',
};

registerSheet(SHEETS.CountrySelectSheet, CountrySelectSheet);
registerSheet(SHEETS.CategorySelectSheet, CategorySelectSheet);
registerSheet(SHEETS.PronounSelectSheet, PronounSelectSheet);
registerSheet(SHEETS.SellerSelectSheet, SellerSelectSheet);
registerSheet(SHEETS.SubjectSelectSheet, SubjectSelectSheet);
registerSheet(SHEETS.ShippingMethodSelectSheet, ShippingMethodSelectSheet);
registerSheet(SHEETS.TaxTypeSelectSheet, TaxTypeSelectSheet);
