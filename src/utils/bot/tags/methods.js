const { tagsController } = require('../../../controllers/index');

async function show({ user, chatId, messageId, bot }) {
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

async function create({ user, chatId, messageId, bot }) {
  bot.editMessageText('Qual nome da tag que deseja criar?', {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: [],
    },
  });

  bot.once('message', async (message) => {
    if (!message) return null;

    const tagName = message?.text;

    if (tagName[0] === '/') return null;

    const data = await tagsController.create({ user, tagName });

    if (data) return bot.sendMessage(chatId, 'Registro criado com sucesso ✅!');

    return null;
  });
}

async function update({ user, chatId, messageId, bot }) {
  const tags = await tagsController.show({ user });
  let odd = [];
  let even = [];

  await tags.map((tag, index) => {
    if (index % 2) {
      return odd.push({ text: tag.mark, callback_data: tag.id });
    }
    return even.push({ text: tag.mark, callback_data: tag.id });
  });

  const options = {
    reply_markup: {
      inline_keyboard: [[...odd], [...even]],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  };

  bot.editMessageText('Qual tag deseja alterar?', {
    chat_id: chatId,
    message_id: messageId,
    ...options,
  });

  bot.on('callback_query', async (query) => {
    const tagId = query.data;

    bot.editMessageText('Para qual nome deseja alterar?', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [],
      },
    });

    bot.once('message', async (message) => {
      if (!message) return null;

      const tagName = message?.text;

      if (tagName[0] === '/') return null;

      const data = await tagsController.update({ tagId, tagName });

      if (data)
        return bot.sendMessage(chatId, 'Registro editado com sucesso ✅!');

      return null;
    });
  });
}

async function destroy({ user, chatId, messageId, bot }) {
  const tags = await tagsController.show({ user });
  let odd = [];
  let even = [];

  await tags.map((tag, index) => {
    if (index % 2) {
      return odd.push({ text: tag.mark, callback_data: tag.id });
    }
    return even.push({ text: tag.mark, callback_data: tag.id });
  });

  // const options = {
  //   reply_markup: {
  //     inline_keyboard: [[...odd], [...even]],
  //     one_time_keyboard: true,
  //     resize_keyboard: true,
  //   },
  // };

  bot.editMessageText('Qual tag deseja exluir?', {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: [[...odd], [...even]],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });

  bot.on('callback_query', async (query) => {
    const tagId = query.data;
    const selectedTag = await tags.filter(
      (tag) => tag.id === parseInt(query.data)
    );
    const selectedTagName = selectedTag[0]?.mark;
    console.log(selectedTag);

    bot.editMessageText('Certeza que deseja excluir essa tag?', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: selectedTagName, callback_data: 'none' }],
          [
            { text: 'Confirmar ✅', callback_data: 'delete' },
            { text: 'Cancelar', callback_data: 'cancel' },
          ],
        ],
      },
    });

    bot.on('callback_query', async (query) => {
      if (query.data === 'none') return null;
      if (query.data === 'cancel')
        return bot.editMessageText('Processo cancelado 🙅‍♂️!', {
          chat_id: chatId,
          message_id: messageId,
        });

      // const data = await tagsController.destroy({ tagId });

      // console.log(data);

      return bot.editMessageText('Registro excluido com sucesso ✅!', {
        chat_id: chatId,
        message_id: messageId,
      });

      return null;
    });

    return null;
  });

  return null;
}

async function dontInplemented({ chatId, messageId, bot }) {
  return bot.editMessageText('Essa função ainda não esta disponivel 🤕', {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: [],
    },
  });
}

module.exports = { show, dontInplemented, create, update, destroy };
