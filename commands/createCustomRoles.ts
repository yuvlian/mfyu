import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { ADMIN_ROLE_ID, GUILD_ID } from "../ids.ts";
import { KV } from "../kv.ts";

export const command = {
  data: new SlashCommandBuilder()
    .setName("customrolesmsg")
    .setDescription("Buat pesan untuk bikin role custom")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const member = interaction.member;
    const channel = interaction.channel as TextChannel | null;

    if (!guild || guild.id !== GUILD_ID) {
      return interaction.editReply({ content: "Salah server njing" });
    }

    if (!channel) {
      return interaction.editReply({
        content: "Command harus di text channel",
      });
    }

    if (
      !member ||
      !("roles" in member) ||
      !member.roles.cache.has(ADMIN_ROLE_ID)
    ) {
      return interaction.editReply({ content: "Gak boleh" });
    }

    try {
      const button = new ButtonBuilder()
        .setCustomId("btn_create_custom_role")
        .setLabel("Buat Role Custom")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

      const msg = await channel.send({
        content: "Klik tombol di bawah untuk buat role custom kamu!",
        components: [row],
      });

      await KV.set(["cusRoleMsgId"], msg.id);

      await interaction.editReply({ content: "udah banh" });
    } catch (error) {
      await interaction.editReply({
        content: `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  },
};
