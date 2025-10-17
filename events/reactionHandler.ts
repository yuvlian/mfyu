import {
  Events,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { KV } from "../kv.ts";
import { GAME_ROLE_IDS } from "../ids.ts";

export const event = {
  name: Events.MessageReactionAdd,
  async execute(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    await handleReaction(reaction, user, true);
  },
};

export const event2 = {
  name: Events.MessageReactionRemove,
  async execute(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    await handleReaction(reaction, user, false);
  },
};

async function handleReaction(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  add: boolean,
) {
  if (user.bot) return;
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch {
      return;
    }
  }

  const emoji = reaction.emoji.name;
  if (!emoji) return;

  const msg = reaction.message;
  const guild = msg.guild;
  if (!guild) return;

  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member) return;

  try {
    const [mainMsg, cs2Msg, mlbbMsg] = await Promise.all([
      KV.get(["rxRolesMsgId_game"]),
      KV.get(["rxRolesMsgId_cs2Tier"]),
      KV.get(["rxRolesMsgId_mlbbTier"]),
    ]);

    const msgId = msg.id;
    let roleId: string | null = null;

    if (msgId === mainMsg.value) {
      for (const game of Object.values(GAME_ROLE_IDS)) {
        if (emoji === game.reactEmoji) {
          roleId = game.player;
          break;
        }
      }
    }

    if (msgId === cs2Msg.value) {
      const tiers = GAME_ROLE_IDS.cs2.tiers;
      if (tiers) {
        for (const t of Object.values(tiers)) {
          if (emoji === t.reactEmoji) {
            roleId = t.id;
            break;
          }
        }
      }
    }

    if (msgId === mlbbMsg.value) {
      const tiers = GAME_ROLE_IDS.mlbb.tiers;
      if (tiers) {
        for (const t of Object.values(tiers)) {
          if (emoji === t.reactEmoji) {
            roleId = t.id;
            break;
          }
        }
      }
    }

    if (!roleId) return;

    const hasRole = member.roles.cache.has(roleId);

    if (add) {
      if (!hasRole) {
        await member.roles.add(roleId);
      }
    } else {
      if (hasRole) {
        await member.roles.remove(roleId);
      }
    }
  } catch (error) {
    try {
      await user.send(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } catch {
      await msg.channel.send(
        `<@${user.id}> gagal ${
          add ? "nambah" : "hapus"
        } role banh, coba lagi atau kontak admin`,
      );
    }
  }
}
