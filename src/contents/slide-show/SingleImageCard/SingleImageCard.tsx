import React, { useState, useRef, useCallback } from "react";
import { Img, interpolate, Easing } from "remotion";
import { z } from "zod";
import { CARD_DIMENSION, ChannelType, ChannelTypeColors } from "../constant";
import { cn } from "@/utils";
import { FaStar } from "react-icons/fa";

export const SingleImageDataSchema = z.object({
  imageSrc: z.string(),
  title: z.string(),
  description: z.string(),
  titleFontSize: z.number().optional(),
  subTitle: z.string().optional(),
  objectPosition: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  zoom: z.number().optional(),
  gross: z.number().optional(),
});

export type SingleImageData = z.infer<typeof SingleImageDataSchema>;

interface TitleProps {
  height: number;
  fontSize?: number;
}

interface SingleImageCardProps {
  isShort?: boolean;
  data: SingleImageData;
  type: ChannelType;
  /** Animation progress from 0 to 1 (0 = start, 1 = fully revealed) */
  animationProgress?: number;
  title: TitleProps;
  description: {
    height: number;
    fontSize: number;
    background: string;
  };
  subTitle: {
    shape: "rect" | "polygon" | "circle";
    fontSize: number;
    background: string;
    position: "top" | "bottom";
    animation?: "slide" | "flip";
  };
  /**
   * 'slide'  - image slides up from bottom (default / dạng 1)
   * 'flip'   - image stays in final position and flips 180° into view (dạng 2)
   */
  imageAnimation?: "slide" | "flip";
}

