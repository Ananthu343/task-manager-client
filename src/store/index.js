import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    // API Reducer (RTK Query)
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Local State Reducers
    auth: authReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other useful features of rtk-query.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});