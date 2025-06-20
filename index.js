const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.GuildMember]
});

client.once('ready', () => {
  console.log(`✅ ${client.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!converge') || message.author.bot) return;

  const roleMentions = message.mentions.roles;
  if (roleMentions.size < 2) {
    return message.reply('⚠️ Please mention at least two roles.');
  }

  await message.guild.members.fetch(); // Ensure member cache is populated

  const roleIds = roleMentions.map(r => r.id);
  const matchingMembers = message.guild.members.cache.filter(member =>
    roleIds.every(roleId => member.roles.cache.has(roleId))
  );

  if (matchingMembers.size === 0) {
    return message.reply('😕 No members found with all those roles.');
  }

  const mentions = matchingMembers.map(member => `<@${member.id}>`).join(' ');
  message.channel.send(`👥 Members with all specified roles:\n${mentions}`);
});

client.login(process.env.DISCORD_TOKEN);