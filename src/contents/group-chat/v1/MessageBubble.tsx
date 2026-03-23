import React from "react";
import { useVideoConfig, interpolate, spring, Img } from "remotion";
import { z } from "zod";

export const MessageBubbleSchema = z.object({
  sender: z.string(),
  text: z.string(),
  sendTime: z.string(),
  action: z.enum(["left", "joined", "invite"]).optional(),
  time: z.number(),
  avatar: z.string(),
  textColor: z.string(),
  effect: z
    .array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("audio"),
          src: z.string(),
          start: z.number(),
        }),
        z.object({
          type: z.literal("zoom"),
          start: z.number(),
          to: z.number(),
        }),
      ]),
    )
    .optional(),
});

export type IMessage = z.infer<typeof MessageBubbleSchema>;

export const MessageBubble: React.FC<{
  message: IMessage;
  frame: number;
  appearanceFrame: number;
  hideHeader?: boolean;
  theme?: "dark" | "light";
}> = ({ message, frame, appearanceFrame, hideHeader, theme = "dark" }) => {
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - appearanceFrame,
    fps,
    config: {
      damping: 12,
    },
  });

  const translateY = interpolate(spr, [0, 1], [20, 0]);
  const opacity = interpolate(spr, [0, 1], [0, 1]);
  const scale = interpolate(spr, [0, 1], [0.8, 1]);

  if (frame < appearanceFrame) return null;

  return (
    <div
      className={`flex ${message.action ? "" : "mb-4"}`}
      style={
        {
          // opacity,
          // transform: `translateY(${translateY}px) scale(${scale})`,
          // transformOrigin: message.isMe ? "right bottom" : "left bottom",
        }
      }
    >
      {message.action ? (
        <div
          className={`flex gap-8 mx-auto my-6 px-10 pt-5 pb-6 rounded-4xl shadow-md ${theme === "dark" ? "bg-[#1f2c33] text-[#d4dbdf]" : "bg-white text-slate-400"}`}
        >
          <p className="text-5xl leading-tight tracking-tight font-semibold">
            {message.text}
          </p>
        </div>
      ) : (
        <>
          {hideHeader ? (
            <div className="w-20 mr-16" />
          ) : (
            <Img
              src={message.avatar}
              alt={message.sender}
              className="w-28 h-28 rounded-full mr-8 object-cover shadow-xl"
            />
          )}

          <div className={`flex flex-col`}>
            {!hideHeader && (
              <span
                className="text-4xl font-bold mb-3"
                style={{ color: message.textColor }}
              >
                {message.sender}
              </span>
            )}

            <div
              className={`inline-flex items-end gap-8 px-8 pt-5 pb-6 rounded-4xl shadow-md ${theme === "dark" ? "bg-[#1f2c33] text-[#d4dbdf]" : "bg-white text-black"} ${!hideHeader ? "rounded-tl-none" : ""}`}
            >
              <p className="text-5xl leading-tight tracking-tight font-semibold">
                {message.text}
              </p>

              <span className="text-3xl text-[#98a3ab] pr-1">
                {message.sendTime}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
