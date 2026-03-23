import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { z } from "zod";
import {
  DualImageCard,
  DualImageDataSchema,
  ChannelType,
} from "./DualImageCard";

export const DualImageCarouselSchema = z.object({
  items: z.array(DualImageDataSchema),
  type: z.enum(["anime", "comic", "naruto", "one-piece"]),
  mergeTitle: z.boolean().optional().default(false),
});

type DualImageCarouselProps = z.infer<typeof DualImageCarouselSchema>;

export const DualImageCarousel: React.FC<DualImageCarouselProps> = ({
  items,
  type,
  mergeTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const CARD_WIDTH = 628;
  const GAP = 20;
  const TOTAL_CARD_WIDTH = CARD_WIDTH + GAP;

  // Animation timing
  const INTRO_DURATION_PER_CARD = 2 * fps; // 2 seconds per card intro
  const INTRO_CARDS_COUNT = 3; // First 3 cards have intro animation
  const TOTAL_INTRO_FRAMES = INTRO_CARDS_COUNT * INTRO_DURATION_PER_CARD; // 6 seconds total

  // Scrolling phase settings
  const SECONDS_PER_CARD = 5;
  const FRAMES_PER_CARD = SECONDS_PER_CARD * fps;
  const VELOCITY = TOTAL_CARD_WIDTH / FRAMES_PER_CARD;

  // After intro phase, all cards scroll together from right to left
  const isScrollPhase = frame >= TOTAL_INTRO_FRAMES;
  const scrollFrame = Math.max(0, frame - TOTAL_INTRO_FRAMES);

  // Calculate scroll offset (all cards move together)
  // Calculate scroll offset (all cards move together)
  // New Logic:
  // Phase 1: Scroll until last card right edge touches screen right edge (1920)
  const leftEdgeOfLastCard = (items.length - 1) * TOTAL_CARD_WIDTH;
  const lastCardRightEdge = leftEdgeOfLastCard + CARD_WIDTH;
  const targetScroll1 = width - lastCardRightEdge;

  // Time needed to reach Phase 1 at current VELOCITY
  const phase1Duration = Math.max(0, -targetScroll1 / VELOCITY);

  // Phase 2: Pause 1s
  const phase2Duration = 1 * fps;

  // Phase 3: Fast move 0.5s to "Only last card"
  const phase3Duration = 0.5 * fps;
  const targetScroll2 = -leftEdgeOfLastCard; // Last card at left edge (0)

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

  // Use the new calculated scrollOffset directly
  const clampedScrollOffset = Math.round(scrollOffset);

  return (
    <AbsoluteFill className=" bg-[#0f121f]">
      <div
        className="relative h-full"
        style={{
          width: items.length * TOTAL_CARD_WIDTH,
          height: "100%",
        }}
      >
        {items.map((item, index) => {
          // Cards are always in their slot position
          const basePosition = index * TOTAL_CARD_WIDTH;
          const finalX = Math.round(basePosition + clampedScrollOffset);

          // Hide cards that haven't appeared yet during intro
          // For scroll cards (index >= 3), they appear when animation starts
          const isVisible =
            index < INTRO_CARDS_COUNT
              ? frame >= index * INTRO_DURATION_PER_CARD
              : true;

          // Calculate animation progress for each card (0-1)
          let cardAnimationProgress = 0;

          if (index < INTRO_CARDS_COUNT) {
            // Intro cards: time-based animation
            const cardStartFrame = index * INTRO_DURATION_PER_CARD;
            cardAnimationProgress = interpolate(
              frame,
              [cardStartFrame, cardStartFrame + INTRO_DURATION_PER_CARD],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
          } else {
            // Scroll cards: trigger when moving into viewport
            // Calculate frame where this card's left edge (finalX) reaches viewport position
            // Trigger point: When card is half-width into viewport (viewport width - card width/2)
            // Equation: finalX = index * TOTAL - (frame - INTRO_FRAMES) * VELOCITY
            // Target X = width - CARD_WIDTH / 2
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
                opacity: isVisible && cardAnimationProgress > 0 ? 1 : 0, // Also hide if animation hasn't started
                zIndex: items.length - index, // Earlier cards on top
              }}
            >
              <DualImageCard
                data={item}
                type={type}
                mergeTitle={mergeTitle}
                animationProgress={cardAnimationProgress}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
