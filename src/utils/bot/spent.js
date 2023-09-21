const { bot } = require('../../config/bot');
const { spentController } = require('../../controllers');

const { getYears, getMonths } = require('../../helpers/periode-dates');

module.exports = {
  async add(msg) {
    try {
      const { chat, from } = msg;

      const chatId = chat.id;

      const spent = {};

      bot.sendMessage(
        chatId,
        'Qual local que foi feito o(a) compra / pagamento?'
      );

      bot.once('message', async (message) => {
        spent.place_name = message.text;

        bot.sendMessage(
          chatId,
          'Qual o valor da despesa? \nInsira somente número!'
        );

        function waitForNumber() {
          bot.once('message', function onMessage(message) {
            const replaceString = String(message.text).replace(',', '.');

            const number = Number(replaceString);

            if (isNaN(number)) {
              bot.sendMessage(chatId, 'Favor insira um número valido! ❌');

              waitForNumber();
            } else {
              spent.bill_value = number;

              const options = {
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: 'Mercado', callback_data: 'Mercado' },
                      { text: 'Papelaria', callback_data: 'Papelaria' },
                    ],
                    [
                      { text: 'Banco', callback_data: 'Banco' },
                      { text: 'Padaria', callback_data: 'Padaria' },
                    ],
                    [
                      { text: 'FastFood', callback_data: 'FastFood' },
                      {
                        text: 'Salão de Beleza',
                        callback_data: 'Salão de Beleza',
                      },
                    ],
                    [
                      {
                        text: 'Deposito de Material',
                        callback_data: 'Deposito de Material',
                      },
                      { text: 'Outros', callback_data: 'other' },
                    ],
                  ],
                  one_time_keyboard: true,
                  resize_keyboard: true,
                },
              };

              bot.sendMessage(
                chatId,
                'Qual rotulo pertence esse gasto?',
                options
              );

              bot.on('callback_query', async (query) => {
                const chatId = query.message.chat.id;
                const messageId = query.message.message_id;

                spent.mark = query.data;

                await spentController
                  .createSpent({
                    spent,
                    user: from,
                  })
                  .then((resp) => {
                    return bot.editMessageText('Informações Registradas ✅', {
                      chat_id: chatId,
                      message_id: messageId,
                      reply_markup: {
                        inline_keyboard: [],
                      },
                    });
                  })
                  .catch((err) => {
                    if (err)
                      return bot.editMessageText(
                        'Houve um erro ao Realizar o registro 🥲',
                        {
                          chat_id: chatId,
                          message_id: messageId,
                          reply_markup: {
                            inline_keyboard: [],
                          },
                        }
                      );
                  });
              });
            }
          });
        }

        waitForNumber();
      });
    } catch (err) {
      throw new Error(err);
    }
  },
  async exportData(msg) {
    try {
      const { chat } = msg;
      const chatId = chat.id;

      const data = {
        year: '',
        month: '',
      };

      const inlineYearsOptionsFormat = await getYears(5);

      bot.sendMessage(
        chatId,
        'Qual ano você deseja que seja feita a consulta?',
        {
          reply_markup: {
            inline_keyboard: [...inlineYearsOptionsFormat],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        }
      );

      bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        data.year = query.data;

        await bot.deleteMessage(chatId, messageId);

        bot.removeListener('callback_query');

        const inlineMonthsOptionsFormat = await getMonths(query.data);

        if (query.data) {
          bot.sendMessage(
            chatId,
            'Qual o mês que deseja que seja feita a consulta?',
            {
              reply_markup: {
                inline_keyboard: [...inlineMonthsOptionsFormat],
                one_time_keyboard: true,
                resize_keyboard: true,
              },
            }
          );

          bot.on('callback_query', async (query) => {
            const chatId = query.message.chat.id;
            const messageId = query.message.message_id;

            bot.removeListener('callback_query');
            bot.deleteMessage(chatId, messageId);

            data.month = query.data;

            await spentController.excelJson(msg, data);
          });
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  },
};
