import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {SupportTickets, SupportTicketChat} from '../../../types';

interface SupportStateType {
  supportTicket: SupportTickets[];
  supportTicketChatList: SupportTicketChat[];
}

const initialState: SupportStateType = {
  supportTicket: [],
  supportTicketChatList: [],
};

export const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setSupportTicket: (state, action: PayloadAction<SupportTickets[]>) => {
      state.supportTicket = action.payload;
    },
    setSupportTicketChat: (
      state,
      action: PayloadAction<SupportTicketChat[]>,
    ) => {
      state.supportTicketChatList = action.payload;
    },
  },
});

export const {setSupportTicket, setSupportTicketChat} = supportSlice.actions;

export default supportSlice.reducer;
