import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {removeUserFromLocal, saveUserToLocal} from './helper';
import {AuthUserType} from '../../../types';

interface AuthStateType {
  token: string | null;
  isAuthenticated: boolean;
  user: AuthUserType | null;
}

const initialState: AuthStateType = {
  token: null,
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUserType>) => {
      const user = action.payload;
      const token = user.token;
      state.user = user;
      state.token = token;
    },
    updateUser: (state, action: PayloadAction<AuthUserType>) => {
      const updatedUser = {...state.user, ...action.payload};
      state.user = updatedUser;
      saveUserToLocal(updatedUser);
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      const user = state.user;
      if (user !== null) {
        saveUserToLocal(user);
      }
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeUserFromLocal();
    },
  },
});

export const {login, logout, setIsAuthenticated, updateUser} =
  authSlice.actions;

export default authSlice.reducer;
