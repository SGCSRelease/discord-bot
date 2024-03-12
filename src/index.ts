import { Client, GatewayIntentBits } from 'discord.js';

import { ping } from './command';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.once('ready', () => {
  console.log('Ready!');
});
