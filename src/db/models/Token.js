const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Token extends Model {}

Token.init(
  {
    address: {
      type: DataTypes.STRING,
    },
    chainId: {
      type: DataTypes.INTEGER,
    },
    decimals: {
      type: DataTypes.INTEGER,
    },
    logo: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    symbol: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
  }
)

module.exports = Token
