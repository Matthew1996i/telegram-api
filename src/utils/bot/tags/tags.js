const { bot } = require('../../../config/bot');
const { show, create, update, destroy } = require('./methods');

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
      'Bem vindo(a) a sessão de Tags, o que deseja fazer?',
      options
    );

    bot.on('callback_query', async (query) => {
      const chatId = query.message.chat.id;
      const messageId = query.message.message_id;

      if (query.data === 'show') return show({ user, chatId, messageId, bot });
      if (query.data === 'add') return create({ user, chatId, messageId, bot });
      if (query.data === 'edit')
        return update({ user, chatId, messageId, bot });
      if (query.data === 'delete')
        return destroy({ user, chatId, messageId, bot });

      return null;
    });
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { tags };
