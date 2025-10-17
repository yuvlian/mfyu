import {
  ActionRowBuilder,
  Events,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { KV } from "../kv.ts";
import { ALREADY_CUSROLE_ROLE_ID } from "../ids.ts";

export const event = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "btn_create_custom_role") return;
    await handleButton(interaction);
  },
};

export const event2 = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== "modal_create_custom_role") return;
    await handleModal(interaction);
  },
};

async function handleButton(interaction: any) {
  const member = interaction.member;
  if (!member || !("roles" in member)) return;

  if (member.roles.cache.has(ALREADY_CUSROLE_ROLE_ID)) {
    return interaction.reply({
      content:
        "kamu udah pernah bikin cusrole, minta admin (yuvlian) aj klw mau edit",
      ephemeral: true,
    });
  }

  const modal = new ModalBuilder()
    .setCustomId("modal_create_custom_role")
    .setTitle("Buat Role Custom RGB");

  const r = new TextInputBuilder()
    .setMinLength(1)
    .setMaxLength(3)
    .setCustomId("r")
    .setLabel("Merah (0-255)")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Contoh: 255")
    .setRequired(true);

  const g = new TextInputBuilder()
    .setMinLength(1)
    .setMaxLength(3)
    .setCustomId("g")
    .setLabel("Hijau (0-255)")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Contoh: 120")
    .setRequired(true);

  const b = new TextInputBuilder()
    .setMinLength(1)
    .setMaxLength(3)
    .setCustomId("b")
    .setLabel("Biru (0-255)")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Contoh: 0")
    .setRequired(true);

  const rows = [r, g, b].map((i) =>
    new ActionRowBuilder<TextInputBuilder>().addComponents(i)
  );

  await interaction.showModal(modal.addComponents(...rows));
}

async function handleModal(interaction: any) {
  const guild = interaction.guild;
  const member = interaction.member;
  if (!guild || !member || !("roles" in member)) return;

  const r = parseInt(interaction.fields.getTextInputValue("r"));
  const g = parseInt(interaction.fields.getTextInputValue("g"));
  const b = parseInt(interaction.fields.getTextInputValue("b"));

  if ([r, g, b].some((v) => isNaN(v) || v < 0 || v > 255)) {
    return interaction.reply({
      content: "semua angka harus di antara 0 - 255 bang.",
      ephemeral: true,
    });
  }

  const hex = `#${
    ((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()
  }`;

  try {
    const existing = await KV.get(["cusrole_" + hex]);
    let roleId: string;

    if (existing?.value) {
      roleId = existing.value;
    } else {
      const role = await guild.roles.create({
        name: hex,
        color: hex,
        reason: `Custom role oleh ${member.user?.id}`,
      });
      roleId = role.id;
      await KV.set(["cusrole_" + hex], roleId);
    }

    await member.roles.add(roleId);
    await member.roles.add(ALREADY_CUSROLE_ROLE_ID);
    await interaction.reply({
      content: `role dengan warna ${hex} berhasil dikasih ke kamu`,
      ephemeral: true,
    });
  } catch (error) {
    await interaction.reply({
      content: `Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      ephemeral: true,
    });
  }
}
