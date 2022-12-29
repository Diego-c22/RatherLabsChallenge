import { configureStore } from '@reduxjs/toolkit'
import web3Slice from './redux/web3Slice'

export default configureStore({
  reducer: {
    web3: web3Slice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: {
        warnAfter: 128,
        ignoredActions: ['web3/connect/fulfilled'],
        ignoredActionPaths: ['web3.provider'],
        ignoredPaths: ['web3.provider'],
      },
    }),
})
