const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const models = require('../utils/models-list');

const connection = new Sequelize(dbConfig);

const connections = models.map((model) => model.init(connection));

module.exports = connections;
