import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/auth/user';
import planSlice from './slices/plan/plan';
import purposeSlice from './slices/purpose/purpose';
// import bankTransferSlice from './slices/transfer/bankTransfer';

const store = configureStore({
  reducer: {
      user: userSlice,
      plan: planSlice,
      purpose : purposeSlice,
      // account: accountSlice,
  }
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;