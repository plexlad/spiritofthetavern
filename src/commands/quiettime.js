const { SlashCommandBuilder } = require('discord.js');

const quiettime = require("../scripts/quiettime.js").ready

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quiettime')
		.setDescription('Moderator quiettime function')	,

	async execute(interaction, client) {
		quiettime(interaction.client);
		interaction.reply({ content: "Quiet time has been toggled!", ephemeral: true });
	}
}
