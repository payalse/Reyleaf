import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState = {
  activeEventDate: '',
};

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setActiveEventDate: (state, action: PayloadAction<string>) => {
      state.activeEventDate = action.payload;
    },
  },
});

export const {setActiveEventDate} = eventSlice.actions;

export default eventSlice.reducer;
