const express = require('express')
const Token = require('../db/models/Token')

const router = express.Router()

router.get('/', async (req, res) => {
  const param = req.query
  if (Object.keys(param) = 0) {
    res.send(await Token.findAll())
    return
  }
  const token = await Token.findOne({ where: param })
  token ? res.send(token) : res.sendStatus(404)
})

module.exports = router