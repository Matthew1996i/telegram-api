const {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isValid,
} = require('date-fns');

function createCalendar(bot, msg) {
  try {
    const { chat } = msg;

    const chatId = chat.id;

    let currentDate = new Date();
    let currentMonth = startOfMonth(currentDate);
    let nextMonth = addMonths(currentMonth, 1);
    let prevMonth = subMonths(currentMonth, 1);

    const buttons = [
      { text: '<<', callback_data: 'PREV_MONTH' },
      { text: format(currentMonth, 'MMMM - yyyy'), callback_data: 'IGNORE' },
      { text: '>>', callback_data: 'NEXT_MONTH' },
    ];

    const calendarDays = eachDayOfInterval({
      start: currentMonth,
      end: endOfMonth(currentMonth),
    });

    const rows = calendarDays.reduce((accumulator, currentValue, index) => {
      const rowIndex = Math.floor(index / 7);
      if (!accumulator[rowIndex]) accumulator[rowIndex] = [];
      accumulator[rowIndex].push({
        text: currentValue.getDate().toString(),
        callback_data: `${currentValue.getFullYear()}-${currentValue.getMonth()}-${currentValue.getDate()}`,
      });

      return accumulator;
    }, []);

    const calendar = {
      reply_markup: {
        inline_keyboard: [buttons, ...rows],
      },
      parse_mode: 'HTML',
    };

    bot.sendMessage(chatId, 'Selecione uma data:', calendar);

    bot.on('callback_query', async (query) => {
      const chatId = query.message.chat.id;
      const messageId = query.message.message_id;

      switch (query.data) {
        case 'PREV_MONTH':
          currentMonth = prevMonth;
          nextMonth = addMonths(currentMonth, 1);
          prevMonth = subMonths(currentMonth, 1);
          currentYear = currentMonth.getFullYear();
          break;
        case 'NEXT_MONTH':
          currentMonth = nextMonth;
          nextMonth = addMonths(currentMonth, 1);
          prevMonth = subMonths(currentMonth, 1);
          currentYear = currentMonth.getFullYear();
          break;
      }

      const newButtons = [
        { text: '<<', callback_data: 'PREV_MONTH' },
        { text: format(currentMonth, 'MMMM - yyyy'), callback_data: 'IGNORE' },
        { text: '>>', callback_data: 'NEXT_MONTH' },
      ];

      const newCalendarDays = eachDayOfInterval({
        start: currentMonth,
        end: endOfMonth(currentMonth),
      });

      const newRows = newCalendarDays.reduce(
        (accumulator, currentValue, index) => {
          const rowIndex = Math.floor(index / 7);
          if (!accumulator[rowIndex]) accumulator[rowIndex] = [];
          accumulator[rowIndex].push({
            text: currentValue.getDate().toString(),
            callback_data: `${currentValue.getFullYear()}-${currentValue.getMonth()}-${currentValue.getDate()}`,
          });
          return accumulator;
        },
        []
      );

      const newCalendar = {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: isValid(new Date(query.data))
            ? []
            : [newButtons, ...newRows],
        },
        parse_mode: 'HTML',
      };

      if (isValid(new Date(query.data))) {
        await bot.deleteMessage(chatId, messageId);
        await bot.sendMessage(
          chatId,
          `a Data selecionada é ${format(new Date(query.data), 'dd-MMMM-yyyy')}`
        );

        return format(new Date(query.data), 'dd-MMMM-yyyy');
      } else {
        return await bot.editMessageText(
          `Selecione uma data:\n${format(currentMonth, 'MMMM - yyyy')}`,
          newCalendar
        );
      }
    });
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { createCalendar };
