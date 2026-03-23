const fs = require("fs");

const content = fs.readFileSync(
  "b:/youtube/create_anim-video/src/videos/group-chat/naruto/if naruto joined the akatsuki.ts",
  "utf8",
);

// Primitive parser for this specific format
const messagesMatch = content.match(/\[([\s\S]*)\];/);
if (!messagesMatch) {
  process.exit(1);
}

const rawMessagesText = messagesMatch[1];
const messageBlocks = rawMessagesText.split(/\{([\s\S]*?)\}/g);

const messages = [];
let currentSenderColors = {
  Deidara: "#E09F3E",
  Obito: "#EB5E28",
  Hidan: "#7D7D7D",
  Kakuzu: "#335C67",
  Zetsu: "#588157",
  Pain: "#9E2A2B",
  Itachi: "#D00000",
  Konan: "#A663CC",
  Naruto: "#FB8B24",
};

const processedMessages = [];
let currentTime = new Date();
currentTime.setHours(12, 0, 0, 0);

// Group indices are odd because split with capture group
for (let i = 1; i < messageBlocks.length; i += 2) {
  const block = messageBlocks[i];
  const senderMatch = block.match(/sender:\s*"(.*?)"/);
  const textMatch = block.match(/text:\s*"(.*?)"/);
  const actionMatch = block.match(/action:\s*"(.*?)"/);

  if (!textMatch) continue;

  const sender = senderMatch ? senderMatch[1] : "";
  const text = textMatch[1].replace(/\\"/g, '"');
  const action = actionMatch ? actionMatch[1] : undefined;

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const time = wordCount < 5 ? 2 : 4;

  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const sendTime = `${hours}:${minutes}`;

  const avatar = sender ? `staticFile("chat/avatar/${sender}.jpg")` : '""';
  const textColor = sender
    ? currentSenderColors[sender] || "#ffffff"
    : "#ffffff";

  processedMessages.push({
    sender,
    text: text.replace(/"/g, '\\"'),
    sendTime,
    action,
    time,
    avatar,
    textColor,
  });

  currentTime.setMinutes(currentTime.getMinutes() + 1);
}

let output = `import { staticFile } from "remotion";\n\nconst messages: {\n  sender: string;\n  text: string;\n  sendTime: string;\n  action?: "left" | "joined" | "invite";\n  time: number;\n  avatar: string;\n  textColor: string;\n}[] = [\n`;

processedMessages.forEach((msg) => {
  output += `  {\n`;
  output += `    sender: "${msg.sender}",\n`;
  output += `    text: "${msg.text}",\n`;
  output += `    sendTime: "${msg.sendTime}",\n`;
  if (msg.action) output += `    action: "${msg.action}",\n`;
  output += `    time: ${msg.time},\n`;
  output += `    avatar: ${msg.avatar},\n`;
  output += `    textColor: "${msg.textColor}",\n`;
  output += `  },\n`;
});

output += `];\n\nexport default messages;\n`;

fs.writeFileSync(
  "b:/youtube/create_anim-video/src/videos/group-chat/naruto/if naruto joined the akatsuki.ts",
  output,
);
