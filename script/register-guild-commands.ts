import { REST, Routes } from 'discord.js';

import 'dotenv/config';

import { commands } from '../src/command/index.js';

// Create a new REST client
const client = new REST().setToken(process.env.DISCORD_TOKEN || 'INVALID');

// Transform the commands into a format that the API can understand
const commandsJSON = commands.map(command => command.options.toJSON());

// Register the commands
console.log(`Registering ${commandsJSON.length} commands...`);
client
  .put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_CLIENT_ID || 'INVALID',
      process.env.DISCORD_GUILD_ID || 'INVALID',
    ),
    { body: commandsJSON },
  )
  .then(() => console.log('Successfully registered commands!'))
  .catch(console.error);
