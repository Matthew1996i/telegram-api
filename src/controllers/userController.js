require('dotenv/config');

const User = require('../models/User');

module.exports = {
  async createUser({ user }) {
    try {
      if (!user) return null;

      const [findUser, created] = await User.findOrCreate({
        where: {
          telegram_id: `${user.id}`,
        },
        defaults: {
          telegram_id: `${user.id}`,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });

      return { findUser, created };
    } catch (err) {
      throw new Error(err);
    }
  },
};
