// index.ts
// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';

export const store = configureStore({
  reducer: {
    auth : authReducer,
  },
  devTools: true,
});

// Types for your hooks (useful for TypeScript)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;