module.exports = function (sequelize, DataTypes) {
	let user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
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
			tableName: 't_user',
			createdAt: false,
			updatedAt: 'updated_at',
			classMethods: {
				associate: function (models) {

				}
			}
		});
	return user
};
