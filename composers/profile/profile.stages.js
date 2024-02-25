const { Scenes } = require('telegraf')

const promocodes = require('./promocodes/wizard')

const stage = new Scenes.Stage([promocodes])

module.exports = stage