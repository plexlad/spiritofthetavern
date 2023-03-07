// updates and restarts the bot from github
// uses the origin remote from local git repository
// REBASES LOCAL SERVER (to deal with merge issues)
const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
const { errMsg, customModMsg } = require('../dev.js');

// Promise wrapper for an exec function. "await-exec" library code used
function execAwait(command, options = { log: false, cwd: process.cwd() }) {
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

function restartServer() {
	console.log(`[SERVER] Restarting\n[SERVER] PID is ${process.pid}`);
	setTimeout(() => {
		process.on("exit", () => {
			require('child_process').spawn(process.argv.shift(), process.argv, {
				cwd: process.cwd(),
				detached: true,
				stdio: "inherit"
			});
		});
		process.exit();
	}, 3000);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botupdate')
		.setDescription('Admin server program update command through git.'),
	
	async execute(interaction, client) {
		await interaction.reply({ content: 'The server has started updating!', ephemeral: true });
		try {
			await execAwait('git pull origin main --rebase', (e, stdout, stderr) => {
				if (e) {
					console.error(`error: ${e.message}`);
					return;
				}

				if (stderr) {
					console.error(`stderr: ${stderr}`);
					return;
				}
			});
			customModMsg(client, 'Git Update', `<@${interaction.user.id}> just updated the server through \`\`\`git pull origin main\`\`\`. Server is restarting. One moment.`);
			await interaction.editReply('Update successful, restarting now.');
			console.log('[SERVER] Restarting!');
			restartServer();
		} catch (e) {
			console.log('[ERROR] Looks like there was an error updating the server.');
			interaction.editReply('There was an error, please check with the devs.');
			errMsg(client, e);
		}
	},
	preconditions: ['isAdmin']
}
