// ✅ FINAL commands/crossrole.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crossrole')
    .setDescription('Find users with either of the selected roles')
    .addRoleOption(option =>
      option.setName('role1').setDescription('First role').setRequired(true))
    .addRoleOption(option =>
      option.setName('role2').setDescription('Second role').setRequired(true)),

  async execute(interaction) {
    await interaction.guild.members.fetch();

    const role1 = interaction.options.getRole('role1');
    const role2 = interaction.options.getRole('role2');

    const matches = interaction.guild.members.cache.filter(member =>
      member.roles.cache.has(role1.id) || member.roles.cache.has(role2.id)
    );

    if (matches.size === 0) {
      return interaction.reply('😕 No users found with either of those roles.');
    }

    const roleNames = `• ${role1.name}\n• ${role2.name}`;
    const userList = matches.map(m => `• ${m.user.tag}`).join('\n');

    const content = `🏷️ Roles selected:\n${roleNames}\n\n👥 Users with either of the roles:\n${userList}`;

    return interaction.reply({ content });
  }
};
