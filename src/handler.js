const fs = require('node:fs');
const path = require('node:path');
const { Collection, Events } = require('discord.js');

module.exports = function (client) {
	client.commands = new Collection();  // creates a Collection for commands so that they can be utilized!
	const commandsPath = path.join(__dirname, 'commands');  // creates a command directory
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));  // returns a map of loaded files
	
	// adds the commands to the respective Collection
	for (const file of commandFiles) { 
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	}
	
	// Setup for preconditions
	client.preconditions = new Collection();
	const preconsPath = path.join(__dirname, 'preconditions');
	const preconsFiles = fs.readdirSync(preconsPath).filter(file => file.endsWith('.js'));
	
	// adds the preconditions to the respective Collection
	for (const file of preconsFiles) {
		const filePath = path.join(preconsPath, file);
		const precon = require(filePath);
		client.preconditions.set(file.slice(0, -3), precon);
	}

	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return;  // check if it is a chat command

		const command = interaction.client.commands.get(interaction.commandName);  // grabs command

		if (!command) return;  // checks if command exists

		// checks through the preconditions
		let commandPrecons = client.commands.get(interaction.commandName).preconditions;
		let validPrecons = true;
		let whenFalse;

		if (commandPrecons) {
			for (const precon of client.commands.get(interaction.commandName).preconditions) {
				if (!client.preconditions.get(precon).check(interaction, client)) {
					validPrecons = false;
					whenFalse = client.preconditions.get(precon).whenFalse;
				}
			}
		}
	
		// command goes through if valid, otherwise sends permission reply
		if (validPrecons) {
			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
			await interaction.reply({ content: `There was an error while executing this command!`, ephemeral: true});
			}
		} else {
			if (whenFalse) {
				whenFalse(interaction, client);
			} else {
				await interaction.reply({ content: "You do not meet the precondition to use this command!", ephemeral: true });
			}
		}
	});
}
