import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface WebsocketState {
  isConnected: boolean;
}

const initialState: WebsocketState = {
  isConnected: false,
};

export const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnected: (state) => {
      state.isConnected = true;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
    },
  },
});

export const { setConnected, setDisconnected } = websocketSlice.actions;

export const selectIsConnected = (state: RootState) =>
  state.websocket.isConnected;

export default websocketSlice.reducer;
