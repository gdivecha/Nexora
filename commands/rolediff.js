// ✅ FINAL commands/rolediff.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolediff')
    .setDescription('Compare roles between two users')
    .addUserOption(option =>
      option.setName('user1').setDescription('First user').setRequired(true))
    .addUserOption(option =>
      option.setName('user2').setDescription('Second user').setRequired(true)),

  async execute(interaction) {
    const user1 = interaction.options.getUser('user1');
    const user2 = interaction.options.getUser('user2');

    const member1 = await interaction.guild.members.fetch(user1.id);
    const member2 = await interaction.guild.members.fetch(user2.id);

    const roles1 = new Set(member1.roles.cache.map(r => r.name));
    const roles2 = new Set(member2.roles.cache.map(r => r.name));

    const commonRoles = [...roles1].filter(role => roles2.has(role));
    const onlyUser1 = [...roles1].filter(role => !roles2.has(role));
    const onlyUser2 = [...roles2].filter(role => !roles1.has(role));

    let result = `📊 Role Comparison between **${user1.username}** and **${user2.username}**:
`;
    result += `
🔁 Common Roles:
${commonRoles.length ? commonRoles.map(r => `• ${r}`).join('\n') : 'None'}`;
    result += `

👤 Roles only ${user1.username} has:
${onlyUser1.length ? onlyUser1.map(r => `• ${r}`).join('\n') : 'None'}`;
    result += `

👤 Roles only ${user2.username} has:
${onlyUser2.length ? onlyUser2.map(r => `• ${r}`).join('\n') : 'None'}`;

    return interaction.reply({ content: result, ephemeral: false });
  }
};
