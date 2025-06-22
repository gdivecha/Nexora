require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// --- Manually define converge command ---
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

// --- Manually define crossrole command ---
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

// --- Manually define rolediff command ---
const rolediffCommand = new SlashCommandBuilder()
  .setName('rolediff')
  .setDescription('Compare role differences between two users')
  .addUserOption(option =>
    option.setName('user1').setDescription('First user').setRequired(true))
  .addUserOption(option =>
    option.setName('user2').setDescription('Second user').setRequired(true));

// --- Load all commands from /commands folder (like /help, /postjob, etc.) ---
const folderCommands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data && typeof command.data.toJSON === 'function') {
    folderCommands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️ Skipped "${file}" – invalid or missing .data.toJSON()`);
  }
}

// --- Combine manual and folder-based commands ---
const allCommands = [
  convergeCommand.toJSON(),
  crossroleCommand.toJSON(),
  rolediffCommand.toJSON(),
  ...folderCommands
];

// --- Deploy to guild ---
(async () => {
  const { DISCORD_CLIENT_ID, DISCORD_GUILD_ID, DISCORD_TOKEN } = process.env;

  if (!DISCORD_CLIENT_ID || !DISCORD_GUILD_ID || !DISCORD_TOKEN) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  try {
    console.log(`🔁 Deploying ${allCommands.length} slash command(s) to ${DISCORD_GUILD_ID}...`);
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      { body: allCommands }
    );
    console.log(`✅ Successfully deployed all commands: ${commandFiles.map(f => '/' + f.replace('.js', '')).join(', ')}, plus converge/crossrole/rolediff`);
  } catch (err) {
    console.error('❌ Error deploying commands:', err);
  }
})();
