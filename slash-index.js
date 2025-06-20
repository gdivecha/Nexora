const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.GuildMember]
});

client.once('ready', () => {
  console.log(`✅ ${client.user.tag} is online with enhanced multi-role support!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'converge') return;

  await interaction.guild.members.fetch();

  const roleIds = [];
  for (let i = 1; i <= 12; i++) {
    const role = interaction.options.getRole(`role${i}`);
    if (role) roleIds.push(role.id);
  }

  const shouldPing = interaction.options.getBoolean('ping');

  if (roleIds.length < 2) {
    return interaction.reply({ content: '❌ You must provide at least two roles.', ephemeral: true });
  }

  const matches = interaction.guild.members.cache.filter(member =>
    roleIds.every(id => member.roles.cache.has(id))
  );

  if (matches.size === 0) {
    return interaction.reply('😕 No users found with all those roles.');
  }

  let content = `👥 Members with all ${roleIds.length} roles:`;

  if (shouldPing) {
    const mentions = matches.map(m => `<@${m.id}>`).join(' ');
    content += ` ${mentions}`;
  } else {
    const list = matches.map(m => `• ${m.user.tag}`).join('\n');
    content += `\n${list}`;
  }

  return interaction.reply({
    content,
    allowedMentions: { users: shouldPing ? matches.map(m => m.id) : [] }
  });
});

client.login(process.env.DISCORD_TOKEN);