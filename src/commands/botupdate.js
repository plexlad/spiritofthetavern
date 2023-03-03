// updates and restarts the bot from github
// uses the origin remote from local git repository
// REBASES LOCAL SERVER (to deal with merge issues)
const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');

// Promise wrapper for an exec function. "await-exec" library code used
function execAwait (command, options = { log: false, cwd: process.cwd() }) {
	if (options.log) console.log(command)

	return new Promise((done, failed) => {
		exec(command, {...options }, (err, stdout, stderr) => {
			if (err) {
				err.stdout = stdout
				err.stderr = stderr
				failed(err)
				return
			}

			done({ stdout, stderr });
		});
	});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botupdate')
		.setDescription('Admin server program update command through git.'),
	
	async execute(interaction) {
		await execAwait('git pull origin main --rebase', (e, stdout, stderr) => {
			if (e) {
				console.error(`error: ${e.message}`);
				return;
			}

			if (stderr) {
				console.error(`stderr: ${stderr}`);
				return;
			}
			
			interaction.reply({ embed: {
				"type": "rich",
				"title": "Git Update",
				"description": `<@${interaction.user.id}> just updated the server app! Restarting now.`
			}});
		});
	},
	preconditions: ['isAdmin']
}
