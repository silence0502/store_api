module.exports = function (sequelize, DataTypes) {
    let report = sequelize.define('report', {
        num: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        info: {
            type: DataTypes.STRING,
            allowNull: true
        },
        report_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        height: {
            type: DataTypes.STRING,
            allowNull: false
        },
        width: {
            type: DataTypes.STRING,
            allowNull: false
        },
        top: {
            type: DataTypes.STRING,
            allowNull: false
        },
        left: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quality: {
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
        tableName: 't_report',
        createdAt: false,
        updatedAt: 'updated_at',
        classMethods: {
            associate: function (models) {
            }
        }
    });
    return report;
};
