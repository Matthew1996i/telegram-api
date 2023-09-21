require('dotenv/config');

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const { startOfMonth, endOfMonth, format } = require('date-fns');

const Spent = require('../models/Spent');
const User = require('../models/User');
const { bot } = require('../config/bot');

module.exports = {
  async createSpent({ spent, user }) {
    try {
      if (!spent) return null;

      const findedUser = await User.findOne({
        where: {
          telegram_id: `${user.id}`,
        },
      });

      if (!user) return null;

      await Spent.create({
        user_id: `${findedUser.id}`,
        ...spent,
      });
    } catch (err) {
      throw new Error(err);
    }
  },
  async excelJson(msg, data) {
    try {
      const { chat, from } = msg;
      const chatId = chat.id;

      await bot.sendMessage(
        chatId,
        'Em breve será enviado os seus gastos... 🔁'
      );

      const { month, year } = data;
      const startDate = startOfMonth(new Date(year, month));
      const endDate = endOfMonth(new Date(year, month));

      const parentDir = path.dirname(__dirname);
      const timestamp = Date.now();
      const filePath = path.join(
        parentDir,
        `temp/meus_gastos_${timestamp}.xlsx`
      );

      const wb = XLSX.utils.book_new();

      const workSheetColumnNames = [
        { header: 'Local da Compra', key: 'place_name' },
        { header: 'Valor da Compra', key: 'bill_value' },
        { header: 'Titulo', key: 'mark' },
        { header: 'Data da Compra', key: 'created_at' },
      ];

      const worksheet = XLSX.utils.json_to_sheet([], {
        header: workSheetColumnNames,
      });

      const telegramId = String(from.id);

      const user = await User.findOne({
        where: {
          telegram_id: telegramId,
        },
      });

      const spents = await Spent.findAll({
        where: {
          user_id: user.id,
          created_at: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      if (spents.length <= 0)
        return await bot.sendMessage(chatId, 'Não tem nada para mostrar 🤕');

      const dataTable = spents.map((spent) => ({
        place_name: spent.place_name,
        bill_value: `R$ ${spent.bill_value}`,
        mark: spent.mark,
        created_at: format(new Date(spent.created_at), 'dd/MM/yyyy'),
      }));

      XLSX.utils.sheet_add_json(worksheet, dataTable);

      XLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');

      const wbOpts = { bookSST: true, compression: true, bookType: 'xlsx' }; // workbook options

      XLSX.writeFile(wb, filePath, wbOpts);

      await bot
        .sendDocument(chatId, fs.createReadStream(filePath))
        .then(() => {
          fs.unlinkSync(filePath);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      throw new Error(error);
    }
  },
};
