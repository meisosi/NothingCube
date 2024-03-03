const { Scenes } = require('telegraf')

const lucky_drop = require('./lucky_drop/wizard')
const high_risk = require('./high_risk/wizard')
const friend_case = require('./friend_case/wizard')
const high_risk_prem = require('./high_risk_prem/wizard')
const lucky_drop_prem = require('./lucky_drop_prem/wizard')
const nt_case = require('./nt_case/wizard')
const pepsa_case = require('./pepsa_case/wizard')
const roolet = require('./roolet/wizard')
const elevation = require('./elevation/wizard')


const stage = new Scenes.Stage([lucky_drop, high_risk, friend_case, high_risk_prem, lucky_drop_prem, nt_case, pepsa_case, roolet, elevation])

module.exports = stage