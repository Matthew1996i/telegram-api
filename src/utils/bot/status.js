const { bot } = require('../../config/bot');

function verifyStatus(msg) {
  try {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Bot now is Online ✅');
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { verifyStatus };
