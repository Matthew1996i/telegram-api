const { userController } = require('../../controllers');

async function singUp(bot, msg) {
  try {
    const chatId = msg.chat.id;
    const from = msg.from;

    const data = await userController.createUser({ user: from });

    if (data?.created)
      return bot.sendMessage(
        chatId,
        `Seja bem vindo ${data.findUser.dataValues.first_name} ${data.findUser.dataValues.last_name}!😄 \nEstou aqui para lhe ajudar da melhor forma!`
      );
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { singUp };
