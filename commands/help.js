const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows details about each available role utility command.'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🛠 Nexora Role Utility Help Menu')
      .setDescription('Here’s a breakdown of all available commands and how to use them.')
      .setColor(0x5865F2)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        {
          name: '🔁 /converge',
          value: `**Purpose:** Find and optionally ping users who have **multiple** roles.
**Parameters:**
- \`ping\` *(required)*: Whether to ping the users ("yes" or "no").
- \`role1, role2, ...\`: Up to 12 roles to match against.
**Logic:** Only users who have **all** selected roles are returned.
**Example:**
\`/converge ping: yes role1: Designers role2: Mentors\``
        },
        { name: '\u200B', value: '\u200B' },
        {
          name: '🔍 /crossrole',
          value: `**Purpose:** Find users who have **any** of the selected roles.
**Parameters:**
- \`role1, role2, ...\`: At least 2 and up to 10 roles.
**Logic:** Returns users who have **at least one** of the specified roles.
**Example:**
\`/crossrole role1: Backend role2: DevOps\``
        },
        { name: '\u200B', value: '\u200B' },
        {
          name: '📊 /rolediff',
          value: `**Purpose:** Compare the role differences between two users.
**Parameters:**
- \`user1\` *(required)*: First user to compare.
- \`user2\` *(required)*: Second user to compare.
**Output:** Shows roles **only user1** has, **only user2** has, and roles they **both share**.
**Example:**
\`/rolediff user1: @Alice user2: @Bob\``
        },
        { name: '\u200B', value: '\u200B' }
      )
      .setFooter({ text: 'Use these commands to manage and analyze community roles with precision.' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};