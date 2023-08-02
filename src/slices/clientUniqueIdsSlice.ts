import {  createSlice, PayloadAction } from '@reduxjs/toolkit'

import {CLIENTUNIQUEID } from '@/types/clientUniqueId'

const BUG = false

export interface CLIENTUNIQUEID_ {
  clientUniqueIds:CLIENTUNIQUEID[]
}

const initialState: CLIENTUNIQUEID_ = {
  clientUniqueIds: [],
}
export const clientUniqueIdsSlice = createSlice({
  name: "clientUniqueIds",
  initialState,
  reducers: {
    resetClientUniqueIds: (state) => {
      state.clientUniqueIds = initialState.clientUniqueIds
    },
    setClientUniqueIds: (state, action: PayloadAction<CLIENTUNIQUEID[]>) => {
      state.clientUniqueIds = action.payload
    },
  },
})
export const { resetClientUniqueIds, setClientUniqueIds } = clientUniqueIdsSlice.actions

export default clientUniqueIdsSlice.reducer
