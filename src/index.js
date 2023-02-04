// TODO: COMMENT EVERYTHING!!!!
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.config = require('./config.json');
const { DISCORD_TOKEN } = client.config;
const { errMsg } = require('./dev.js');

client.vars = {};
client.functions

// creates a commands Collection and does setup for the command loader
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// does setup and loader for preconfigurations
client.preconditions = new Collection();
const preconsPath = path.join(__dirname, 'preconditions');
const preconsFiles = fs.readdirSync(preconsPath).filter(file => file.endsWith('.js'));
const preconsArray = [];

for (const file of preconsFiles) {
	const filePath = path.join(preconsPath, file);
	const precon = require(filePath);
	client.preconditions.set(file.slice(0, -3), precon);
}

client.scripts = new Collection();
const scriptsPath = path.join(__dirname, 'scripts');
const scriptsFiles = fs.readdirSync(scriptsPath).filter(file => file.endsWith('.js'));
const scriptsArray = [];

for (const file of scriptsFiles) {
	const filePath = path.join(scriptsPath, file);
	const script = require(filePath);
	client.scripts.set(file.slice(0, -3), script);
}

client.once(Events.ClientReady, () => {
	console.log(`[BOT] Spirit is logged in as ${client.user.username}!`);
	client.scripts.each( s => {
		if (s.ready) {
			s.ready(client);
		}
	});
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;  // check if it is a chat command

	const command = interaction.client.commands.get(interaction.commandName);  // grabs command

	if (!command) return;  // checks if command exists

	// checks through the preconditions
	let commandPrecons = client.commands.get(interaction.commandName).preconditions;
	let validPrecons = true;

	if (commandPrecons) {
		for (const precon of client.commands.get(interaction.commandName).preconditions) {
			if (!client.preconditions.get(precon).check(interaction, client)) {
				validPrecons = false;
			}
		}
	}
	
	// command goes through if valid, otherwise sends permission reply
	if (validPrecons) {
		try {
			await command.execute(interaction);
		} catch (error) {
			errMsg(client, error);
			await interaction.reply({ content: `There was an error. I'll let the devs know!'`, ephemeral: true });
		}
	} else {
		interaction.reply({ content: 'Sorry, you do not have the permissions to use this command!', ephemeral: true});
	}
});

client.login(DISCORD_TOKEN);

