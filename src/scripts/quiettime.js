const { guildId, quietTime: quietTimeConfig } = require("../config.json");
const { PermissionsBitField } = require('discord.js');
const { errMsg, modMsg } = require('../dev.js');

// strings that hold the names of the on and off permissions for quiet time
const onPermissions  = ['ReadMessageHistory', 'AddReactions', 'ViewChannel', 'ChangeNickname'];
const offPermissions = ['ReadMessageHistory', 'AddReactions', 'ViewChannel', 'SendMessages', 'EmbedLinks', 'AttachFiles', 'Connect', 'Speak', 'ChangeNickname', 'UseApplicationCommands', 'RequestToSpeak', 'CreatePublicThreads', 'Stream'];

function quietTime(client, on) {
	let tempPerms = [];
	if (on) {
		for (let i of onPermissions) {
			tempPerms.push(PermissionsBitField[i]);
		}

		client.guilds.cache.get(guildId).roles.everyone.setPermissions(tempPerms)
		.then()
		.catch(errMsg);
	} else {
		for (let i of onPermissions) {
			tempPerms.push(PermissionsBitField[i]);
		}

		client.guilds.cache.get(guildId).roles.everyone.setPermissions(tempPerms)
		.then()
		.catch(errMsg);
	}
	
	modMsg(client, "Quiet Time", "Quiet time has been toggled.");
}

module.exports = {
	ready: function (client) {
		let startTimes = []; // times where quiet time should be enabled
		let stopTimes = []; // checks when quiet time should be disables
		
		// runs through all of the times in config
		// checks if that time has already passed on the current day. 
		// if that is the case, moves that time a day in advance so that it can still be used
		for (const times of quietTimeConfig.times) {
			let today = new Date()
			let parsedTime = Date.parse(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${times[0]}:${today.getSeconds()}-07:00`);
			if ((parsedTime - today.getTime()) <= 0) {
				startTimes.push(parsedTime + (8.64e+7));
			} else {
				startTimes.push(parsedTime);
			}
			
			// does the same as stated above, but with the stop times
			parsedTime = Date.parse(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${times[1]}:${today.getSeconds()}-07:00`);
			if ((parsedTime - today.getTime()) <= 0) {
				stopTimes.push(parsedTime + (8.64e+7));
			} else {
				stopTimes.push(parsedTime);
			}

		}

		// does a check for the start and disable times every 30 seconds
		// with the way that the system is designed, the time delay will not matter
		setInterval(() => {
			for (const time of startTimes) {
				if (Date.now() >= time) {
					quietTime(client, true);
					startTimes[startTimes.indexOf(time)] = time + 8.64e+7;
				}
			}
			
			for (const time of stopTimes) {
				if (Date.now() >= time) {
					quietTime(client, false);
					stopTimes[stopTimes.indexOf(time)] = time + 8.64e+7;
				}
			}
		}, 15000);
	},
	quietTime
}
