const express = require('express')
const LiquidityPool = require('../db/models/LiquidityPool')

const router = express.Router()

router.get('/', async (req, res) => {
  const pools = await LiquidityPool.findAll()
  res.send(pools)
})

router.get('/:version', async (req, res) => {
  const pools = await LiquidityPool.findAll({
    where: { version: req.params.version },
  })

  res.send(pools)
})

router.get('/address/:address', async (req, res) => {
  const pool = await LiquidityPool.findOne({
    where: { address: req.params.address },
  })
  pool ? res.send(pool) : res.sendStatus(404)
})

router.get('/:version/:pid', async (req, res) => {
  const pool = await LiquidityPool.findOne({
    where: { version: req.params.version, pid: req.params.pid },
  })

  pool ? res.send(pool) : res.sendStatus(404)
})

module.exports = router
