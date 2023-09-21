require('./database');

const { verifyStatus } = require('./utils/bot/status');
const { singUp } = require('./utils/bot/singup');
const { add, exportData } = require('./utils/bot/spent');
const { tags } = require('./utils/bot/tags');
const { welcomeMessage } = require('./helpers/messages');
const { bot } = require('./config/bot');
const { privateRouter } = require('./auth');

bot.setMyCommands([
  { command: 'status', description: 'Verificar status do Bot' },
  { command: 'singup', description: 'Começar a me cadastrar' },
  { command: 'add', description: 'Adicionar uma despesa' },
  { command: 'export', description: 'Exportar dados para Excel' },
  {
    command: 'tags',
    description: 'Cadastre/Liste/Edite/Exclua os rotulos padrões',
  },
]);

bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(msg.chat.id, welcomeMessage());
});

bot.onText(/\/status/, async (msg) => {
  bot.removeListener('callback_query');
  await verifyStatus(msg);
});

bot.onText(/\/singup/, async (msg) => {
  bot.removeListener('callback_query');
  await singUp(msg);
});

bot.onText(/\/add/, async (msg) => {
  bot.removeListener('callback_query');
  privateRouter(add, msg);
});

bot.onText(/\/export/, async (msg) => {
  bot.removeListener('callback_query');
  privateRouter(exportData, msg);
});

bot.onText(/\/tags/, async (msg) => {
  bot.removeListener('callback_query');
  privateRouter(tags, msg);
});

bot.onText(/\/test/, async (msg) => {
  const chatId = msg.chat.id;

  const array = [
    'item 1',
    'item 2',
    'item 3',
    'item 4',
    'item 5',
    'item 6',
    'item 7',
    'item 8',
    'item 9',
    'item 10',
  ];

  const chunks = [];

  for (let i = 0; i < array.length; i += 2) {
    chunks.push(array.slice(i, i + 2));
  }

  const options = chunks.map((chunk) => {
    return chunk.map((item) => {
      return {
        text: item,
        callback_data: item,
      };
    });
  });

  const keyboard = await {
    reply_markup: {
      inline_keyboard: [...options],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  };

  bot.sendMessage(chatId, 'Qual rotulo pertence esse gasto?', keyboard);
});
