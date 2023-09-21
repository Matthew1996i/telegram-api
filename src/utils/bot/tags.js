const { bot } = require('../../config/bot');
const { tagsController } = require('../../controllers');

async function show(user, chatId, messageId) {
  const errorMessage = 'Não foi encontrado nenhuma tag 🤕';
  let message = 'Aqui estão todos os seus rotulos:\n\n';

  const data = await tagsController.show({ user });

  if (!data.length)
    return bot.editMessageText(errorMessage, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [],
      },
    });

  await data.forEach((tag) => {
    message += `🔰 ${tag.mark}\n`;
  });

  return bot.editMessageText(message, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: [],
    },
  });
}

async function dontInplemented(chatId, messageId) {
  return bot.editMessageText('Essa função ainda não esta disponivel 🤕', {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: [],
    },
  });
}

function tags(msg) {
  try {
    const chatId = msg.chat.id;
    const user = msg.from;

    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Adicionar', callback_data: 'add' },
            { text: 'Editar', callback_data: 'edit' },
          ],
          [
            { text: 'Excluir', callback_data: 'delete' },
            { text: 'Ver Todos', callback_data: 'show' },
          ],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    };

    bot.sendMessage(
      chatId,
      'Bem vindo(a) a sessão dos rotulos, o que deseja fazer?',
      options
    );

    bot.on('callback_query', async (query) => {
      const chatId = query.message.chat.id;
      const messageId = query.message.message_id;

      if (query.data === 'show') return show(user, chatId, messageId);
      if (query.data === 'edit') return dontInplemented(chatId, messageId);
      if (query.data === 'delete') return dontInplemented(chatId, messageId);
      if (query.data === 'add') return dontInplemented(chatId, messageId);

      return null;
    });
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { tags };
