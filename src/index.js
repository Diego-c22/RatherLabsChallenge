const express = require('express')
const poolsRouter = require('./routes/LiquidityPools')
const tokensRouter = require('./routes/Tokens')
const sequelize = require('./db/db')
const sync = require('./tasks/sync')

sequelize.sync()
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())

sync()

app.use('/api/pools/', poolsRouter)
app.use('/api/tokens/', tokensRouter)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
