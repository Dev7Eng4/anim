import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { z } from "zod";
import {
  DualImageCarousel,
  DualImageCarouselSchema,
} from "./DualImageCarousel";

type DualImageVideoProps = z.infer<typeof DualImageCarouselSchema>;

export const DualImageVideo: React.FC<DualImageVideoProps> = ({
  items,
  type,
  mergeTitle,
}) => {
  const { fps } = useVideoConfig();

  // Animation Constants
  const WAIT_SECONDS = 2;
  const SCROLL_SECONDS_PER_CARD = 6;

  // Calculate duration
  const WAIT_FRAMES = WAIT_SECONDS * fps;
  const SCROLL_FRAMES = (items.length - 1) * SCROLL_SECONDS_PER_CARD * fps;
  const TOTAL_DURATION = WAIT_FRAMES + SCROLL_FRAMES;

  return (
    <AbsoluteFill className="bg-black">
      <Sequence durationInFrames={TOTAL_DURATION}>
        <DualImageCarousel items={items} type={type} mergeTitle={mergeTitle} />
      </Sequence>
    </AbsoluteFill>
  );
};
