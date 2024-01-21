import { Telegraf } from "telegraf";
import { Bot } from "./bot";
import * as dotenv from 'dotenv'
dotenv.config()

import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '@src': './src',
  '@utils': './src/utils',
});


const telegraf : Telegraf = new Telegraf(process.env.BOT_TOKEN); 
const bot : Bot = new Bot(telegraf);