import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

export const connect = createAsyncThunk('web3/connect', async () => {
  let connected = false
  let provider
  let account

  if (!window.ethereum) return { connected, account, provider }

  try {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    provider = new ethers.providers.Web3Provider(connection)
    connected = true
    account = await provider.getSigner().getAddress()
    window.localStorage.setItem('hasConnected', 'true')
    window.localStorage.setItem('type', 'wallet')
  } catch {}

  return { connected, account, provider }
})

const web3Slice = createSlice({
  name: 'web3',
  initialState: {
    address: null,
    connected: false,
    chainId: 0,
    provider: null,
  },

  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setConnected: (state, action) => {
      state.connected = action.payload
    },
    setProvider: (state, action) => {
      state.provider = action.payload
    },
    setChainId: (state, action) => {
      state.chainId = action.payload
    },
    setConnection: (state, action) => {
      state.address = action.payload.address
      state.connected = action.payload.connected
      window.localStorage.setItem('hasConnected', action.payload.connected)
      window.localStorage.setItem('address', action.payload.address)
    },
  },

  extraReducers: {
    [connect.fulfilled]: (state, action) => {
      state.address = action.payload.account
      state.connected = action.payload.connected
      state.provider = action.payload.provider
      console.log(action.payload.provider)
    },
  },
})

export const { setAddress, setConnected, setChainId, setConnection } =
  web3Slice.actions
export default web3Slice.reducer
