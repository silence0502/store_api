module.exports = function (sequelize, DataTypes) {
    let user_store = sequelize.define('user_store', {
        created_at: {
            type: DataTypes.TIME,
            allowNull: false,
            defaultValue: sequelize.fn('now')
        },
        updated_at: {
            type: DataTypes.TIME,
            allowNull: false,
            defaultValue: sequelize.fn('now')
        }
    }, {
        tableName: 't_user_store',
        createdAt: false,
        updatedAt: 'updated_at',
        classMethods: {
            associate: function (models) {
                user_store.belongsTo(models.user, { foreignKey: 'user_id' });
                user_store.belongsTo(models.store, { foreignKey: 'store_id' });
            }
        }
    });
    return user_store;
};
