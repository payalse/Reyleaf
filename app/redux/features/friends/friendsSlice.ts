import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Friend} from '../../../types';

interface FriendStateType {
  suggested: Friend[];
  myFriends: Friend[];
  blocked: Friend[];
  requested: Friend[];
}

const initialState: FriendStateType = {
  suggested: [],
  myFriends: [],
  blocked: [],
  requested: [],
};

export const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    suggestedList: (state, action: PayloadAction<Friend[]>) => {
      state.suggested = action.payload;
    },
    myFriendsList: (state, action: PayloadAction<Friend[]>) => {
      state.myFriends = action.payload;
    },
    blockedList: (state, action: PayloadAction<Friend[]>) => {
      state.blocked = action.payload;
    },
    requestsList: (state, action: PayloadAction<Friend[]>) => {
      state.requested = action.payload;
    },
  },
});

export const {suggestedList, myFriendsList, blockedList, requestsList} =
  friendSlice.actions;

export default friendSlice.reducer;
