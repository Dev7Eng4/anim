// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

import fs from "fs";
import path from "path";

// Normalize project root to fix "multiple modules with names that only differ in casing" on Windows
const projectRoot =
  typeof fs.realpathSync.native === "function"
    ? fs.realpathSync.native(process.cwd())
    : fs.realpathSync(process.cwd());

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency("100%"); // Spins up multiple Chrome instances (cores) to render multiple frames in parallel

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind({
    ...currentConfiguration,
    context: projectRoot,
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...(currentConfiguration.resolve?.alias ?? {}),
        "@": path.join(projectRoot, "src"),
      },
    },
  });
});
