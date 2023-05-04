# Spirit of the Tavern
Discord bot for the Snow College table top gaming community.

## Getting Started
This is a moderation bot with basic features. To start, download this package and run `src/index.js`. To configure, change values in `config.json`. To see what the configuration does or to see what developers should do, check below.

Normal Features:
 * All values in configuration will be able to be modified using Discord commands by admins.
 * Quiet Time. Disables all channels except for `channelExceptions` during specified `times`.
 * Fully configured Tavern roleplay handling to make moderators lives easier!

Programming Features:
 * Uses a custom made Discord framework to allow for modular commands and features.
 * Add a command using the commands folder!
 * Supports other features, including script triggers and preconditions. 

### Configuration (src/config.json)
 * `DISCORD_TOKEN`: Your discord bot token.
 * `roles`: The IDs of the specified roles. Used for permission.
 	* `mod`: Values for the moderator role.
	* `admin`: Values for the admin role.
 * `quietTime`: Configuration options for the quiet time feature.
	* `times`: Sets of arrays with the assigned quite time values. In format [[startTime, endTime], ...]. Time segments can be unlimited.
 * `guildId`: The ID of the actively maintained guild (server)
 * `clientId`: The client ID of your bot

## Getting Started (for developers)
There are some features that make development very nice and extremely convenient. The majority of features require adding javascript files to predetermined folders. This keeps things organized and modular.

### Commands
To add a new slash command, create a new javascript file in the commands folder. The name does not matter, but is defined with the `data` value.

The new command requires some values in `module.exports`:
 * `data`: A slash command builder that is used by the client.
 * `execute(interaction, client)`: A function that is called when the slash command is called. The client is the original used in your `index.js`, so it will keep all of the assigned variables.
 * `preconditions`: An array that is used for preconditions (check below). Not required.

### Preconditions
Preconditions are used to add special filters to commands by using a function to take data from the client and interaction and returning `true` or `false`. To get started, create a new javascript file in the preconditions folder. The name on this one is important, as there is no `data` attribute. 

The precondition requires a value in `module.exports`:
 * `check(interaction, client)`: This is a function that runs when a precondition when called. Return `true` if you want the the command to go through, false if you want an error message.

### Scripts
Scripts are used to create event handlers in an easy manner. Event handlers are used to trigger a function after certain events have occured. These events are defined in detail in the [Discord.js v14 Events documentation](https://discord.js.org/#/docs/discord.js/main/typedef/Events) and also listed below. In order to get started, create a javascript file in the scripts folder. The name of the file does not matter. In `module.exports`, create an object named after one of the events in the documentation or listed below. You can put as many of these events into one file as needed.

Each of the objects in `module.exports` uses these values:
 * `execute(client)`: The function that will run when the event is called.
 * `once`: A boolean that if the handler should only be run once.

Compatible events: `ApplicationCommandPermissionsUpdate`, `AutoModerationActionExecution`, `AutoModerationActionExecution`, `AutoModerationRuleCreate`, `AutoModerationRuleDelete`, `AutoModerationRuleUpdate`, `CacheSweep`, `ChannelCreate`, `ChannelDelete`, `ChannelPinsUpdate`, `ChannelUpdate`, `ClientReady`, `Debug`, `Error`, `GuildAuditLogEntryCreate`, `GuildBanAdd`, `GuildBanRemove`, `GuildCreate`, `GuildDelete`, `GuildEmojiCreate`, `GuildEmojiDelete`, `GuildEmojiUpdate`, `GuildIntegrationsUpdate`, `GuildMemberAdd`, `GuildMemberAvailable`, `GuildMemberRemove`, `GuildMembersChunk`, `GuildMemberUpdate`, `GuildRoleCreate`, `GuildRoleDelete`, `GuildRoleUpdate`, `GuildScheduledEventUpdate`, `GuildScheduledEventCreate`, `GuildScheduledEventDelete`, `GuildScheduledEventUserAdd`, `GuildScheduledEventUserRemove`, `GuildStickerCreate`, `GuildStickerDelete`, `GuildStickerUpdate`, `GuildUnavailable`, `GuildUpdate`, `InteractionCreate`, `Invalidated`, `InviteCreate`, `InviteDelete`, `MessageBulkDelete`, `MessageCreate`, `MessageDelete`, `MessageReactionAdd`, `MessageReactionRemove`, `MessageReactionRemoveAll`, `MessageReactionRemoveEmoji`, `MessageUpdate`, `PresenceUpdate`, `ShardDisconnect`, `ShardError`, `ShardReady`, `ShardReconnecting`, `ShardResume`, `StageInstanceCreate`, `StageInstanceDelete`, `StageInstanceDelete`, `StageInstanceUpdate`, `ThreadCreate`, `ThreadDelte`, `ThreadListSync`, `ThreadMembersUpdate`, `ThreadMemberUpdate`, `ThreadUpdate`, `TypingStart`, `UserUpdate`, `VoiceServerUpdate`, `VoiceStateUpdate`, `Warn`, `WebhooksUpdate`

## Conclusion
If you have any questions, message a developer or member of the presidency on Discord. If there is a feature, issue, or request, please feel free to implement it or message a developer on the Discord.

## Contributions
In progress :)
