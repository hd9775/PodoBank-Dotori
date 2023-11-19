import { configureStore } from '@reduxjs/toolkit';
import accountSlice from './slices/accounts/account';
import userSlice from './slices/auth/user';
import bankTransferSlice from './slices/transfer/bankTransfer';

const store = configureStore({
  reducer: {
    // counter: counterSlice, 
    // whole: wholeSlice,
    account: accountSlice,
    user: userSlice,
    bankTransfer: bankTransferSlice,
  }
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
