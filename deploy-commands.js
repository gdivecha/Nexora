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

// Add optional roles role3 to role12
for (let i = 3; i <= 12; i++) {
  convergeCommand.addRoleOption(option =>
    option.setName(`role${i}`).setDescription(`Optional role ${i}`).setRequired(false));
}

// --- Final command list ---
const commands = [
  convergeCommand
  // Add other commands like rolediff or crossrole here
  // .addCommand(anotherCommand)
].map(cmd => cmd.toJSON());

// --- Register commands ---
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(
  Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
  { body: commands }
)
  .then(() => console.log('✅ Slash command(s) registered.'))
  .catch(console.error);