require('dotenv/config');

const Spent = require('../models/Spent');
const User = require('../models/User');

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
};
