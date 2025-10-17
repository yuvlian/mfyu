import { Snowflake } from "discord.js";

export type GameName = "mlbb" | "cs2" | "roblox";

interface TierInfo {
  id: Snowflake;
  description: string;
  reactEmoji: string;
}

interface GameRole {
  player: Snowflake;
  reactEmoji: string;
  tiers?: Record<string, TierInfo>;
}

export const GAME_ROLE_IDS: Record<GameName, GameRole> = {
  mlbb: {
    player: "1428263042168131725",
    reactEmoji: "🐖",
    tiers: {
      "0": {
        id: "1428656974718959717",
        description: "Untuk Legend ke atas",
        reactEmoji: "🟡",
      },
      "1": {
        id: "1428657880805933117",
        description: "Untuk Epic ke bawah",
        reactEmoji: "🟢",
      },
    },
  },
  cs2: {
    player: "1428261326366572544",
    reactEmoji: "🍆",
    tiers: {
      "0": {
        id: "1428263245528957051",
        description: "Untuk Premier point 15k ke atas",
        reactEmoji: "🔴",
      },
      "1": {
        id: "1428263103975391265",
        description: "Untuk Premier point 15k ke bawah",
        reactEmoji: "🔵",
      },
    },
  },
  roblox: {
    player: "1428263292534788236",
    reactEmoji: "🤓",
    tiers: undefined,
  },
};

export const ADMIN_ROLE_ID = "1422941237710815377";
export const GUILD_ID = "1422932645393989683";
export const BOT_ID = "1313062535548764202";
export const WELCOME_CHANNEL_ID = "1428258878205726750";
export const RULES_CHANNEL_ID = "1422937063962972210";
export const ABOUT_SERVER_CHANNEL_ID = "1422936267267637339";
export const ALREADY_CUSROLE_ROLE_ID = "1428687993895391362";
