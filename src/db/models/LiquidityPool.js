const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class LiquidityPool extends Model {}

LiquidityPool.init(
  {
    pid: {
      type: DataTypes.BIGINT,
    },
    address: {
      type: DataTypes.STRING,
    },
    token1: {
      type: DataTypes.STRING,
    },
    token2: {
      type: DataTypes.STRING,
    },
    version: {
      type: DataTypes.SMALLINT,
      defaultValue: 2,
    },
  },
  {
    sequelize,
  }
)

module.exports = LiquidityPool
