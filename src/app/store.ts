import { configureStore } from '@reduxjs/toolkit';
import roleReducer from '../store/slices/roleSlice';
import authReducer from '../store/slices/authSlice';

const savedToken = localStorage.getItem('token');
const savedRole = localStorage.getItem('role');

export const store = configureStore({
  reducer: {
    role: roleReducer,
    auth: authReducer
  },
  devTools: {
    trace: false, // отключаем trace, чтобы не ломался Redux DevTools
  },
  preloadedState: {
    role: {
      role: savedRole as 'farmer' | 'client' | null,
    },
    auth: {
      token: savedToken,
    },
  },
});

console.log('Loaded token from localStorage:', savedToken);
console.log('Loaded role from localStorage:', savedRole);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
