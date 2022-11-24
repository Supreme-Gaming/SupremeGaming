# Discord Client Bootstrapper

Utility class that reduces the amount of boilerplate required for a discord bot. It implements a lifecycle that enables feature modules to execute event handler registrations as needed.

## Using

Import the bootstrapping class;

`import { DiscordClientBootstrapper } from '@supremegaming/discord/bootstrap';`

Create a new instance and provide options and feature modules:

```js

const client = new DiscordClientBootstrapper({
  client: {...anyNativeDiscordClientOptions} // Such as intents and partials
  modules: [...ListOfFeatureModules],
  options: {
    guildId: 'valid-guild-id',
    clientToken: 'valid-client-token',
    clientId: 'valid-client-id',
  },
})
```

## Configuration

`client` options represents an object with any number of valid discord.js `ClientOptions`.

`modules` is a collection of feature modules that implement the `DiscordFeatureModule` class which enables them to inherit the blueprint and lifecycle events where logic is executed.

`options` represents an object with basic required options for most all bots. See the Discord Developer Portal for information on getting your own client token and client/bot id.

## Feature Modules

To create a feature module, simply create a class that extends the `DiscordFeatureModule` exported from the same library entry point. The `DiscordFeatureModule` implements lifecycle events that can be used to insert logic into a feature module (such as registering event handlers).

```js
class CustomDiscordFeatureModule implements SlashCommands, OnMessageCreate {
  public commands(): SlashCommandTypes {
    return // Create and return slash commands here.
  }

  public clientOnMessageCreate(message: Message<boolean>): void | Promise<void> {
   // Do stuff here when discord client receives a message.
  }
}
```

This feature module can then be included in the `modules` array of the `DiscordClientBootstrapper` class.

The supported lifecycle events and methods are:

- `OnReady`
  - Method: `clientOnReady()`
- `OnInteractionCreate`
  - Method: `clientOnInteractionCreate()`
- `OnGuildMemberAdd`
  - Method: `clientOnGuildMemberAdd()`
- `OnMessageReactionAdd`
  - Method: `clientOnMessageReactionAdd`
- `OnMessageReactionRemove`
  - Method: `clientOnMessageReactionRemove`
- `OnMessageCreate`
  - Method: `clientOnMessageCreate()`
- `OnMessageUpdate`
  - Method: `clientOnMessageUpdate()`
- `OnMessageDelete`
  - Method: `clientOnMessageDelete()`
- `OnError`
  - Method: `clientOnError()`
- `OnWarn`
  - Method: `clientOnWarn()`
- `SlashCommands`
  - Method: `commands()`
