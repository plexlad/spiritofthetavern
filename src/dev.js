const { channels } = require("./config.json");

module.exports = {
	errMsg: function(client, content) {
		client.channels.cache.get(channels.err).send({
			embeds: [
				{
					type: "rich",
					title: "Error",
					description: "",
					color: 0xe06c75,
					fields: [
						{
							name: "Error log",
							value: `\`\`\`${content}\`\`\``
						}
					]
				}
			]
		});

		console.error(content);
	},
	modMsg: function(client, description, content) {
		client.channels.cache.get(channels.mod).send({
			embeds: [
				{
					type: "rich",
					title: "Mod Log",
					description: "",
					color: 0x61afef,
					fields: [
						{
							name: description,
							value: content
						}
					]
				}
			]
		});

		console.log(`[BOT] [MOD LOG] ${description}: ${content}`);
	}
}
