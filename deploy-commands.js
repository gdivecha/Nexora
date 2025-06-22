// ✅ FINAL deploy-commands.js with deduplication logic
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Manually defined commands (converge, crossrole, rolediff)
const manualCommands = [];

const { SlashCommandBuilder } = require('discord.js');

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
manualCommands.push(convergeCommand);

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
manualCommands.push(crossroleCommand);

const rolediffCommand = new SlashCommandBuilder()
  .setName('rolediff')
  .setDescription('Compare role differences between two users')
  .addUserOption(option =>
    option.setName('user1').setDescription('First user').setRequired(true))
  .addUserOption(option =>
    option.setName('user2').setDescription('Second user').setRequired(true));
manualCommands.push(rolediffCommand);

// Load all command files from /commands directory
const folderCommands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data && typeof command.data.toJSON === 'function') {
    // Skip if already manually defined (to avoid duplicates)
    if (!manualCommands.some(c => c.name === command.data.name)) {
      folderCommands.push(command.data);
    } else {
      console.warn(`⚠️ Skipped duplicate command: ${command.data.name}`);
    }
  } else {
    console.warn(`⚠️ Invalid command file: ${file}`);
  }
}

// Combine manual and folder-based commands
const allCommands = [...manualCommands, ...folderCommands].map(cmd => cmd.toJSON());

// Deploy to Discord
(async () => {
  const { DISCORD_CLIENT_ID, DISCORD_GUILD_ID, DISCORD_TOKEN } = process.env;

  if (!DISCORD_CLIENT_ID || !DISCORD_GUILD_ID || !DISCORD_TOKEN) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  try {
    console.log(`🔁 Deploying ${allCommands.length} slash command(s) to guild ${DISCORD_GUILD_ID}...`);
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      { body: allCommands }
    );
    console.log(`✅ Successfully deployed slash commands.`);
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
})();