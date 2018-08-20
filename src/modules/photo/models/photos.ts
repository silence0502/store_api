module.exports = function (sequelize, DataTypes) {
    let photos = sequelize.define('photos', {
        store: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        img: {
            type: DataTypes.STRING,
            allowNull: false
        },
        img_height: {
            type: DataTypes.STRING,
            allowNull: false
        },
        img_width: {
            type: DataTypes.STRING,
            allowNull: false
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        report_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
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
            tableName: 't_photos',
            createdAt: false,
            updatedAt: 'updated_at',
            classMethods: {
                associate: function (models) {

                }
            }
        });
    return photos
};
