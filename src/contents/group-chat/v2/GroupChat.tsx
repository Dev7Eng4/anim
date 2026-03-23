import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { MessageBubble, MessageBubbleSchema } from "./MessageBubble";

export const GroupChatSchema = z.object({
  theme: z.enum(["dark", "light"]),
  messages: z.array(MessageBubbleSchema),
  groupName: z.string().optional(),
});

export type GroupChat = z.infer<typeof GroupChatSchema>;

export const GroupChat: React.FC<GroupChat> = ({
  theme = "light",
  messages,
  groupName = "Nhóm chat",
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

  // 4. Tìm tin nhắn tiếp theo sẽ được gửi và tính toán text hiển thị trong input
  let inputText = "";
  let isTyping = false;

  // Tìm tin nhắn đầu tiên có startFrame > frame hiện tại
  const nextMessage = messagesWithStartFrame.find(
    (msg) => msg.startFrame > frame,
  );

  if (nextMessage) {
    // Thời gian gõ (ví dụ: 2 giây trước khi tin nhắn xuất hiện)
    const typingDuration = 2 * fps; // 2 giây
    const typingStartFrame = nextMessage.startFrame - typingDuration;

    if (frame >= typingStartFrame && frame < nextMessage.startFrame) {
      isTyping = true;
      // Tính số ký tự cần hiển thị dựa trên tiến độ gõ
      const typingProgress = (frame - typingStartFrame) / typingDuration;
      const totalChars = nextMessage.text.length;
      const charsToShow = Math.floor(typingProgress * totalChars);
      inputText = nextMessage.text.substring(0, charsToShow);
    }
  }

  return (
    <AbsoluteFill
      className={`font-sans overflow-hidden ${theme === "dark" ? "bg-white" : "bg-black"}`}
    >
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header với tên nhóm */}
        <div
          className={`px-6 py-4 border-b-2 ${theme === "dark" ? "bg-black border-[#1f2c33] text-white" : "bg-[#f0eae5] border-gray-300 text-black"}`}
        >
          <h1 className="text-6xl font-bold">{groupName}</h1>
        </div>

        {/* Khu vực tin nhắn */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
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

        {/* Input và button gửi tin nhắn */}
        <div
          className={`px-6 py-4 border-t-2 ${theme === "dark" ? "bg-black border-[#1f2c33]" : "bg-[#f0eae5] border-gray-300"}`}
        >
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={inputText}
              placeholder={isTyping ? "" : "Nhập tin nhắn..."}
              readOnly
              className={`flex-1 px-6 py-4 text-5xl rounded-3xl border-2 outline-none ${
                theme === "dark"
                  ? "bg-[#1f2c33] text-white border-[#2a3942] placeholder-gray-500"
                  : "bg-white text-black border-gray-300 placeholder-gray-400"
              }`}
            />
            <button
              className={`px-8 py-4 text-5xl font-semibold rounded-3xl transition-colors ${
                theme === "dark"
                  ? "bg-[#00a884] text-white hover:bg-[#008f6f]"
                  : "bg-[#00a884] text-white hover:bg-[#008f6f]"
              }`}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
