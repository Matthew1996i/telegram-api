'--unhandled-rejections=strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('spent', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      place_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bill_value: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      mark: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('spent');
  },
};
