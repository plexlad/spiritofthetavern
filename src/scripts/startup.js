module.exports = {
	ClientReady: {
		execute: function (client) {
			console.log(`[BOT] Spirit is logged in as ${client.user.username}`);
		},

		once: true,
	}
}
