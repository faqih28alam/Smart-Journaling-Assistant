// authSlice.ts 
// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  bio?: string;
  photo_profile?: string | null;
  followers?: number;
  following?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateUser: (state, action: PayloadAction<User>) => {
      if(!state.user) return;
      state.user = {...state.user, ...action.payload};
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

export const { setLogin, setLogout, updateUser } = authSlice.actions;
export default authSlice.reducer;