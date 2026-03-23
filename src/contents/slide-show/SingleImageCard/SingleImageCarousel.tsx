import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { SingleImageCard, SingleImageDataSchema } from "./SingleImageCard";
import { CARD_DIMENSION } from "../constant";

export const SingleImageCarouselSchema = z.object({
  type: z.enum(["anime", "comic", "naruto", "one-piece"]),
  title: z.object({
    height: z.number(),
    fontSize: z.number(),
  }),
  description: z.object({
    height: z.number(),
    fontSize: z.number(),
    background: z.string(),
  }),
  subTitle: z.object({
    shape: z.enum(["rect", "polygon", "circle"]),
    fontSize: z.number(),
    background: z.string(),
    position: z.enum(["top", "bottom"]),
    animation: z.enum(["slide", "flip"]).optional(),
  }),
  durationPerCard: z.number(),
  background: z.string(),
  /** 'slide' = dạng 1 (mặc định), 'flip' = dạng 2 (lật 180°) */
  imageAnimation: z.enum(["slide", "flip"]).optional(),
  items: z.array(SingleImageDataSchema),
});

type SingleImageCarouselProps = z.infer<typeof SingleImageCarouselSchema>;

export const SingleImageCarousel: React.FC<SingleImageCarouselProps> = ({
  items,
  background,
  durationPerCard,
  ...restProps
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const CARD_WIDTH = CARD_DIMENSION.CARD_WIDTH;
  const GAP = CARD_DIMENSION.GAP;
  const TOTAL_CARD_WIDTH = CARD_WIDTH + GAP;

  // Animation timing
  const INTRO_DURATION_PER_CARD = 2 * fps; // 2 seconds per card intro
  const INTRO_CARDS_COUNT = 3; // First 3 cards have intro animation
  const TOTAL_INTRO_FRAMES = INTRO_CARDS_COUNT * INTRO_DURATION_PER_CARD;

  // Scrolling phase settings
  const SECONDS_PER_CARD = durationPerCard;
  const FRAMES_PER_CARD = SECONDS_PER_CARD * fps;
  const VELOCITY = TOTAL_CARD_WIDTH / FRAMES_PER_CARD;

  // After intro phase, all cards scroll together from right to left
  const isScrollPhase = frame >= TOTAL_INTRO_FRAMES;
  const scrollFrame = Math.max(0, frame - TOTAL_INTRO_FRAMES);

  // Scroll logic
  const leftEdgeOfLastCard = (items.length - 1) * TOTAL_CARD_WIDTH;
  const lastCardRightEdge = leftEdgeOfLastCard + CARD_WIDTH;
  const targetScroll1 = width - lastCardRightEdge;

  const phase1Duration = Math.max(0, -targetScroll1 / VELOCITY);

  // Pause 1s
  const phase2Duration = 1 * fps;

  // Fast move 0.5s to "Only last card" (left edge of last card at 0?)
  // Actually, let's keep the DualImageCarousel logic: targetScroll2 = -leftEdgeOfLastCard
  const phase3Duration = 0.5 * fps;
  const targetScroll2 = -leftEdgeOfLastCard;

  const t1 = phase1Duration;
  const t2 = t1 + phase2Duration;
  const t3 = t2 + phase3Duration;

  let scrollOffset = 0;
  if (isScrollPhase) {
    if (scrollFrame <= t1) {
      scrollOffset = interpolate(scrollFrame, [0, t1], [0, targetScroll1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (scrollFrame <= t2) {
      scrollOffset = targetScroll1;
    } else {
      scrollOffset = interpolate(
        scrollFrame,
        [t2, t3],
        [targetScroll1, targetScroll2],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      );
    }
  }

  const clampedScrollOffset = Math.round(scrollOffset);

  return (
    <AbsoluteFill className={`bg-[${background}]`}>
      <div
        className="relative h-full"
        style={{
          width: items.length * TOTAL_CARD_WIDTH,
        }}
      >
        {items.map((item, index) => {
          const basePosition = index * TOTAL_CARD_WIDTH;
          const finalX = Math.round(basePosition + clampedScrollOffset);

          const isVisible =
            index < INTRO_CARDS_COUNT
              ? frame >= index * INTRO_DURATION_PER_CARD
              : true;

          let cardAnimationProgress = 0;

          if (index < INTRO_CARDS_COUNT) {
            const cardStartFrame = index * INTRO_DURATION_PER_CARD;
            cardAnimationProgress = interpolate(
              frame,
              [cardStartFrame, cardStartFrame + INTRO_DURATION_PER_CARD],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
          } else {
            const targetX = width - (CARD_WIDTH / 5) * 2;
            const scrollDistToTarget = index * TOTAL_CARD_WIDTH - targetX;
            const triggerFrame =
              TOTAL_INTRO_FRAMES + scrollDistToTarget / VELOCITY;

            cardAnimationProgress = interpolate(
              frame,
              [triggerFrame, triggerFrame + INTRO_DURATION_PER_CARD],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
          }

          const cardProps = {
            ...restProps,
            animationProgress: cardAnimationProgress,
            data: {
              ...item,
            },
          };

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translate3d(${finalX}px, 0, 0)`,
                willChange: "transform",
                backfaceVisibility: "hidden",
                opacity: isVisible && cardAnimationProgress > 0 ? 1 : 0,
                zIndex: items.length - index,
              }}
            >
              <SingleImageCard {...cardProps} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
