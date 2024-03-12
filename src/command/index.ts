import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from 'discord.js';

import ping from './ping.js';

export const commands = [ping];

export type SlashCommand = {
  options: SlashCommandBuilder;
  callback: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export async function dispatch(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  console.log(interaction);
  const match = commands.find(
    cmd => cmd.options.name === interaction.commandName,
  );

  if (!match) return;

  await match.callback(interaction);
}
