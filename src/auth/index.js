const { bot } = require('../config/bot');
const { userController } = require('../controllers');
const { withOutLoginMessage } = require('../helpers/messages');

const privateRouter = async (action, msg) => {
  const chatId = msg.chat.id;
  const { from } = msg;

  const findUser = await userController.lookingForUser({
    user: { ...from },
  });

  if (findUser) {
    return action(msg);
  } else {
    return bot.sendMessage(chatId, withOutLoginMessage());
  }
};

module.exports = { privateRouter };
