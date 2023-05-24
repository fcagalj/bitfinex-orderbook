import { configureStore } from '@reduxjs/toolkit';
import orderBookReducer from '../features/orderBook/orderBookSlice';
import websocketReducer from '../features/websocket/websocketSlice';

export const store = configureStore({
  reducer: {
    orderBook: orderBookReducer,
    websocket: websocketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
