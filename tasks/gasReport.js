const { ercAbi } = require('../test/shared/shortABIs')
const { getPID, calculateUniswapSLPAddress } = require('../utilities')
const { WETH, ALCX, MASTER_CHEF_V2, ROUTER } =
  require('../data/addresses.json').mainnet

const getReport = async () => {
  console.log('SushiSwap 4 steps process report...')
  const sushi = await gasReportSushiSwap()
  console.table(sushi)
}

const init = async () => {
  const signers = await ethers.getSigners()

  const router = await ethers.getContractAt('IUniswapV2Router02', ROUTER)

  const masterChef = await ethers.getContractAt('IMasterChef', MASTER_CHEF_V2)

  const TOKEN1 = new ethers.Contract(WETH, ercAbi, signers[0])
  const TOKEN2 = new ethers.Contract(ALCX, ercAbi, signers[0])

  const slpAddress = calculateUniswapSLPAddress(TOKEN1.address, TOKEN2.address)

  const SLP = new ethers.Contract(slpAddress, ercAbi, signers[0])
  await TOKEN1.deposit({
    value: ethers.utils.parseEther('400'),
  })

  await TOKEN1.approve(router.address, ethers.utils.parseEther('200'))

  await router.swapExactTokensForTokens(
    ethers.utils.parseEther('100'),
    ethers.utils.parseEther('100'),
    [TOKEN1.address, TOKEN2.address],
    signers[0].address,
    9971497568
  )
  const PID = await getPID(slpAddress, 'data/LiquidityPoolsV2.json')

  return { router, masterChef, TOKEN1, TOKEN2, slpAddress, SLP, signers, PID }
}

const gasReportSushiSwap = async () => {
  const transactions = {}

  const { SLP, TOKEN1, TOKEN2, masterChef, router, signers, PID } = await init()

  const approveToken1 = await TOKEN1.approve(
    router.address,
    '1000000000000000000'
  )
  const approveToken1tx = await approveToken1.wait()
  transactions['Approve Token 1'] = approveToken1tx.gasUsed.toNumber()

  const approveToken2 = await TOKEN2.approve(
    router.address,
    '80000000000000000000'
  )
  const approveToken2tx = await approveToken2.wait()

  transactions['Approve Token 2'] = approveToken2tx.gasUsed.toNumber()

  const addLiquidity = await router.addLiquidity(
    TOKEN1.address,
    TOKEN2.address,
    '1000000000000000000',
    '80000000000000000000',
    '10000000000000000',
    '10000000000000000',
    signers[0].address,
    9971497568
  )
  const addLiquiditytx = await addLiquidity.wait()

  transactions['Add Liquidity'] = addLiquiditytx.gasUsed.toNumber()

  const SLPBalance = await SLP.balanceOf(signers[0].address)

  const approveSLP = await SLP.approve(masterChef.address, SLPBalance)
  const approveSLPtx = await approveSLP.wait()

  transactions['Approve Token SLP'] = approveSLPtx.gasUsed.toNumber()

  const depositSLP = await masterChef['deposit(uint256,uint256,address)'](
    PID,
    SLPBalance,
    signers[0].address
  )
  const depositTX = await depositSLP.wait()

  transactions['Deposit'] = depositTX.gasUsed.toNumber()
  transactions['Total'] = approveToken1tx.gasUsed
    .add(approveToken2tx.gasUsed)
    .add(addLiquiditytx.gasUsed)
    .add(approveSLPtx.gasUsed)
    .add(depositTX.gasUsed)
    .toNumber()

  return transactions
}

module.exports = { getReport }
