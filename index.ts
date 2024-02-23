import { Telegraf } from "telegraf";
import { Bot } from "./bot";
import * as dotenv from 'dotenv'

// Регистрация расширений

// Регистрация переменных окружения
dotenv.config()

const telegraf : Telegraf = new Telegraf(process.env.BOT_TOKEN); 
const bot : Bot = new Bot(telegraf);
bot.launch();