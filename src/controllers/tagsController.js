require('dotenv/config');

const SpentMark = require('../models/SpentMark');
const User = require('../models/User');

module.exports = {
  async show({ user }) {
    try {
      if (!user) return null;

      const findedUser = await User.findOne({
        where: {
          telegram_id: `${user.id}`,
        },
      });

      const tags = await SpentMark.findAll({
        where: {
          user_id: `${findedUser.id}`,
        },
      });

      return tags;
    } catch (err) {
      throw new Error(err);
    }
  },
};
