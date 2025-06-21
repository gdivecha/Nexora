const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('converge')
    .setDescription('Find and optionally ping users with multiple roles')
    .addBooleanOption(option =>
      option.setName('ping').setDescription('Ping matched users?').setRequired(true))
    .addRoleOption(option =>
      option.setName('role1').setDescription('First required role').setRequired(true))
    .addRoleOption(option =>
      option.setName('role2').setDescription('Second required role').setRequired(true))
    .addRoleOption(option =>
      option.setName('role3').setDescription('Optional role 3').setRequired(false))
    .addRoleOption(option =>
      option.setName('role4').setDescription('Optional role 4').setRequired(false))
    .addRoleOption(option =>
      option.setName('role5').setDescription('Optional role 5').setRequired(false))
    .addRoleOption(option =>
      option.setName('role6').setDescription('Optional role 6').setRequired(false))
    .addRoleOption(option =>
      option.setName('role7').setDescription('Optional role 7').setRequired(false))
    .addRoleOption(option =>
      option.setName('role8').setDescription('Optional role 8').setRequired(false))
    .addRoleOption(option =>
      option.setName('role9').setDescription('Optional role 9').setRequired(false))
    .addRoleOption(option =>
      option.setName('role10').setDescription('Optional role 10').setRequired(false))
    .addRoleOption(option =>
      option.setName('role11').setDescription('Optional role 11').setRequired(false))
    .addRoleOption(option =>
      option.setName('role12').setDescription('Optional role 12').setRequired(false)),

  async execute(interaction) {
    await interaction.guild.members.fetch();

    const roleObjects = [];
    for (let i = 1; i <= 12; i++) {
      const role = interaction.options.getRole(`role${i}`);
      if (role) roleObjects.push(role);
    }

    const shouldPing = interaction.options.getBoolean('ping');

    if (roleObjects.length < 2) {
      return interaction.reply({ content: '❌ You must provide at least two roles.', ephemeral: true });
    }

    const roleIds = roleObjects.map(role => role.id);
    const roleNames = roleObjects.map(role => `• ${role.name}`);

    const matches = interaction.guild.members.cache.filter(member =>
      roleIds.every(id => member.roles.cache.has(id))
    );

    if (matches.size === 0) {
      return interaction.reply('😕 No users found with all those roles.');
    }

    let content = `🏷️ ${roleObjects.length} Roles you selected:\n${roleNames.join('\n')}\n\n👥 Members with all ${roleObjects.length} roles:\n`;

    if (shouldPing) {
      const mentions = matches.map(m => `<@${m.id}>`).join(' ');
      content += mentions;
    } else {
      const list = matches.map(m => `• ${m.user.tag}`).join('\n');
      content += list;
    }

    return interaction.reply({
      content,
      allowedMentions: { users: shouldPing ? matches.map(m => m.id) : [] }
    });
  }
};