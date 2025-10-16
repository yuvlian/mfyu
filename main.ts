import { Client, Events, GatewayIntentBits } from "discord.js";
import { TOKEN } from "./token.ts";

if (import.meta.main) {
  const client = new Client({
    intents: [
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });
  client.once(Events.ClientReady, (c) => {
    console.log("Ok connected");
  });
  client.login(TOKEN);
}
