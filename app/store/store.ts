"use client";

import { configureStore } from '@reduxjs/toolkit';
import billReducer from './slices/bill'; // Import updated reducer

export const store = configureStore({
  reducer: {
    bills: billReducer, // Use updated reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
