import { Client, Events, GatewayIntentBits } from 'discord.js';

import 'dotenv/config';

import { dispatch } from './command/index.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, client => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, interaction => {
  if (interaction.isChatInputCommand()) {
    dispatch(interaction);
  } else {
    console.log(`Unhandled interaction type: ${interaction.type}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
