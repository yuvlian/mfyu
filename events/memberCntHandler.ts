import { Events, GuildMember } from "discord.js";
import {
  ABOUT_SERVER_CHANNEL_ID,
  RULES_CHANNEL_ID,
  WELCOME_CHANNEL_ID,
} from "../ids.ts";

export const event1 = {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    try {
      const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
      if (!channel || !channel.isTextBased()) {
        console.error("aint no welcome channel mf");
        return;
      }
      const greetingMessage =
        `welkom <@${member.id}> ke **${member.guild.name}**!\n` +
        `kamu adlh member ke-${member.guild.memberCount} lho!\n` +
        `jgn lupa cek <#${RULES_CHANNEL_ID}> dan <#${ABOUT_SERVER_CHANNEL_ID}>`;
      await channel.send(greetingMessage);
    } catch (error) {
      console.error(error);
    }
  },
};

export const event2 = {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember) {
    try {
      const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
      if (!channel || !channel.isTextBased()) {
        console.error("aint no welcome channel mf");
        return;
      }
      const leaveMessage = `dadah <@${member.id}> (${member.user.tag}).\n` +
        `skrg sisa ${member.guild.memberCount} member...`;
      await channel.send(leaveMessage);
    } catch (error) {
      console.error(error);
    }
  },
};