export const SingleImageCard: React.FC<SingleImageCardProps> = ({
  isShort = false,
  data,
  type,
  animationProgress = 1,
  title,
  description,
  subTitle,
  imageAnimation = "slide",
}) => {
  const [pan, setPan] = useState(data.objectPosition || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(data.zoom ?? 1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const logStateRef = useRef({ pan, zoom });

  logStateRef.current = { pan, zoom };

  const logState = useCallback(() => {
    const { pan: p, zoom: z } = logStateRef.current;
    console.log(
      `Image State for "${data.title}":`,
      JSON.stringify({ objectPosition: p, zoom: z }, null, 2),
    );
  }, [data.title]);

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
      // Log after state update settles
      setTimeout(logState, 0);
    },
    [logState],
  );

  const CARD_WIDTH = isShort
    ? CARD_DIMENSION.CARD_HEIGHT
    : CARD_DIMENSION.CARD_WIDTH;
  const CARD_HEIGHT = isShort
    ? CARD_DIMENSION.CARD_HEIGHT_SHORT
    : CARD_DIMENSION.CARD_HEIGHT;
  // Use props for heights
  const TITLE_HEIGHT = title.height;
  const TITLE_BAR_MARGIN = 4;
  const TITLE_BAR_HEIGHT = TITLE_HEIGHT + TITLE_BAR_MARGIN * 2;
  const DESCRIPTION_HEIGHT = description.height;
  const IMAGE_HEIGHT = CARD_HEIGHT - TITLE_BAR_HEIGHT - DESCRIPTION_HEIGHT;

  // Animation phases
  // Phase 1: Title bar slides in from left (0 - 0.5)
  // Phase 2: Text fades in (0.5 - 0.7)
  // Phase 3: Image expands (0.2 - 0.4)
  // Phase 4: Image slide (0.5 - 0.9) - optional for single image but keeping for "similar" feel?
  // Actually, for single image, just expanding might be enough, but let's see.

  // Title slide
  const titleSlideProgress = interpolate(animationProgress, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleX = interpolate(titleSlideProgress, [0, 1], [-CARD_WIDTH, 0]);

  // Text opacity
  const textOpacity = interpolate(animationProgress, [0.5, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Image expansion (height grows)
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
  const imageContainerHeight = interpolate(
    imageContainerProgress,
    [0, 1],
    [0, IMAGE_HEIGHT],
  );

  // Image Slide from Bottom (Image moves up as container expands)
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

  const imageTranslateY = interpolate(
    imageSlideProgress,
    [0, 1],
    [IMAGE_HEIGHT, 0], // Slide up from Bottom (Height) to Top (0)
  );

  // Flip animation: rotateY from 180deg (back face) → 0deg (front face)
  const flipProgress = interpolate(animationProgress, [0.2, 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const flipRotateY = interpolate(flipProgress, [0, 1], [180, 0]);

  // Description Animation
  // 1. Container Height: FIXED at DESCRIPTION_HEIGHT
  // 2. Content Slide: Moves from -DESCRIPTION_HEIGHT (Top/Middle) to 0 (Bottom)

  const descriptionSlideProgress = interpolate(
    animationProgress,
    [0.2, 0.8], // Reuse image slide timing
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const descriptionTranslateY = interpolate(
    descriptionSlideProgress,
    [0, 1],
    [-DESCRIPTION_HEIGHT, 0], // Slide DOWN from top
  );

  // Rank Animation using Image Slide Progress (ends at 0.8)
  // Rank starts moving after image is done (or almost done).
  const rankSlideProgress = interpolate(
    animationProgress,
    [0.8, 0.95],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const rankTranslateX = interpolate(
    rankSlideProgress,
    [0, 1],
    [-CARD_WIDTH, 0],
  );

  const subTitleFlipProgress = interpolate(
    animationProgress,
    [0.8, 0.95],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const subTitleFlipRotateY = interpolate(
    subTitleFlipProgress,
    [0, 1],
    [180, 0],
  );

  let clipPathValue = "";
  if (subTitle.shape === "circle") {
    clipPathValue = "circle(50% at 50% 50%)";
  } else if (subTitle.shape === "rect") {
    clipPathValue = "polygon(0px 0px, 100% 0%, 100% 100%, 0% 100%)";
  } else {
    clipPathValue =
      "polygon(0px 0px, 100% 0%, calc(100% - 30px) 100%, 0% 100%)";
  }

  const skills = [
    "Physical Ability",
    "Technique",
    "Stamina",
    "Mental Strength",
    "Special Ability",
  ];

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        flexShrink: 0,
        justifyContent: "flex-end",
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: imageContainerHeight,
          flexGrow: 1,
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            width: "100%",
            height: "100%",
            cursor: isDragging ? "grabbing" : "grab",
            overflow: "hidden",
            perspective: imageAnimation === "flip" ? "1200px" : undefined,
          }}
        >
          <Img
            src={data.imageSrc}
            className="w-full h-full object-cover"
            alt={data.title}
            style={{
              transform:
                imageAnimation === "flip"
                  ? `rotateY(${flipRotateY}deg) scale(${zoom})`
                  : `translateY(${imageTranslateY}px) scale(${zoom})`,
              transformOrigin: "center center",
              objectPosition: `calc(50% + ${pan.x}px) calc(50% + ${pan.y}px)`,
              pointerEvents: "none",
              backfaceVisibility: "hidden",
            }}
          />
        </div>

        <div
          id="subTitle"
          className={cn(
            "absolute inline-flex hidden items-center left-0 text-shadow-lg text-white text-3xl font-bold z-20",
            subTitle.position === "top"
              ? "top-0 pt-4 pb-5 pl-6 pr-12 min-h-[60px]"
              : "bottom-0 p-3",
            subTitle.shape === "circle"
              ? "top-4 left-4 bg-red-600 rounded-full"
              : "",
          )}
          style={{
            transform:
              subTitle.animation === "flip"
                ? `rotateY(${subTitleFlipRotateY}deg)`
                : `translateX(${rankTranslateX}px)`,
            perspective: subTitle.animation === "flip" ? "1200px" : undefined,
            backfaceVisibility: "hidden",
            // background:
            //   subTitle.position === "top" ? "#5c49eb" : subTitle.background,
            fontSize: subTitle.fontSize,
            // clipPath: clipPathValue,
            aspectRatio: subTitle.shape === "circle" ? "1 / 1" : undefined,
            justifyContent: subTitle.shape === "circle" ? "center" : undefined,
            padding: subTitle.shape === "circle" ? "0" : undefined,
            width: subTitle.shape === "circle" ? "80px" : "fit-content",
            height: subTitle.shape === "circle" ? "80px" : "fit-content",
            transformOrigin: "center center",
          }}
        >
          {data.subTitle}
        </div>
      </div>

      <div
        className="flex items-center justify-center shrink-0 overflow-hidden z-10"
        style={{
          height: TITLE_BAR_HEIGHT,
          transform: `translateX(${titleX}px)`,
        }}
      >
        <h2
          className="w-full flex items-center justify-center px-4 text-center font-bold"
          style={{
            height: `${TITLE_HEIGHT}px`,
            // lineHeight: `${TITLE_HEIGHT - 5}px`,
            fontSize: data.titleFontSize || title.fontSize,
            background: ChannelTypeColors[type],

            color: `rgba(255, 255, 255, ${textOpacity})`,
          }}
        >
          {data.title}
        </h2>
      </div>

      <div
        className="w-full overflow-hidden shrink-0"
        style={{
          height: DESCRIPTION_HEIGHT,
        }}
      >
        <div
          className="p-2.5 pb-5 flex flex-col items-center justify-center text-center text-[40px] "
          style={{
            height: description.height,
            background: description.background,
            color: `rgba(255, 255, 255, ${textOpacity})`,
            // fontSize: description.fontSize,
            transform: `translateY(${descriptionTranslateY}px)`,
          }}
        >
          <div className="text-[75px]">
            {/* {data.gross?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} $ */}
            {data.description?.split(/<br\s*\/?>/i).map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}{" "}
          </div>
          <span className="text-[75px] -mt-8">Years Old</span>
          {/* <div className="-mt-6">Years Old</div> */}
          {/* <div className="mb-4">Worldwide Gross: {data.gross}</div> */}
        </div>
      </div>
    </div>
  );
};
