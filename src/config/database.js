require('dotenv/config');

module.exports = {
  dialect: process.env.DIALECT,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  username: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DATABASE,
  define: {
    timestamps: true,
    underscored: true,
  },
  timezone: '-03:00',
  query: { raw: true },
};
