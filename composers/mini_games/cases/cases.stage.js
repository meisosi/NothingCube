const { Scenes } = require('telegraf')

const on_dev = require('./on_dev/wizard')
const lucky_drop = require('./lucky_drop/wizard')
const high_risk = require('./high_risk/wizard')
const elevation = require('./elevation/wizard')
const money_game = require('./money_game/wizard')

const stage = new Scenes.Stage([on_dev, lucky_drop, high_risk, elevation, money_game])

module.exports = stage