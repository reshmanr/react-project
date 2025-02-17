import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authslice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});


export default store;
