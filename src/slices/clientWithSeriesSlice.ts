import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  CLIENTSERIES,
  initClientWithSeries,
} from '@/types/clients/clientWithSeries';

const BUG = false;

export interface CLIENTSERIES_ {
  clientWithSeries: CLIENTSERIES;
}

const initialState: CLIENTSERIES_ = {
  clientWithSeries: initClientWithSeries,
};
export const clientWithSeriesSlice = createSlice({
  name: 'clientWithSeries',
  initialState,
  reducers: {
    resetClientWithSeries: (state) => {
      state.clientWithSeries = initialState.clientWithSeries;
    },
    setClientWithSeries: (state, action: PayloadAction<CLIENTSERIES>) => {
      state.clientWithSeries = action.payload;
    },
  },
});
export const { resetClientWithSeries, setClientWithSeries } =
  clientWithSeriesSlice.actions;

export default clientWithSeriesSlice.reducer;
