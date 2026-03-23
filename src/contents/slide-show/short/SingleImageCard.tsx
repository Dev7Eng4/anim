import React, { useState, useRef, useCallback } from "react";
import { Img, interpolate, Easing } from "remotion";
import { z } from "zod";
import { CARD_DIMENSION, ChannelType, ChannelTypeColors } from "../constant";
import { cn } from "@/utils";

export const SingleImageDataSchema = z.object({
  imageSrc: z.string(),
  title: z.string(),
  description: z.string(),
  subTitle: z.string().optional(),
  objectPosition: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
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
    shape: "rect" | "polygon";
    fontSize: number;
    background: string;
    position: "top" | "bottom";
  };
}

export const SingleImageCard: React.FC<SingleImageCardProps> = ({
  isShort = false,
  data,
  type,
  animationProgress = 1,
  title,
  description,
  subTitle,
}) => {
  const [pan, setPan] = useState(data.objectPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

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
    console.log(
      `Image Position for "${data.title}":`,
      JSON.stringify(pan, null, 2),
    );
  }, [data.title, pan]);

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
    [-CARD_WIDTH, 0], // Move from Left (Negative) to Right (0)
  );

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
          style={{
            width: "100%",
            height: "100%",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <Img
            src={data.imageSrc}
            className="w-full h-full object-cover"
            alt={data.title}
            style={{
              transform: `translateY(${imageTranslateY}px)`,
              objectPosition: `calc(50% + ${pan.x}px) calc(50% + ${pan.y}px)`,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* <div
          className={cn(
            "absolute inline-flex items-center w-fit left-0 text-shadow-lg text-white text-4xl font-bold z-20",
            subTitle.position === "top"
              ? "top-0 pt-4 pb-5 pl-6 pr-12 min-h-[80px]"
              : "bottom-0 p-3",
          )}
          style={{
            transform: `translateX(${rankTranslateX}px)`,
            background:
              subTitle.position === "top" ? "#5c49eb" : subTitle.background,
            fontSize: subTitle.fontSize,
            clipPath:
              subTitle.shape === "rect"
                ? "polygon(0px 0px, 100% 0%, 100% 100%, 0% 100%)"
                : "polygon(0px 0px, 100% 0%, calc(100% - 35px) 100%, 0% 100%)",
          }}
        >
          {data.subTitle}
        </div> */}
      </div>

      <div
        className="flex items-center justify-center shrink-0 overflow-hidden z-10"
        style={{
          height: TITLE_BAR_HEIGHT,
          transform: `translateX(${titleX}px)`,
        }}
      >
        <h2
          className="w-full flex justify-center items-center pb-4 text-center font-bold"
          style={{
            height: `${TITLE_HEIGHT}px`,
            // lineHeight: `${TITLE_HEIGHT - 5}px`,
            fontSize: title.fontSize,
            background: ChannelTypeColors[type],
            color: `rgba(255, 255, 255, ${textOpacity})`,
          }}
        >
          {data.title}
        </h2>
      </div>

      <div
        className="w-full overflow-hidden"
        style={{
          height: DESCRIPTION_HEIGHT, // Fixed height
        }}
      >
        <div
          className="p-2.5 pb-10 flex flex-col items-center justify-center text-center"
          style={{
            height: description.height,
            background: description.background,
            color: `rgba(255, 255, 255, ${textOpacity})`,
            fontSize: description.fontSize,
            transform: `translateY(${descriptionTranslateY}px)`,
          }}
        >
          {/* <div className="font-extrabold -mt-6"> */}
          {data.description.split(/<br\s*\/?>/i).map((line, i, arr) => (
            <React.Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
          {/* </div> */}
          {/* <div className="text-5xl -mt-4 font-bold">Years Old</div> */}
        </div>
      </div>
    </div>
  );
};
