const { guildId } = require("../config.json");
const { PermissionsBitField } = require('discord.js');

module.exports = {
	ready: function (client) {
		if (!client.vars.quiettime) {
			client.guilds.cache.get(guildId).roles.everyone.setPermissions(
				[
					PermissionsBitField.Flags.ReadMessageHistory,
					PermissionsBitField.Flags.AddReactions,
					PermissionsBitField.Flags.ViewChannel
				]
			).then(updated => console.log(`[BOT] Updated permissions: @everyone SendMessages`))
			.catch(console.error);
		} else {
			client.guilds.cache.get(guildId).roles.everyone.setPermissions(
				[
					PermissionsBitField.Flags.ReadMessageHistory,
					PermissionsBitField.Flags.AddReactions,
					PermissionsBitField.Flags.ViewChannel,
					PermissionsBitField.Flags.SendMessages
				]
			).then(updated => console.log(`[BOT] Updated permissions: @everyone SendMessages`))
			.catch(console.error);
		}
		client.vars.quiettime = !client.vars.quiettime;
	}
}
