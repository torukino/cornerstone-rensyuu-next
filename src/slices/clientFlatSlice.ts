import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CLIENTFLAT } from '@/types/clients/clientFlat';

const BUG = false;

export interface CLIENFLAT_ {
  clientFlat: CLIENTFLAT[];
}

const initialState: CLIENFLAT_ = {
  clientFlat: [],
};
export const clientFlatSlice = createSlice({
  name: 'clientFlat',
  initialState,
  reducers: {
    resetClientFlat: (state) => {
      state.clientFlat = initialState.clientFlat;
    },
    setClientFlat: (state, action: PayloadAction<CLIENTFLAT[]>) => {
      state.clientFlat = action.payload;
    },
  },
});
export const { resetClientFlat, setClientFlat } = clientFlatSlice.actions;

export default clientFlatSlice.reducer;
