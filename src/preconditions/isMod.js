const { roles } = require('../config.json');

module.exports = {
	check: function (interaction, client) {
		// checks if the user who created the interaction is a mod or an admin
		if (interaction.member.roles.cache.has(roles.mod) || interaction.member.roles.cache.has(roles.admin)) {
			return true;
		}
		return false;
	}
}
