export enum CARD_DIMENSION {
  CARD_WIDTH = 628,
  CARD_HEIGHT = 1080,
  CARD_HEIGHT_SHORT = 1920,
  GAP = 18,
}

export type ChannelType = "anime" | "comic" | "naruto" | "one-piece";

export const ChannelTypeColors: Record<ChannelType, string> = {
  // anime: "linear-gradient(to bottom, #cc95e2 0%, #8B5CF6 50%, #bc13fe 100%)",
  anime: "#9757c5",
  // comic: "linear-gradient(to bottom, #E82E2E 0%, #B00B0B 50%, #750000 100%)",
  comic: "#8A0000",
  naruto: "#8A0000",
  "one-piece": "#2e0808",
};
