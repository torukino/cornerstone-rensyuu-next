import { configureStore } from '@reduxjs/toolkit'

import clientFlatReducer from '../slices/clientFlatSlice'
import clientUniqueIdsReducer from '../slices/clientUniqueIdsSlice'

export const store = configureStore({
  reducer: {
    clientFlat_: clientFlatReducer,
    clientUniqueIds_: clientUniqueIdsReducer,
     },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
