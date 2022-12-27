const fs = require('fs')
const LiquidityPool = require('../db/models/LiquidityPool')

const sync = () => {
  updateRegisters('data/LiquidityPoolsV1.json', 1)
  updateRegisters('data/LiquidityPoolsV2.json', 2)
}

const updateRegisters = async (file, version) => {
  const data = fs.readFileSync(file, (err) => {
    if (err) console.log(err)
  })
  const dataParsed = JSON.parse(data)
  const last = await LiquidityPool.max('pid', { where: { version } })

  console.log(last, 'last')

  for (i = (last || 0) + 1; i < dataParsed.length; i++) {
    LiquidityPool.create({
      pid: dataParsed[i].pid,
      version,
      address: dataParsed[i].address,
    })
  }
}

module.exports = sync
