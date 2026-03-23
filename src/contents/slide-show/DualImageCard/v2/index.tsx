import React from "react";
import { Composition } from "remotion";
import { DualImageVideo } from "./DualImageVideo";
import { data } from "./data";
import { DualImageCarouselSchema } from "./DualImageCarousel";

export const DualImageCard = () => {
  return (
    <Composition
      id="DualImageCarousel"
      component={DualImageVideo}
      durationInFrames={(6 + (data.length - 1) * 6) * 60} // Intro(6s) + Scroll((N-1) intervals * 6s) @ 60fps
      fps={60}
      width={1920}
      height={1080}
      schema={DualImageCarouselSchema}
      defaultProps={{
        type: "comic",
        items: data,
        mergeTitle: false,
      }}
    />
  );
};
