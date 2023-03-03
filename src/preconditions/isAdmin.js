const { roles } = require("../config.json");

module.exports = {
	check: function (interaction, client) {
		// checks if the person who created the interaction is an admin
		if (interaction.member.roles.cache.has(roles.admin)) {
			return true;
		}
		return false;
	}
}
