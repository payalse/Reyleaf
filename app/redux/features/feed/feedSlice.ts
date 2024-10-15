import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {FeedType} from '../../../types';

interface FeedStateType {
  feed: FeedType[];
}

const initialState: FeedStateType = {
  feed: [],
};

export const authSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    addFeed: (state, action: PayloadAction<FeedType[]>) => {
      state.feed = action.payload;
    },
  },
});

export const {addFeed} = authSlice.actions;

export default authSlice.reducer;
