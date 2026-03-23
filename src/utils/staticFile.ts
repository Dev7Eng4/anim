import { staticFile as remotionStaticFile } from "remotion";
import { StaticFileName } from "../types/StaticFile";

export const staticFile = (path: StaticFileName) => {
  return remotionStaticFile(path);
};
