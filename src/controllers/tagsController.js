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

  async create({ user, tagName }) {
    try {
      if (!user) return null;

      const findedUser = await User.findOne({
        where: {
          telegram_id: `${user.id}`,
        },
      });

      const allTags = await SpentMark.findAll({
        where: {
          user_id: `${findedUser.id}`,
        },
      });

      if (allTags.length > 10) return 'Limite de tags alcançado';

      const newTag = await SpentMark.create({
        user_id: findedUser.id,
        mark: tagName,
      });

      return newTag;
    } catch (err) {
      throw new Error(err);
    }
  },

  async update({ tagId, tagName }) {
    try {
      const tag = await SpentMark.update(
        {
          mark: tagName,
        },
        {
          where: {
            id: tagId,
          },
        }
      );

      return tag;
    } catch (err) {
      throw new Error(err);
    }
  },

  async destroy({ tagId }) {
    try {
      const tag = await SpentMark.destroy({
        where: {
          id: tagId,
        },
      });

      return tag;
    } catch (err) {
      throw new Error(err);
    }
  },
};
