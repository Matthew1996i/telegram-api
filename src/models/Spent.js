const { Model, DataTypes } = require('sequelize');

class Spent extends Model {
  static init(connection) {
    super.init(
      {
        place_name: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        bill_value: DataTypes.FLOAT,
        mark: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize: connection,
        tableName: 'spent',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_telegram_id',
      as: 'telegram_id_references',
    });
  }
}

module.exports = Spent;
