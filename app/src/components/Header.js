import { useDispatch, useSelector } from 'react-redux'
import { connect } from '../redux/web3Slice'

const Header = () => {
  const dispatch = useDispatch()
  const address = useSelector((state) => state.web3.address)
  return (
    <header className="border-b border-white/10 p-4">
      <nav className="flex justify-between items-center justify-items-center">
        <div></div>
        <div className="flex justify-center items-center">
          {!address && (
            <button
              onClick={() => dispatch(connect())}
              className="group relative h-10 w-48 overflow-hidden rounded-xl bg-gradient-to-r from-sky-600/90 to-sky-900/60 text-lg shadow gradient-5"
            >
              <div className="absolute inset-0 w-0 bg-sky-600/80 transition-all duration-[250ms] ease-out group-hover:w-full right-0"></div>
              <span className="relative text-white group-hover:text-white">
                Connect Wallet
              </span>
            </button>
          )}

          {address && (
            <div>
              <span className="text-white/80 font-extralight">{address}</span>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
