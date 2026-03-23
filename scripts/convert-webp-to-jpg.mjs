#!/usr/bin/env node
/**
 * Convert tất cả file .webp trong public/comic sang .jpg
 * Remotion gặp EncodingError khi decode WebP trong quá trình render video
 */
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMIC_DIR = join(__dirname, "..", "public", "comic");

async function findWebpFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await findWebpFiles(fullPath, files);
    } else if (entry.name.endsWith(".webp")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function convertFile(webpPath) {
  const jpgPath = webpPath.replace(/\.webp$/i, ".jpg");
  try {
    await sharp(webpPath).jpeg({ quality: 90 }).toFile(jpgPath);
    console.log(`  ✓ ${webpPath.replace(COMIC_DIR, "")} → .jpg`);
    return true;
  } catch (err) {
    console.error(`  ✗ ${webpPath}:`, err.message);
    return false;
  }
}

async function main() {
  console.log("Đang tìm file .webp trong public/comic/...\n");
  const webpFiles = await findWebpFiles(COMIC_DIR);
  if (webpFiles.length === 0) {
    console.log("Không có file .webp nào.");
    return;
  }
  console.log(`Tìm thấy ${webpFiles.length} file .webp. Đang chuyển sang .jpg...\n`);
  let ok = 0;
  for (const fp of webpFiles) {
    if (await convertFile(fp)) ok++;
  }
  console.log(`\nHoàn thành: ${ok}/${webpFiles.length} file đã chuyển sang .jpg`);
}

main().catch(console.error);
