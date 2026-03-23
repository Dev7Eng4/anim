import React from "react";
import { AbsoluteFill } from "remotion";
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
  durationPerCard = 6,
}) => {
  return (
    <AbsoluteFill className="bg-black">
      {/* No Sequence wrapper — carousel clamps its own animations naturally,
          so it holds the last frame for the remaining hold duration */}
      <DualImageCarousel
        items={items}
        type={type}
        mergeTitle={mergeTitle}
        durationPerCard={durationPerCard}
      />
    </AbsoluteFill>
  );
};
