import React from "react";
import { Composition } from "remotion";
import { DualImageVideo } from "./DualImageVideo";
import { DualImageCarouselSchema } from "./DualImageCarousel";
import { data } from "../comic/dc-pets";

// ── Shared constants (must mirror DualImageCarousel.tsx) ──────────────────
const DURATION_PER_CARD = 5; // seconds per card
const FPS = 60;
const CARD_WIDTH = 628;
const GAP = 20;
const TOTAL_CARD_WIDTH = CARD_WIDTH + GAP;
const VIDEO_WIDTH = 1920;
const INTRO_CARDS_COUNT = 3;
const HOLD_SECONDS = 30; // freeze after all cards finish

// ── Compute total animation duration (mirrors DualImageCarousel logic) ─────
const VELOCITY = TOTAL_CARD_WIDTH / (DURATION_PER_CARD * FPS);
const TOTAL_INTRO_FRAMES = INTRO_CARDS_COUNT * DURATION_PER_CARD * FPS;

const leftEdgeOfLastCard = (data.length - 1) * TOTAL_CARD_WIDTH;
const lastCardRightEdge = leftEdgeOfLastCard + CARD_WIDTH;
const targetScroll1 = VIDEO_WIDTH - lastCardRightEdge;

const phase1Duration = Math.max(0, -targetScroll1 / VELOCITY); // scroll to show all
const phase2Duration = 1 * FPS; // pause 1s
const phase3Duration = 0.5 * FPS; // fast-jump to last card

const totalAnimationFrames =
  TOTAL_INTRO_FRAMES + phase1Duration + phase2Duration + phase3Duration;

const TOTAL_FRAMES = Math.ceil(totalAnimationFrames) + HOLD_SECONDS * FPS;

const DualImageCardSlideShow = () => {
  return (
    <Composition
      id="MyComposition"
      component={DualImageVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={VIDEO_WIDTH}
      height={1080}
      schema={DualImageCarouselSchema}
      defaultProps={{
        type: "comic",
        durationPerCard: DURATION_PER_CARD,
        items: data,
        mergeTitle: false,
      }}
    />
  );
};

export default DualImageCardSlideShow;
