const base = require('./webpack.config.base')

const mode = process.env.NODE_ENV || 'production'
base.mode = mode

module.exports = base
