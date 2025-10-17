import { REST, Routes } from "discord.js";
import { BOT_ID, GUILD_ID } from "./ids.ts";
import { TOKEN } from "./token.ts";
import { command as reactRolesCommand } from "./commands/createReactionRoles.ts";
import { command as customRolesCommand } from "./commands/createCustomRoles.ts";

const commands = [
  reactRolesCommand.data.toJSON(),
  customRolesCommand.data.toJSON(),
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function refreshCommands() {
  try {
    await rest.put(
      Routes.applicationGuildCommands(BOT_ID, GUILD_ID),
      { body: [] },
    );
    await rest.put(
      Routes.applicationGuildCommands(BOT_ID, GUILD_ID),
      { body: commands },
    );
    console.log("dah di refresh banh");
  } catch (error) {
    console.error("mampus: ", error);
  }
}

if (import.meta.main) {
  await refreshCommands();
}

export { refreshCommands };
