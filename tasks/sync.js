const fs = require('fs')
const { MASTER_CHEF, MASTER_CHEF_V2 } =
  require('../data/addresses.json').mainnet

const sync = async () => {
  const masterChefContract = await ethers.getContractAt(
    'IMasterChef',
    MASTER_CHEF
  )

  const masterChefV2Contract = await ethers.getContractAt(
    'IMasterChef',
    MASTER_CHEF_V2
  )

  await syncPoolsV2(masterChefV2Contract)
  await syncPoolsV1(masterChefContract)
}

const syncPoolsV1 = async (masterChef) => {
  const poolLength = await masterChef.poolLength()
  console.log(
    `Getting ${poolLength.toString()} MasterChefV1 Liquidity Pools...`
  )
  const data = await Promise.all(
    Array.from({ length: poolLength }, (x, i) => i).map(async (pid) => {
      const address = (await masterChef.poolInfo(pid))[0]
      return { pid, address }
    })
  )

  const jsonData = JSON.stringify(data)
  fs.writeFileSync('data/LiquidityPoolsV1.json', jsonData)
  console.log('Sync MasterChefV1 Liquidity Pools finished successfully')
}

const syncPoolsV2 = async (masterChef) => {
  const poolLength = await masterChef.poolLength()
  console.log(
    `Getting ${poolLength.toString()} MasterChefV2 Liquidity Pools...`
  )
  const data = await Promise.all(
    Array.from({ length: poolLength }, (x, i) => i).map(async (pid) => {
      const address = await masterChef.lpToken(pid)
      return { address, pid }
    })
  )

  const jsonData = JSON.stringify(data)
  fs.writeFileSync('data/LiquidityPoolsV2.json', jsonData)
  console.log('Sync MasterChefV2 Liquidity Pools finished successfully')
}

module.exports.sync = sync
