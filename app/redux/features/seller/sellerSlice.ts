import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Sellers} from '../../../types';

interface AuthStateType {
  sellers: Sellers[];
}

const initialState: AuthStateType = {
  sellers: [],
};

export const sellerSlice = createSlice({
  name: 'sellers',
  initialState,
  reducers: {
    setSellers: (state, action: PayloadAction<Sellers[]>) => {
      console.log(action);
      state.sellers = action.payload;
    },
  },
});

export const {setSellers} = sellerSlice.actions;

export default sellerSlice.reducer;
