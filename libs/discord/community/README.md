# Discord Community

Provides slash commands access returning templated messages from the `@supremegaming/discord/templates` lib.

## Features

### Game Info

| Module | Command | Description |
|---|---|---|
| `ArkInfoDiscordModule` | `/ark` | Help info related to Ark: Survival Evolved |
| `AtlasInfoDiscordModule` | `/atlas` | Help info related to Atlas |
| `ConanInfoDiscordModule` | `/conan` | Help info related to Conan Exiles |

### Support

| Module | Trigger | Description |
|---|---|---|
| `GeneralHelpDiscordModule` | `/help` | General info on how to use Supreme Bot |
| `DonateDiscordModule` | `/donate` | Donation methods and perks |
| `NewMemberDiscordModule` | `guildMemberAdd` event | Sends a welcome message when a new member joins |
| `RoleAssignmentDiscordModule` | Emoji reactions | Adds/removes game roles based on reactions in the roles channel |

### Miscellaneous

| Module | Command | Description |
|---|---|---|
| `FunDiscordModule` | `/random` | Random fun commands |
