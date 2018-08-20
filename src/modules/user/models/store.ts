module.exports = function (sequelize, DataTypes) {
    let store = sequelize.define('store', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
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
            tableName: 't_store',
            createdAt: false,
            updatedAt: 'updated_at',
            classMethods: {
                associate: function (models) {

                }
            }
        });
    return store
};
