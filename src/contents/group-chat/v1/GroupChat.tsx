import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { MessageBubble, MessageBubbleSchema } from "./MessageBubble";

export const GroupChatSchema = z.object({
  theme: z.enum(["dark", "light"]),
  messages: z.array(MessageBubbleSchema),
});

export type GroupChat = z.infer<typeof GroupChatSchema>;

export const GroupChat: React.FC<GroupChat> = ({
  theme = "light",
  messages,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // 1. Calculate startFrame for each message
  let currentStartFrame = 0;
  const messagesWithStartFrame = messages.map((msg) => {
    const startFrame = currentStartFrame;
    currentStartFrame += msg.time * fps;
    return { ...msg, startFrame };
  });

  // 2. Group messages by consecutive sender
  const messageGroups = messagesWithStartFrame.reduce(
    (acc: (typeof messagesWithStartFrame)[], msg) => {
      const lastGroup = acc[acc.length - 1];
      if (lastGroup && lastGroup[0].sender === msg.sender) {
        lastGroup.push(msg);
      } else {
        acc.push([msg]);
      }
      return acc;
    },
    [],
  );

  // 3. Find the active group based on current frame
  let activeGroupIndex = -1;
  for (let i = messageGroups.length - 1; i >= 0; i--) {
    if (frame >= messageGroups[i][0].startFrame) {
      activeGroupIndex = i;
      break;
    }
  }
  const activeGroup =
    activeGroupIndex === -1 ? [] : messageGroups[activeGroupIndex];

  return (
    <AbsoluteFill
      className={`font-sans overflow-hidden ${theme === "dark" ? "bg-white" : "bg-black"}`}
    >
      <div className="flex-1 flex flex-col justify-center overflow-hidden relative">
        <div
          className={`flex flex-col p-4 pl-6 ${theme === "dark" ? "bg-black" : "bg-[#f0eae5]"}`}
        >
          {activeGroup.map((msg, index) => (
            <MessageBubble
              key={`${activeGroupIndex}-${index}`}
              message={msg}
              frame={frame}
              appearanceFrame={msg.startFrame}
              hideHeader={index > 0}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
