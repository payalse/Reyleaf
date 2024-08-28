import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ProductType, Reviews } from '../../../types';

interface StateType {
  trendingProducts: ProductType[];
  newlyProducts: ProductType[];
  bestSellingProducts: ProductType[];
  recentlyViewedProducts: ProductType[];
  favouriteProducts: ProductType[];
  similarProducts: ProductType[];
  reviews: Reviews[];
}

const initialState: StateType = {
  trendingProducts: [],
  newlyProducts: [],
  bestSellingProducts: [],
  recentlyViewedProducts: [],
  favouriteProducts: [],
  similarProducts: [],
  reviews: [],
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setTrendingProduct: (state, action: PayloadAction<ProductType[]>) => {
      state.trendingProducts = action.payload;
    },
    setNewlyProduct: (state, action: PayloadAction<ProductType[]>) => {
      state.newlyProducts = action.payload;
    },
    setBestSellingProduct: (state, action: PayloadAction<ProductType[]>) => {
      state.bestSellingProducts = action.payload;
    },
    setRecentlyViewedProduct: (state, action: PayloadAction<ProductType[]>) => {
      state.recentlyViewedProducts = action.payload;
    },
    setSimilarProduct: (state, action: PayloadAction<ProductType[]>) => {
      state.similarProducts = action.payload;
    },
    setProductReview: (state, action: PayloadAction<Reviews[]>) => {
      state.reviews = action.payload;
    },
    setFavouriteProduct: (state, action: PayloadAction<ProductType[]>) => {
      state.favouriteProducts = action.payload;
    },
  },
});

export const {
  setBestSellingProduct,
  setNewlyProduct,
  setTrendingProduct,
  setRecentlyViewedProduct,
  setFavouriteProduct,
  setSimilarProduct,
  setProductReview
} = productSlice.actions;

export default productSlice.reducer;
