// 📁 index.js — Main bot logic + self-ping server

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// === Discord Bot Setup ===
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[WARNING] Skipped loading ${file} (missing 'data' or 'execute')`);
  }
}

client.once('ready', () => {
  console.log(`✅ ${client.user.tag} is online.`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error running command ${interaction.commandName}:`, error);
    await interaction.reply({
      content: '❌ There was an error executing this command.',
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_TOKEN);

// === Self-Ping System (Prevents Sleep on Glitch) ===
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Self-ping server running on port ${PORT}`);
});

// Ping the server every 4 minutes to prevent Glitch sleep
setInterval(() => {
  const fetch = require('node-fetch');
  fetch(process.env.SELF_PING_URL)
    .then(res => console.log('🔁 Self-ping successful'))
    .catch(err => console.error('❌ Self-ping failed:', err));
}, 240000); // 4 minutes