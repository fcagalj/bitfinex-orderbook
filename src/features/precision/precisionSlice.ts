import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface PrecisionState {
  precision: number;
}

const initialState: PrecisionState = {
  precision: 2, // Initialize precision with a default value, can be changed as per your requirement
};

export const precisionSlice = createSlice({
  name: 'precision',
  initialState,
  reducers: {
    setPrecision: (state, action: PayloadAction<number>) => {
      state.precision = action.payload;
    },
  },
});

export const { setPrecision } = precisionSlice.actions;

export const selectPrecision = (state: RootState) => state.precision.precision;

export default precisionSlice.reducer;
