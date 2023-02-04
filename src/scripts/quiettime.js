const { guildId, quietTime: quietTimeConfig } = require("../config.json");
const { PermissionsBitField } = require('discord.js');
const { errMsg, modMsg } = require('../dev.js');

function quietTime(client, on) {
	if (on) {
		client.guilds.cache.get(guildId).roles.everyone.setPermissions(
			[
				PermissionsBitField.Flags.ReadMessageHistory,
				PermissionsBitField.Flags.AddReactions,
				PermissionsBitField.Flags.ViewChannel,
				PermissionsBitField.Flags.ChangeNickname,
			]
		).then()
		.catch(errMsg);
	} else {
		client.guilds.cache.get(guildId).roles.everyone.setPermissions(
			[
				PermissionsBitField.Flags.ReadMessageHistory,
				PermissionsBitField.Flags.AddReactions,
				PermissionsBitField.Flags.ViewChannel,
				PermissionsBitField.Flags.SendMessages,
				PermissionsBitField.Flags.EmbedLinks,
				PermissionsBitField.Flags.AttachFiles,
				PermissionsBitField.Flags.Connect,
				PermissionsBitField.Flags.Speak,
				PermissionsBitField.Flags.ChangeNickname,
				PermissionsBitField.Flags.UseApplicationCommands,
				PermissionsBitField.Flags.RequestToSpeak,
				PermissionsBitField.Flags.CreatePublicThreads,
				PermissionsBitField.Flags.Stream
			]
		).then()
		.catch(errMsg);
	}
	
	modMsg(client, "Quiet Time", "Quiet time has been toggled.");
}

module.exports = {
	ready: function (client) {
		client.vars.startTimes = []; // times where quiet time should be enabled
		client.vars.stopTimes = []; // checks when quiet time should be disables
		
		// runs through all of the times in config
		// checks if that time has already passed on the current day. 
		// if that is the case, moves that time a day in advance so that it can still be used
		for (const times of quietTimeConfig.times) {
			let today = new Date()
			let parsedTime = Date.parse(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${times[0]}:${today.getSeconds()}-07:00`);
			if ((parsedTime - today.getTime()) <= 0) {
				client.vars.startTimes.push(parsedTime + (8.64e+7));
			} else {
				client.vars.startTimes.push(parsedTime);
			}
			
			// does the same as stated above, but with the stop times
			parsedTime = Date.parse(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${times[1]}:${today.getSeconds()}-07:00`);
			if ((parsedTime - today.getTime()) <= 0) {
				client.vars.stopTimes.push(parsedTime + (8.64e+7));
			} else {
				client.vars.stopTimes.push(parsedTime);
			}

		}

		// does a check for the start and disable times every 30 seconds
		// with the way that the system is designed, the time delay will not matter
		setInterval(() => {
			for (const time of client.vars.startTimes) {
				if (Date.now() >= time) {
					quietTime(client, true);
					client.vars.startTimes[client.vars.startTimes.indexOf(time)] = time + 8.64e+7;
				}
			}
			
			// TODO: looks like quiet time is stuck in a loop. it's probably here, so fix it'
			for (const time of client.vars.stopTimes) {
				if (Date.now() >= time) {
					quietTime(client, false);
					client.vars.startTimes[client.vars.startTimes.indexOf(time)] = time + 8.64e+7;
				}
			}
		}, 30000);
	},
	quietTime
}
