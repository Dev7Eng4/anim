import React from "react";
import { Img, interpolate, Easing } from "remotion";
import { z } from "zod";

export const DualImageDataSchema = z.object({
  topImageSrc: z.string(),
  bottomImageSrc: z.string(),
  topTitle: z.string(),
  bottomTitle: z.string(),
});

export type DualImageData = z.infer<typeof DualImageDataSchema>;

export type ChannelType = "anime" | "comic" | "naruto" | "one-piece";

const ChannelTypeColors: Record<ChannelType, string> = {
  anime: "linear-gradient(to bottom, #cc95e2 0%, #8B5CF6 50%, #bc13fe 100%)",
  comic: "linear-gradient(to bottom, #E82E2E 0%, #B00B0B 50%, #750000 100%)",
  naruto: "#8A0000",
  "one-piece": "#2e0808",
};

interface DualImageCardProps {
  data: DualImageData;
  type: ChannelType;
  mergeTitle?: boolean;
  /** Animation progress from 0 to 1 (0 = start, 1 = fully revealed) */
  animationProgress?: number;
}

export const DualImageCard: React.FC<DualImageCardProps> = ({
  data,
  type,
  mergeTitle,
  animationProgress = 1,
}) => {
  const CARD_WIDTH = 630;
  const CARD_HEIGHT = 1080;
  const TITLE_HEIGHT = mergeTitle ? 100 : 70;
  const TITLE_BAR_MARGIN = 4;
  const TITLE_BAR_HEIGHT = mergeTitle
    ? TITLE_HEIGHT + TITLE_BAR_MARGIN * 2
    : TITLE_HEIGHT * 2 + TITLE_BAR_MARGIN * 3;
  const IMAGE_HEIGHT = (CARD_HEIGHT - TITLE_BAR_HEIGHT) / 2; // ~470px each

  // Vị trí giữa tuyệt đối của card (nơi 2 title gặp nhau)
  const cardCenterY = CARD_HEIGHT / 2;
  const bottomContainerTop = IMAGE_HEIGHT + TITLE_BAR_HEIGHT * 2 + 12;

  // Fixed compensation values for slide calculations
  const fixedTopComp = cardCenterY - IMAGE_HEIGHT;
  const fixedBottomComp = cardCenterY - bottomContainerTop;

  // Bottom image calculation:
  const bottomContainerCompensation = cardCenterY - bottomContainerTop;

  // Animation phases (based on 2 second duration per card)
  // Phase 1: Title bars slide in from left (0s - 0.5s = 0 - 0.5)
  // Phase 2: Text fades in with titles (0s - 0.3s = 0 - 0.3)
  // Phase 3: Image backgrounds expand from center (0.2s - 0.4s = 0.2 - 0.4)
  // Phase 4: Overlays move with titles (0s - 0.5s = 0 - 0.5) - SAME AS TITLE
  // Phase 5: Images slide from center (0.5s - 0.9s = 0.5 - 0.9) - AFTER overlay done

  // Title bar slide animation (from left to center)
  const titleSlideProgress = interpolate(animationProgress, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const topTitleX = interpolate(titleSlideProgress, [0, 1], [-CARD_WIDTH, 0]);

  // Text opacity (fade in after title slide finishes at 0.5)
  const textOpacity = interpolate(animationProgress, [0.5, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Image container expansion (from center: top goes up, bottom goes down)
  const imageContainerProgress = interpolate(
    animationProgress,
    [0.2, 0.4],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  const topImageContainerHeight = interpolate(
    imageContainerProgress,
    [0, 1],
    [0, IMAGE_HEIGHT],
  );
  const bottomImageContainerHeight = interpolate(
    imageContainerProgress,
    [0, 1],
    [0, IMAGE_HEIGHT],
  );

  // Overlay animation - SAME TIMING AS TITLE (0 - 0.5)
  const overlaySlideProgress = interpolate(
    animationProgress,
    [0, 0.5],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  // Image slide animation - AFTER overlay done (0.5 - 0.9)
  const imageSlideProgress = interpolate(
    animationProgress,
    [0.5, 0.9],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  // Top image calculation:
  // Part 1: Container compensation - để image bottom luôn ở cardCenterY bất kể container size
  const topContainerCompensation =
    cardCenterY - 2 * IMAGE_HEIGHT + topImageContainerHeight;
  console.log("topContainerCompensation", topContainerCompensation);

  // Part 2: Image slide - từ giữa (0) lên trên
  const topImageSlide = interpolate(
    imageSlideProgress,
    [0, 1],
    [IMAGE_HEIGHT - fixedTopComp, -fixedTopComp],
  );
  const topImageY = topContainerCompensation + topImageSlide;

  // Top overlay - di chuyển cùng title (từ left vào center)
  const topOverlaySlide = interpolate(
    overlaySlideProgress,
    [0, 1],
    [IMAGE_HEIGHT - fixedTopComp, -fixedTopComp],
  );
  console.log("topOverlaySlide", topOverlaySlide);
  const topOverlayY = topContainerCompensation + topOverlaySlide;
  console.log("topOverlayY", topOverlayY);

  // Part 2: Image slide - từ giữa (0) xuống dưới
  const bottomImageSlide = interpolate(
    imageSlideProgress,
    [0, 1],
    [-IMAGE_HEIGHT - fixedBottomComp, -fixedBottomComp],
  );
  const bottomImageY = bottomContainerCompensation + bottomImageSlide;

  // Bottom overlay - di chuyển cùng title
  const bottomOverlaySlide = interpolate(
    overlaySlideProgress,
    [0, 1],
    [-IMAGE_HEIGHT - fixedBottomComp, -fixedBottomComp],
  );
  const bottomOverlayY = bottomContainerCompensation + bottomOverlaySlide;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        flexShrink: 0,
        marginRight: 15,
      }}
    >
      {/* Top Image Container - expands from center upward */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: topImageContainerHeight,
          marginTop: IMAGE_HEIGHT - topImageContainerHeight,
        }}
      >
        <div
          className="absolute top-0 left-0 w-full bg-slate-500"
          style={{
            height: IMAGE_HEIGHT,
            transform: `translateY(${topOverlayY}px)`,
          }}
        />
        <Img
          src={data.topImageSrc}
          className="w-full object-cover"
          alt="Top"
          style={{
            height: IMAGE_HEIGHT,
            transform: `translateY(${topImageY}px)`,
          }}
        />
      </div>

      {/* Title Bar with 2 titles */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          height: TITLE_BAR_HEIGHT,
          gap: `${2}px`,
          transform: `translateX(${topTitleX}px)`,
        }}
      >
        <h2
          className="w-full text-center font-bold"
          style={{
            height: `${TITLE_HEIGHT}px`,
            lineHeight: `${TITLE_HEIGHT - 5}px`,
            fontSize: mergeTitle ? 50 : 36,
            background: ChannelTypeColors[type],
            color: `rgba(255, 255, 255, ${textOpacity})`,
          }}
        >
          {data.topTitle}
        </h2>

        <h2
          className="w-full text-center font-bold absolute top-1/2 left-0 right-0 -translate-y-1/2"
          style={{
            height: `${TITLE_HEIGHT}px`,
            fontSize: 36,
            lineHeight: `${TITLE_HEIGHT - 5}px`,
            background: "linear-gradient(180deg, #1A0B2E 0%, #090919 100%)",
            color: `rgba(255, 255, 255, ${textOpacity})`,
          }}
        >
          {data.bottomTitle}
        </h2>

        {/* {!mergeTitle && ( */}
        <h2
          className="w-full text-center font-bold"
          style={{
            height: `${TITLE_HEIGHT}px`,
            fontSize: 36,
            lineHeight: `${TITLE_HEIGHT - 5}px`,
            background: "linear-gradient(180deg, #1A0B2E 0%, #090919 100%)",
            color: `rgba(255, 255, 255, ${textOpacity})`,
          }}
        >
          {data.bottomTitle}
        </h2>
        {/* )} */}
      </div>

      {/* Bottom Image Container - expands from center downward */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: bottomImageContainerHeight,
        }}
      >
        <div
          className="absolute top-0 left-0 w-full bg-slate-500"
          style={{
            height: IMAGE_HEIGHT,
            transform: `translateY(${bottomOverlayY}px)`,
          }}
        />
        <Img
          src={data.bottomImageSrc}
          className="w-full object-center"
          alt="Bottom"
          style={{
            height: IMAGE_HEIGHT,
            transform: `translateY(${bottomImageY}px)`,
          }}
        />
      </div>
    </div>
  );
};
