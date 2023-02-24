require('./database');

const { format } = require('date-fns');

const TelegramBot = require('node-telegram-bot-api');
const { verifyStatus } = require('./utils/bot/status');
const { singUp } = require('./utils/bot/singup');
const { add, update, show } = require('./utils/bot/spent');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {
  polling: true,
});

bot.setMyCommands([
  { command: 'status', description: 'Verificar status do Bot' },
  { command: 'singup', description: 'Começar a me cadastrar' },
  { command: 'add', description: 'Adicionar uma despesa' },
  { command: 'export', description: 'Exportar dados para Excel' },
]);

bot.onText(/\/status/, async (msg) => {
  bot.removeListener('callback_query');
  await verifyStatus(bot, msg);
});

bot.onText(/\/singup/, async (msg) => {
  bot.removeListener('callback_query');
  await singUp(bot, msg);
});

bot.onText(/\/add/, async (msg) => {
  bot.removeListener('callback_query');
  await add(bot, msg);
});

bot.onText(/\/export/, async (msg) => {
  bot.removeListener('callback_query');
  await show(bot, msg);
});
