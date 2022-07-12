var Sequelize = require('sequelize'),
cfg = require('./config');

var APIKeys = cfg.config.db.define( 'apikeys', {
	apikeyHash: {
		type: Sequelize.STRING,
		field: 'apikey_hash'
	},
	expiredTime: {
		type: Sequelize.NUMBER,
		field: 'expired_time'
	}
},{
	timestamps: true
});

exports.models = {
	apiKeys: APIKeys
}