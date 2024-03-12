import { SlashCommandBuilder } from 'discord.js';
import type { SlashCommand } from './index.js';

const ping: SlashCommand = {
  options: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Keeping things going'),
  callback: async interaction => {
    await interaction.reply(
      `Pong! (${Math.abs(Date.now() - interaction.createdTimestamp)}ms)`,
    );
  },
};

export default ping;
