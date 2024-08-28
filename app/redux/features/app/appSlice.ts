import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {AppMode} from '../../../types';
import {AvatarDefaultType, DefaultAvatar} from '../../../utils/defaultAvatar';

type StateType = {
  mode: AppMode;
  firstLaunched: boolean;
  defaultAvatar: AvatarDefaultType;
};

const initialState: StateType = {
  mode: 'USER',
  firstLaunched: false,
  defaultAvatar: DefaultAvatar.getList()[1],
};
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeAppMode: (state, action: PayloadAction<AppMode>) => {
      state.mode = action.payload;
    },
    setFirstLaunched: (state, action: PayloadAction<boolean>) => {
      state.firstLaunched = action.payload;
    },
    updateDefaultAvatar: (state, action: PayloadAction<AvatarDefaultType>) => {
      state.defaultAvatar = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {changeAppMode, setFirstLaunched, updateDefaultAvatar} =
  appSlice.actions;

export default appSlice.reducer;
