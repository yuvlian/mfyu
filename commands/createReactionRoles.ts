import {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { ADMIN_ROLE_ID, GAME_ROLE_IDS, GUILD_ID } from "../ids.ts";
import { KV } from "../kv.ts";

export const command = {
  data: new SlashCommandBuilder()
    .setName("reactrolesmsg")
    .setDescription("Buat pesan ambil role game")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const member = interaction.member;
    const channel = interaction.channel as TextChannel | null;

    if (!guild || guild.id !== GUILD_ID) {
      return interaction.editReply({
        content: "Salah server njing",
      });
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
      const rolesText = Object.entries(GAME_ROLE_IDS)
        .map(
          ([game, data]) => `- ${data.reactEmoji} -> **${game.toUpperCase()}**`,
        )
        .join("\n");

      const msg = await channel.send({
        content: "**Ambil role game biar bisa di tag buat mabar!**\n\n" +
          "React dgn emoji utk game yg lu mainin:\n" +
          rolesText,
      });

      for (const game of Object.values(GAME_ROLE_IDS)) {
        await msg.react(game.reactEmoji);
      }

      await KV.set(["rxRolesMsgId_game"], msg.id);

      const cs2Tiers = GAME_ROLE_IDS.cs2.tiers!;
      const cs2Text = Object.values(cs2Tiers)
        .map((tier) => `- ${tier.reactEmoji} -> ${tier.description}`)
        .join("\n");

      const cs2Msg = await channel.send({
        content: "**Tier role buat CS2**\n\n" +
          "React sesuai tier lu bang:\n" +
          cs2Text,
      });

      for (const tier of Object.values(cs2Tiers)) {
        await cs2Msg.react(tier.reactEmoji);
      }

      await KV.set(["rxRolesMsgId_cs2Tier"], cs2Msg.id);

      const mlbbTiers = GAME_ROLE_IDS.mlbb.tiers!;
      const mlbbText = Object.values(mlbbTiers)
        .map((tier) => `- ${tier.reactEmoji} -> ${tier.description}`)
        .join("\n");

      const mlbbMsg = await channel.send({
        content: "**Tier role buat MLBB**\n\n" +
          "React sesuai rank lu bang:\n" +
          mlbbText,
      });

      for (const tier of Object.values(mlbbTiers)) {
        await mlbbMsg.react(tier.reactEmoji);
      }

      await KV.set(["rxRolesMsgId_mlbbTier"], mlbbMsg.id);

      await interaction.editReply({
        content: "done banh",
      });
    } catch (error) {
      await interaction.editReply({
        content: `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  },
};
