import { Client, Events, GatewayIntentBits } from "discord.js";
import { TOKEN } from "./token.ts";
import {
  event as reactionAdd,
  event2 as reactionRemove,
} from "./events/reactionHandler.ts";
import {
  event1 as memberJoin,
  event2 as memberLeave,
} from "./events/memberCntHandler.ts";
import {
  event as customRoleBtn,
  event2 as customRoleModal,
} from "./events/customRoleHandler.ts";
import { command as reactRolesCmd } from "./commands/createReactionRoles.ts";
import { command as customRolesCmd } from "./commands/createCustomRoles.ts";

if (import.meta.main) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMembers,
    ],
    partials: [
      "MESSAGE",
      "CHANNEL",
      "REACTION",
    ],
  });

  client.once(Events.ClientReady, (c) => {
    console.log(`redi bos: ${c.user.tag}`);
  });

  // --- EVENTS ---
  client.on(reactionAdd.name, reactionAdd.execute);
  client.on(reactionRemove.name, reactionRemove.execute);
  client.on(memberJoin.name, memberJoin.execute);
  client.on(memberLeave.name, memberLeave.execute);
  client.on(customRoleBtn.name, customRoleBtn.execute);
  client.on(customRoleModal.name, customRoleModal.execute);

  // --- SLASH COMMANDS ---
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
      if (interaction.commandName === reactRolesCmd.data.name) {
        await reactRolesCmd.execute(interaction, client);
      } else if (interaction.commandName === customRolesCmd.data.name) {
        await customRolesCmd.execute(interaction, client);
      }
    } catch (error) {
      console.error("error executing command:", error);
      const reply = {
        content: "error executing command",
        ephemeral: true,
      };
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  });

  await client.login(TOKEN);
}
