import {registerSheet} from 'react-native-actions-sheet';
import CountrySelectSheet from './CountrySelectSheet';
import CategorySelectSheet from './CategorySelectSheet';
import PronounSelectSheet from './PronounSelectSheet';
import SellerSelectSheet from './SellerSelectSheet';
import SubjectSelectSheet from './SubjectSelectSheet';

export const SHEETS = {
  CountrySelectSheet: 'CountrySelectSheet',
  CategorySelectSheet: 'CategorySelectSheet',
  PronounSelectSheet: 'PronounSelectSheet',
  SellerSelectSheet: 'SellerSelectSheet',
  SubjectSelectSheet: 'SubjectSelectSheet',
};

registerSheet(SHEETS.CountrySelectSheet, CountrySelectSheet);
registerSheet(SHEETS.CategorySelectSheet, CategorySelectSheet);
registerSheet(SHEETS.PronounSelectSheet, PronounSelectSheet);
registerSheet(SHEETS.SellerSelectSheet, SellerSelectSheet);
registerSheet(SHEETS.SubjectSelectSheet, SubjectSelectSheet);
