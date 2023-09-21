require('dotenv/config');

const User = require('../models/User');

module.exports = {
  async lookingForUser({ user }) {
    try {
      if (!user) return null;

      const findUser = await User.findOne({
        where: {
          telegram_id: `${user.id}`,
        },
      });

      return findUser;
    } catch (err) {
      throw new Error(err);
    }
  },
  async createUser({ user }) {
    try {
      if (!user) return null;

      console.log(user);

      const [findUser, created] = await User.findOrCreate({
        where: {
          telegram_id: `${user.id}`,
        },
        defaults: {
          telegram_id: `${user.id}`,
          first_name: user.first_name,
          last_name: user.last_name,
          language_code: user.language_code,
        },
      });

      return { findUser, created };
    } catch (err) {
      throw new Error(err);
    }
  },
};
