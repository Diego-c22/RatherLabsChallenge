import { ethers } from 'ethers'
import { useState } from 'react'
import Ether from './assets/icons/ether.png'
import './App.css'
import { calculateUniswapSLPAddress } from './utilities/address'
import Header from './components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { connect } from './redux/web3Slice'

const buttonStyle =
  'flex items-center text-xs font-extralight text-white absolute h-8 top-1/2 -mt-4 right-4 bg-gradient-to-tl p-2 rounded-lg from-sky-900/40 to-purple-800/40'

const App = () => {
  const provider = useSelector((state) => state.web3.provider)
  console.log('p', provider)
  const dispatch = useDispatch()
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [amount1, setAmount1] = useState(0)
  const [amount2, setAmount2] = useState(0)
  const [errors, setErrors] = useState({ address1: null, address2: null })
  const [address, setAddress] = useState('')
  const [pool, setPool] = useState('')

  const getAccount = async () => {
    setAddress('')
    setErrors({ address1: null, address2: null })
    if (address1.length < 42) {
      setErrors({ ...errors, address1: true })
      console.log(errors)
      return
    }
    if (address2.length < 42) {
      setErrors({ ...errors, address2: true })
      return
    }

    const addressPool = calculateUniswapSLPAddress(address1, address2)
    setPool(addressPool)
  }

  return (
    <div className="App bg-[#131a2a]">
      <Header />
      <div className="h-[95vh] w-screen flex justify-center items-center bg-[#131a2a]">
        <div className="flex flex-col bg-gradient-to-tl from-sky-900/40 to-purple-800/20 py-24 px-10 w-1/3 rounded-2xl gradient shadow-xl  shadow-black">
          {pool && (
            <div className="text-white/80 font-extralight mb-4">
              <p className="text-xs">Pool:</p>
              <h3 className="text-white/80 font-extralight">{pool}</h3>
            </div>
          )}
          <h2 className="text-white text-lg font-extralight">Token 1</h2>
          <div className="flex">
            <div className="p-2 w-3/4 relative">
              <input
                placeholder="address"
                value={address1}
                className={`p-3 rounded-lg bg-[#131a2a]/80 text-white font-light text-lg w-full outline-none ${
                  errors.address1 ? 'border border-red-900/80' : ''
                }`}
                onChange={(e) => setAddress1(e.target.value)}
              />
              {address1 == '' && (
                <button
                  onClick={() => setAddress1(ethers.constants.AddressZero)}
                  className={buttonStyle}
                >
                  <img src={Ether} className="h-5 w-5 mr-2" />
                  Use Ether
                </button>
              )}
            </div>
            <input
              type="number"
              className="m-2 p-3 rounded-lg bg-[#131a2a]/80 text-white font-light text-lg w-1/4 outline-none"
              placeholder="0.00"
            />
          </div>
          <h2 className="text-white text-lg font-extralight mt-2">Token 2</h2>
          <div className="flex">
            <div className="p-2 w-3/4 relative">
              <input
                placeholder="address"
                value={address2}
                className={`p-3 rounded-lg bg-[#131a2a]/80 text-white font-light text-lg w-full outline-none ${
                  errors.address2 ? 'border border-red-900/80' : ''
                }`}
                onChange={(e) => setAddress2(e.target.value)}
              />
              {address2 == '' && (
                <button
                  onClick={() => setAddress2(ethers.constants.AddressZero)}
                  className={buttonStyle}
                >
                  <img src={Ether} className="h-5 w-5 mr-2" />
                  Use Ether
                </button>
              )}
            </div>
            <input
              type="number"
              className="m-2 p-3 rounded-lg bg-[#131a2a]/80 text-white font-light text-lg w-1/4 outline-none"
              placeholder="0.00"
            />
          </div>

          <button
            onClick={() => (provider ? getAccount() : dispatch(connect()))}
            className="group relative h-10 overflow-hidden p-2 mt-8 rounded-lg -mb-5 bg-gradient-to-r from-sky-600/80 to-sky-900/40 shadow gradient-5"
          >
            <div className="absolute inset-0 w-0 bg-sky-600/80 transition-all duration-[250ms] ease-out group-hover:w-full right-0"></div>
            <span className="relative text-white group-hover:text-white">
              {!provider ? 'Connect Wallet' : 'Generate Address'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
