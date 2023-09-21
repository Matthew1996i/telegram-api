const { Model, DataTypes } = require('sequelize');

class SpentMark extends Model {
  static init(connection) {
    super.init(
      {
        user_id: DataTypes.INTEGER,
        mark: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize: connection,
        tableName: 'spent_marks',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'spent_mark_user_id',
    });
  }
}

module.exports = SpentMark;
