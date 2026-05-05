import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Friend} from '../../../types';

interface FriendStateType {
  suggested: Friend[];
  myFriends: Friend[];
  blocked: Friend[];
  requested: Friend[];
  sentRequests: Friend[];
}

const initialState: FriendStateType = {
  suggested: [],
  myFriends: [],
  blocked: [],
  requested: [],
  sentRequests: [],
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
    sentRequestsList: (state, action: PayloadAction<Friend[]>) => {
      state.sentRequests = action.payload;
    },
  },
});

export const {suggestedList, myFriendsList, blockedList, requestsList, sentRequestsList} =
  friendSlice.actions;

export default friendSlice.reducer;
