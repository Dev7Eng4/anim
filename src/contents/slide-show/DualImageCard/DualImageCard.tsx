import { cn } from "@/utils";
import React, { useState, useRef, useCallback } from "react";
import { Img, interpolate, Easing } from "remotion";
import { z } from "zod";
import { ChannelTypeColors } from "../constant";

export const DualImageDataSchema = z.object({
  topImageSrc: z.string(),
  bottomImageSrc: z.string(),
  topTitle: z.string(),
  bottomTitle: z.string(),
  topObjectPosition: z.object({ x: z.number(), y: z.number() }).optional(),
  topZoom: z.number().optional(),
  bottomObjectPosition: z.object({ x: z.number(), y: z.number() }).optional(),
  bottomZoom: z.number().optional(),
  description: z.string().optional(),
});

export type DualImageData = z.infer<typeof DualImageDataSchema>;

export type ChannelType = "anime" | "comic" | "naruto" | "one-piece";

interface DualImageCardProps {
  data: DualImageData;
  type: ChannelType;
  mergeTitle?: boolean;
  /** Animation progress from 0 to 1 (0 = start, 1 = fully revealed) */
  animationProgress?: number;
}

/** Hook that adds drag-to-pan and wheel-to-zoom on an image slot */
function useImageInteraction(
  label: string,
  position: "top" | "bottom",
  initialPan: { x: number; y: number },
  initialZoom: number,
) {
  const [pan, setPan] = useState(initialPan);
  const [zoom, setZoom] = useState(initialZoom);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef({ pan, zoom });
  stateRef.current = { pan, zoom };

  const logState = useCallback(() => {
    const { pan: p, zoom: z } = stateRef.current;
    const posKey =
      position === "top" ? "topObjectPosition" : "bottomObjectPosition";
    const zoomKey = position === "top" ? "topZoom" : "bottomZoom";
    console.log(
      `Image State for "${label}":`,
      JSON.stringify({ [posKey]: p, [zoomKey]: z }, null, 2),
    );
  }, [label, position]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
    },
    [pan],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const x = e.clientX - dragStartRef.current.x;
      const y = e.clientY - dragStartRef.current.y;
      setPan({ x, y });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    logState();
  }, [logState]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        return Math.min(
          5,
          Math.max(0.3, parseFloat((prev + delta).toFixed(2))),
        );
      });
      setTimeout(logState, 0);
    },
    [logState],
  );

  return {
    pan,
    zoom,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
  };
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

  // ── Pan / Zoom interaction ────────────────────────────────────────────────
  const topImage = useImageInteraction(
    data.topTitle,
    "top",
    data.topObjectPosition ?? { x: 0, y: 0 },
    data.topZoom ?? 1,
  );
  const bottomImage = useImageInteraction(
    data.bottomTitle,
    "bottom",
    data.bottomObjectPosition ?? { x: 0, y: 0 },
    data.bottomZoom ?? 1,
  );

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

  // Image slide animation - START EARLIER (0.2 - 0.8) to match SingleImageCard
  const imageSlideProgress = interpolate(
    animationProgress,
    [0.2, 0.8],
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
  const topOverlayY = topContainerCompensation + topOverlaySlide;

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

  // Description slide-in — same timing as subTitle in SingleImageCard (0.8 → 0.95)
  const descriptionSlideProgress = interpolate(
    animationProgress,
    [0.8, 0.95],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  const descriptionTranslateX = interpolate(
    descriptionSlideProgress,
    [0, 1],
    [-CARD_WIDTH, 0], // slides in from left
  );

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
          className="absolute top-0 left-0 w-full bg-slate-800"
          style={{
            height: IMAGE_HEIGHT,
            transform: `translateY(${topOverlayY}px)`,
          }}
        />
        {/* Draggable / zoomable wrapper for top image */}
        <div
          onMouseDown={topImage.handleMouseDown}
          onMouseMove={topImage.handleMouseMove}
          onMouseUp={topImage.handleMouseUp}
          onMouseLeave={topImage.handleMouseUp}
          onWheel={topImage.handleWheel}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: IMAGE_HEIGHT,
            cursor: topImage.isDragging ? "grabbing" : "grab",
            overflow: "hidden",
            transform: `translateY(${topImageY}px)`,
          }}
        >
          <Img
            src={data.topImageSrc}
            className="w-full object-cover"
            alt="Top"
            style={{
              height: IMAGE_HEIGHT,
              transform: `scale(${topImage.zoom})`,
              transformOrigin: "center center",
              objectPosition: `calc(50% + ${topImage.pan.x}px) calc(50% + ${topImage.pan.y}px)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Title Bar with 2 titles */}
      <div
        className="flex flex-col items-center justify-center overflow-hidden"
        style={{
          height: TITLE_BAR_HEIGHT,
          gap: `${2}px`,
          transform: `translateX(${topTitleX}px)`,
        }}
      >
        <h2
          className="w-full text-center font-bold bg-blue-500"
          style={{
            height: `${TITLE_HEIGHT}px`,
            lineHeight: `${TITLE_HEIGHT - 5}px`,
            fontSize: mergeTitle ? 50 : 36,
            background: ChannelTypeColors[type],
            color: `rgba(255, 255, 255, ${textOpacity})`,
          }}
        >
          {mergeTitle ? (
            <>
              {data.topTitle}
              {/* {data.bottomTitle} */}
            </>
          ) : (
            data.topTitle
          )}
        </h2>

        {!mergeTitle && (
          <h2
            className="w-full text-center font-bold bg-blue-600"
            style={{
              height: `${TITLE_HEIGHT}px`,
              fontSize: 36,
              lineHeight: `${TITLE_HEIGHT - 5}px`,
              // background: "linear-gradient(180deg, #1A0B2E 0%, #090919 100%)",
              color: `rgba(255, 255, 255, ${textOpacity})`,
            }}
          >
            {data.bottomTitle}
          </h2>
        )}
      </div>

      {/* Bottom Image Container - expands from center downward */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: bottomImageContainerHeight,
        }}
      >
        <div
          className="absolute top-0 left-0 w-full bg-slate-800"
          style={{
            height: IMAGE_HEIGHT,
            transform: `translateY(${bottomOverlayY}px)`,
          }}
        />
        {/* Draggable / zoomable wrapper for bottom image */}
        <div
          onMouseDown={bottomImage.handleMouseDown}
          onMouseMove={bottomImage.handleMouseMove}
          onMouseUp={bottomImage.handleMouseUp}
          onMouseLeave={bottomImage.handleMouseUp}
          onWheel={bottomImage.handleWheel}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: IMAGE_HEIGHT,
            cursor: bottomImage.isDragging ? "grabbing" : "grab",
            overflow: "hidden",
            transform: `translateY(${bottomImageY}px)`,
          }}
        >
          <Img
            src={data.bottomImageSrc}
            className="w-full object-cover"
            alt="Bottom"
            style={{
              height: IMAGE_HEIGHT,
              transform: `scale(${bottomImage.zoom})`,
              transformOrigin: "center center",
              objectPosition: `calc(50% + ${bottomImage.pan.x}px) calc(50% + ${bottomImage.pan.y}px)`,
              pointerEvents: "none",
            }}
          />

          {/* <div
            id="description"
            className={cn(
              "absolute inline-flex items-center w-fit left-0 text-shadow-lg text-white font-bold z-20",
              "bottom-0 pt-2 pb-3 px-6",
            )}
            style={{
              background: "#000000B3",
              fontSize: 28,
              transform: `translateX(${descriptionTranslateX}px)`,
            }}
          >
            {data.description}
          </div> */}
        </div>
      </div>
    </div>
  );
};
