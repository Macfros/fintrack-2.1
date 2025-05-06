  "use client";

  import { configureStore } from '@reduxjs/toolkit';
  import billReducer from './slices/bill'; // Import updated reducer
  import { billApi } from './api/bill.api';
import { statsApi } from './api/stats.api';

  export const store = configureStore({
    reducer: {
      bills: billReducer, 
      [billApi.reducerPath]: billApi.reducer,
      [statsApi.reducerPath]: statsApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
      .concat(billApi.middleware)
      .concat(statsApi.middleware)
  });

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
