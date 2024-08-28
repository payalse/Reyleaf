import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {CategoryType} from '../../../types';

export const DEFAULT_ALL_CATEGORY = {
  _id: '0',
  name: 'All',
  updated_at: '',
};

interface AuthStateType {
  categories: CategoryType[];
  homeActiveCategory: CategoryType;
}

const initialState: AuthStateType = {
  categories: [DEFAULT_ALL_CATEGORY],
  homeActiveCategory: DEFAULT_ALL_CATEGORY,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<CategoryType[]>) => {
      state.categories = [DEFAULT_ALL_CATEGORY, ...action.payload];
    },
    updateHomeActiveCategory: (
      state,
      action: PayloadAction<CategoryType | null>,
    ) => {
      if (action.payload === null) {
        state.homeActiveCategory = DEFAULT_ALL_CATEGORY;
      } else {
        state.homeActiveCategory = action.payload;
      }
    },
  },
});

export const {setCategories, updateHomeActiveCategory} = categorySlice.actions;

export default categorySlice.reducer;
