// ✅ Updated deploy-commands.js with converge, crossrole, and rolediff
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// --- Define /converge command ---
const convergeCommand = new SlashCommandBuilder()
  .setName('converge')
  .setDescription('Find and optionally ping users with multiple roles')
  .addBooleanOption(option =>
    option.setName('ping').setDescription('Ping matched users?').setRequired(true))
  .addRoleOption(option =>
    option.setName('role1').setDescription('First required role').setRequired(true))
  .addRoleOption(option =>
    option.setName('role2').setDescription('Second required role').setRequired(true));

for (let i = 3; i <= 12; i++) {
  convergeCommand.addRoleOption(option =>
    option.setName(`role${i}`).setDescription(`Optional role ${i}`).setRequired(false));
}

// --- Define /crossrole command ---
const crossroleCommand = new SlashCommandBuilder()
  .setName('crossrole')
  .setDescription('Find users with ANY of the selected roles')
  .addRoleOption(option =>
    option.setName('role1').setDescription('First required role').setRequired(true))
  .addRoleOption(option =>
    option.setName('role2').setDescription('Second required role').setRequired(true));

for (let i = 3; i <= 10; i++) {
  crossroleCommand.addRoleOption(option =>
    option.setName(`role${i}`).setDescription(`Optional role ${i}`).setRequired(false));
}

// --- Define /rolediff command ---
const rolediffCommand = new SlashCommandBuilder()
  .setName('rolediff')
  .setDescription('Compare role differences between two users')
  .addUserOption(option =>
    option.setName('user1').setDescription('First user').setRequired(true))
  .addUserOption(option =>
    option.setName('user2').setDescription('Second user').setRequired(true));

// --- Register all commands ---
const commands = [convergeCommand, crossroleCommand, rolediffCommand].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(
  Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
  { body: commands }
)
  .then(() => console.log('✅ Slash commands registered.'))
  .catch(console.error);