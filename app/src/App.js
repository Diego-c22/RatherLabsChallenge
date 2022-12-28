import { ethers } from 'ethers'
import { useState } from 'react'
import Ether from './assets/icons/ether.png'

const buttonStyle =
  'flex items-center text-xs font-extralight text-white absolute h-8 top-1/2 -mt-4 right-4 bg-gradient-to-tl p-2 rounded-lg from-sky-900/50 to-purple-800/50'

const App = () => {
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [amount1, setAmount1] = useState(0)
  const [amount2, setAmount2] = useState(0)
  return (
    <div className="App">
      <div className="h-screen w-screen flex justify-center items-center bg-[#131a2a]">
        <div className="flex flex-col bg-gradient-to-tl from-sky-900/10 to-purple-800/10 py-24 px-10 w-1/3 rounded-2xl">
          <h2 className="text-white text-lg font-extralight">Token 1</h2>
          <div className="flex">
            <div className="p-2 w-3/4 relative">
              <input
                placeholder="address"
                value={address1}
                className="p-3 rounded-lg bg-[#131a2a] text-white font-light text-lg w-full outline-none"
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
              className="m-2 p-3 rounded-lg bg-[#131a2a] text-white font-light text-lg w-1/4 outline-none"
              placeholder="0.00"
            />
          </div>
          <h2 className="text-white text-lg font-extralight mt-2">Token 2</h2>
          <div className="flex">
            <div className="p-2 w-3/4 relative">
              <input
                placeholder="address"
                value={address2}
                className="p-3 rounded-lg bg-[#131a2a] text-white font-light text-lg w-full outline-none"
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
              className="m-2 p-3 rounded-lg bg-[#131a2a] text-white font-light text-lg w-1/4 outline-none"
              placeholder="0.00"
            />
          </div>

          <button className="text-white p-2 mt-8 rounded-lg -mb-5 bg-gradient-to-tl from-sky-900/60 to-purple-800/60">
            Start
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
