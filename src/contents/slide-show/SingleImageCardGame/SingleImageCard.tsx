import React, { useState, useRef, useCallback } from "react";
import { Img, interpolate, Easing, useCurrentFrame } from "remotion";
import { z } from "zod";
import { CARD_DIMENSION, ChannelType, ChannelTypeColors } from "../constant";
import { cn } from "@/utils";
import { FaStar, FaLock, FaCrown, FaGem } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import { MdAutoAwesome } from "react-icons/md";

// ─── Card Variant ────────────────────────────────────────────────────────────
export type CardVariant =
  | "normal"
  | "locked"
  | "golden"
  | "secret"
  | "rare"
  | "super_rare"
  | "ultra_rare"
  | "legend";

export const CardVariantEnum = z.enum([
  "normal",
  "locked",
  "golden",
  "secret",
  "rare",
  "super_rare",
  "ultra_rare",
  "legend",
]);

// ─── Schema ──────────────────────────────────────────────────────────────────
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
  zoom: z.number().optional(),
  /** Per-item variant — overrides global cardVariant from carousel */
  cardVariant: CardVariantEnum.optional(),
});

export type SingleImageData = z.infer<typeof SingleImageDataSchema>;

// ─── Rarity Config ───────────────────────────────────────────────────────────
interface RarityConfig {
  border: string;
  shadow: string;
  insetGlow: string;
  titleGradient: string;
  shimmerColor: string;
  shimmerSpeed: number; // px per frame
  shimmerCount: number;
  shimmerOpacity: number;
  shimmerWidth: number; // px
  icon: React.ReactNode;
  label: string;
  labelColor: string;
}

const RARITY_MAP: Partial<Record<CardVariant, RarityConfig>> = {
  rare: {
    border: "3px solid #4FC3F7",
    shadow: "0 0 24px 8px #4FC3F799, 0 0 6px 2px #4FC3F7CC",
    insetGlow: "inset 0 0 40px 6px #4FC3F722",
    titleGradient:
      "linear-gradient(90deg, #0277BD 0%, #4FC3F7 50%, #0277BD 100%)",
    shimmerColor: "rgba(180,230,255,0.55)",
    shimmerSpeed: 6,
    shimmerCount: 1,
    shimmerOpacity: 0.6,
    shimmerWidth: 80,
    icon: <FaGem size={44} color="#4FC3F7" />,
    label: "RARE",
    labelColor: "#4FC3F7",
  },
  super_rare: {
    border: "3px solid #CE93D8",
    shadow:
      "0 0 30px 10px #CE93D8AA, 0 0 8px 3px #CE93D8EE, 0 0 60px 20px #9C27B044",
    insetGlow: "inset 0 0 50px 10px #CE93D822",
    titleGradient:
      "linear-gradient(90deg, #6A1B9A 0%, #CE93D8 50%, #6A1B9A 100%)",
    shimmerColor: "rgba(230,180,255,0.65)",
    shimmerSpeed: 8,
    shimmerCount: 2,
    shimmerOpacity: 0.75,
    shimmerWidth: 70,
    icon: <MdAutoAwesome size={50} color="#CE93D8" />,
    label: "SUPER RARE",
    labelColor: "#CE93D8",
  },
  ultra_rare: {
    border: "3px solid transparent",
    shadow:
      "0 0 40px 12px #FF6B9D88, 0 0 20px 6px #4FC3F799, 0 0 60px 20px #FFD70066",
    insetGlow: "inset 0 0 60px 12px rgba(255,255,255,0.06)",
    titleGradient:
      "linear-gradient(90deg, #f44336 0%, #ff9800 25%, #ffeb3b 50%, #4caf50 75%, #2196f3 100%)",
    shimmerColor: "rgba(255,255,255,0.80)",
    shimmerSpeed: 10,
    shimmerCount: 3,
    shimmerOpacity: 0.85,
    shimmerWidth: 60,
    icon: <GiDiamondTrophy size={56} color="#FFD700" />,
    label: "ULTRA RARE",
    labelColor: "#FFD700",
  },
  legend: {
    border: "3px solid #FF6B35",
    shadow:
      "0 0 40px 12px #FF6B35CC, 0 0 80px 30px #FFD70066, 0 0 8px 3px #FF6B35",
    insetGlow: "inset 0 0 60px 15px #FF6B3522",
    titleGradient:
      "linear-gradient(90deg, #7B1A00 0%, #FF6B35 35%, #FFD700 65%, #7B1A00 100%)",
    shimmerColor: "rgba(255,200,80,0.80)",
    shimmerSpeed: 12,
    shimmerCount: 2,
    shimmerOpacity: 0.9,
    shimmerWidth: 90,
    icon: <FaCrown size={56} color="#FFD700" />,
    label: "LEGEND",
    labelColor: "#FFD700",
  },
  golden: {
    border: "3px solid #FFD700",
    shadow: "0 0 24px 6px #FFD70099, 0 0 8px 2px #FFD700CC",
    insetGlow: "inset 0 0 40px 8px #FFD70011",
    titleGradient:
      "linear-gradient(90deg, #B8860B 0%, #FFD700 50%, #B8860B 100%)",
    shimmerColor: "rgba(255,240,120,0.65)",
    shimmerSpeed: 7,
    shimmerCount: 1,
    shimmerOpacity: 0.65,
    shimmerWidth: 80,
    icon: <FaStar size={52} color="#FFD700" />,
    label: "GOLDEN",
    labelColor: "#FFD700",
  },
};

// ─── Shimmer Overlay (frame-animated) ────────────────────────────────────────
interface ShimmerOverlayProps {
  config: RarityConfig;
  width: number;
  height: number;
  frame: number;
}

const ShimmerOverlay: React.FC<ShimmerOverlayProps> = ({
  config,
  width,
  height,
  frame,
}) => {
  const {
    shimmerColor,
    shimmerSpeed,
    shimmerCount,
    shimmerOpacity,
    shimmerWidth,
  } = config;
  const period = (width + shimmerWidth * 2) / shimmerSpeed;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 15,
      }}
    >
      {Array.from({ length: shimmerCount }).map((_, i) => {
        const offset = (i * period) / shimmerCount;
        const x =
          ((frame * shimmerSpeed + offset * (width + shimmerWidth * 2)) %
            (width + shimmerWidth * 2)) -
          shimmerWidth;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: x,
              width: shimmerWidth,
              height: "100%",
              background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
              transform: "skewX(-15deg)",
              opacity: shimmerOpacity,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Holographic Overlay (ultra_rare) ────────────────────────────────────────
interface HolographicOverlayProps {
  frame: number;
}

const HolographicOverlay: React.FC<HolographicOverlayProps> = ({ frame }) => {
  const angle = (frame * 1.5) % 360;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 14,
        pointerEvents: "none",
        background: `linear-gradient(${angle}deg, 
          rgba(255,0,128,0.12) 0%, 
          rgba(255,165,0,0.12) 16%,
          rgba(255,255,0,0.12) 33%,
          rgba(0,255,128,0.12) 50%,
          rgba(0,128,255,0.12) 66%,
          rgba(128,0,255,0.12) 83%,
          rgba(255,0,128,0.12) 100%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

// ─── Rainbow Border (ultra_rare) ─────────────────────────────────────────────
interface RainbowBorderProps {
  frame: number;
  width: number;
  height: number;
}

const RainbowBorder: React.FC<RainbowBorderProps> = ({
  frame,
  width,
  height,
}) => {
  const angle = (frame * 2) % 360;
  return (
    <div
      style={{
        position: "absolute",
        inset: -3,
        zIndex: 25,
        pointerEvents: "none",
        background: `linear-gradient(${angle}deg,
          #ff0080, #ff9800, #ffff00, #00ff80, #0080ff, #8000ff, #ff0080)`,
        borderRadius: 4,
        padding: 3,
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  );
};

// ─── Rarity Badge ─────────────────────────────────────────────────────────────
interface RarityBadgeProps {
  config: RarityConfig;
  animationProgress: number;
}

const RarityBadge: React.FC<RarityBadgeProps> = ({
  config,
  animationProgress,
}) => {
  const opacity = interpolate(animationProgress, [0.85, 1.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(animationProgress, [0.85, 1.0], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2)),
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 14,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity,
        transform: `scale(${scale})`,
        filter: `drop-shadow(0 0 10px ${config.labelColor})`,
      }}
    >
      {config.icon}
      <span
        style={{
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: 2,
          color: config.labelColor,
          textTransform: "uppercase",
          textShadow: `0 0 8px ${config.labelColor}`,
        }}
      >
        {config.label}
      </span>
    </div>
  );
};

// ─── Locked Overlay ───────────────────────────────────────────────────────────
const LockedOverlay: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <FaLock size={80} color="#ffffffCC" />
      <span
        style={{
          color: "#ffffffCC",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Locked
      </span>
    </div>
  </div>
);

// ─── Secret filter ────────────────────────────────────────────────────────────
function secretFilter(animationProgress: number): string {
  const reveal = Math.min(1, animationProgress / 0.85);
  const brightness = reveal * 100;
  const contrast = 100 + (1 - reveal) * 100;
  const saturate = reveal * 100;
  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface TitleProps {
  height: number;
  fontSize?: number;
}

interface SingleImageCardProps {
  isShort?: boolean;
  data: SingleImageData;
  type: ChannelType;
  /** Animation progress from 0 to 1. */
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
  /**
   * 'slide'  - slides up from bottom (default)
   * 'flip'   - flips 180° into view
   * 'zoom'   - scales from 0 → 1
   */
  imageAnimation?: "slide" | "flip" | "zoom";
  /**
   * Global card variant — overridden by per-item data.cardVariant.
   * normal | locked | golden | secret | rare | super_rare | ultra_rare | legend
   */
  cardVariant?: CardVariant;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const SingleImageCard: React.FC<SingleImageCardProps> = ({
  isShort = false,
  data,
  type,
  animationProgress = 1,
  title,
  description,
  subTitle,
  imageAnimation = "slide",
  cardVariant: cardVariantProp = "normal",
}) => {
  const frame = useCurrentFrame();

  // Per-item variant overrides global prop
  const cardVariant: CardVariant = data.cardVariant ?? cardVariantProp;
  const rarityConfig = RARITY_MAP[cardVariant];

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
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    },
    [pan],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
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
      setZoom((prev) =>
        Math.min(
          5,
          Math.max(
            0.3,
            parseFloat((prev + (e.deltaY > 0 ? -0.1 : 0.1)).toFixed(2)),
          ),
        ),
      );
      setTimeout(logState, 0);
    },
    [logState],
  );

  // ── Dimensions ──
  const CARD_WIDTH = isShort
    ? CARD_DIMENSION.CARD_HEIGHT
    : CARD_DIMENSION.CARD_WIDTH;
  const CARD_HEIGHT = isShort
    ? CARD_DIMENSION.CARD_HEIGHT_SHORT
    : CARD_DIMENSION.CARD_HEIGHT;
  const TITLE_HEIGHT = title.height;
  const TITLE_BAR_MARGIN = 0;
  const TITLE_BAR_HEIGHT = TITLE_HEIGHT + TITLE_BAR_MARGIN * 2;
  const DESCRIPTION_HEIGHT = description.height;
  const IMAGE_HEIGHT = CARD_HEIGHT - TITLE_BAR_HEIGHT - DESCRIPTION_HEIGHT;

  // ── Animation phases ──
  const titleSlideProgress = interpolate(animationProgress, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleX = interpolate(titleSlideProgress, [0, 1], [-CARD_WIDTH, 0]);

  const textOpacity = interpolate(animationProgress, [0.5, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const imageContainerHeight = interpolate(
    interpolate(animationProgress, [0.2, 0.4], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
    [0, 1],
    [0, IMAGE_HEIGHT],
  );

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
    [IMAGE_HEIGHT, 0],
  );

  const flipRotateY = interpolate(
    interpolate(animationProgress, [0.2, 0.9], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
    [0, 1],
    [180, 0],
  );

  const imageScale = interpolate(
    interpolate(animationProgress, [0.2, 0.8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.5)),
    }),
    [0, 1],
    [0, zoom],
  );

  const descriptionTranslateY = interpolate(
    interpolate(animationProgress, [0.2, 0.8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
    [0, 1],
    [-DESCRIPTION_HEIGHT, 0],
  );

  const rankTranslateX = interpolate(
    interpolate(animationProgress, [0.8, 0.95], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
    [0, 1],
    [-CARD_WIDTH, 0],
  );

  // ── Image transform ──
  const imageTransform =
    imageAnimation === "flip"
      ? `rotateY(${flipRotateY}deg) scale(${zoom})`
      : imageAnimation === "zoom"
        ? `scale(${imageScale})`
        : `translateY(${imageTranslateY}px) scale(${zoom})`;

  // ── Variant flags ──
  const isLocked = cardVariant === "locked";
  const isSecret = cardVariant === "secret";
  const isUltraRare = cardVariant === "ultra_rare";
  const hasRarity = !!rarityConfig;
  const hasShimmer =
    hasRarity && cardVariant !== "locked" && cardVariant !== "secret";

  const CARD_RADIUS = 30;

  // ── Pulse glow for legend (frame-driven) ──
  const legendPulse =
    cardVariant === "legend" ? 0.7 + 0.3 * Math.sin((frame * Math.PI) / 30) : 1;

  // ── Card border / shadow ──
  // Legend pulse modulates the outer box-shadow intensity
  const legendShadow =
    cardVariant === "legend"
      ? `0 0 ${40 * legendPulse}px ${12 * legendPulse}px #FF6B35CC, 0 0 ${80 * legendPulse}px ${30 * legendPulse}px #FFD70066, 0 0 8px 3px #FF6B35`
      : null;

  const cardStyle: React.CSSProperties = rarityConfig
    ? {
        boxShadow: legendShadow ?? rarityConfig.shadow,
        border: isUltraRare ? undefined : rarityConfig.border,
        position: "relative",
        borderRadius: CARD_RADIUS,
        isolation: "isolate",
      }
    : { position: "relative", borderRadius: CARD_RADIUS, isolation: "isolate" };

  const titleBackground = rarityConfig
    ? rarityConfig.titleGradient
    : ChannelTypeColors[type];

  const imageFilterStyle = isLocked
    ? "blur(12px) brightness(40%)"
    : isSecret
      ? secretFilter(animationProgress)
      : undefined;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        flexShrink: 0,
        justifyContent: "flex-end",
        ...cardStyle,
      }}
    >
      {/* ── Ultra-rare animated rainbow border ── */}
      {isUltraRare && (
        <RainbowBorder frame={frame} width={CARD_WIDTH} height={CARD_HEIGHT} />
      )}

      {/* ── Inset glow overlay ── */}
      {hasRarity && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            pointerEvents: "none",
            boxShadow: rarityConfig!.insetGlow,
          }}
        />
      )}

      {/* ── Legend pulse inner glow (inset) ── */}
      {cardVariant === "legend" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 26,
            pointerEvents: "none",
            borderRadius: CARD_RADIUS,
            boxShadow: `inset 0 0 ${30 * legendPulse}px ${8 * legendPulse}px #FF6B3544`,
          }}
        />
      )}

      {/* ── Image area ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: imageContainerHeight, flexGrow: 1 }}
      >
        {/* Holographic foil (ultra_rare) */}
        {isUltraRare && <HolographicOverlay frame={frame} />}

        {/* Shimmer sweep */}
        {hasShimmer && (
          <ShimmerOverlay
            config={rarityConfig!}
            width={CARD_WIDTH}
            height={IMAGE_HEIGHT}
            frame={frame}
          />
        )}

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
              transform: imageTransform,
              transformOrigin: "center center",
              objectPosition: `calc(50% + ${pan.x}px) calc(50% + ${pan.y}px)`,
              pointerEvents: "none",
              backfaceVisibility: "hidden",
              filter: imageFilterStyle,
            }}
          />
        </div>

        {/* Locked overlay */}
        {isLocked && <LockedOverlay />}

        {/* Secret ??? label */}
        {isSecret && animationProgress < 0.85 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              pointerEvents: "none",
              opacity: interpolate(animationProgress, [0.6, 0.85], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <span
              style={{
                fontSize: 40,
                fontWeight: 900,
                color: "#ffffff99",
                letterSpacing: 6,
                textTransform: "uppercase",
                textShadow: "0 0 20px #fff",
              }}
            >
              ???
            </span>
          </div>
        )}

        {/* Rarity badge (top-right) */}
        {hasRarity && cardVariant !== "locked" && cardVariant !== "secret" && (
          <RarityBadge
            config={rarityConfig!}
            animationProgress={animationProgress}
          />
        )}

        {/* SubTitle badge */}
        <div
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
        </div>
      </div>

      {/* ── Title bar ── */}
      <div
        className="flex items-center justify-center shrink-0 overflow-hidden z-10"
        style={{
          height: TITLE_BAR_HEIGHT,
          transform: `translateX(${titleX}px)`,
        }}
      >
        <h2
          className="w-full text-center font-bold flex items-center justify-center gap-2"
          style={{
            height: `${TITLE_HEIGHT}px`,
            lineHeight: `${TITLE_HEIGHT - 5}px`,
            fontSize: title.fontSize,
            background: titleBackground,
            color: `rgba(255, 255, 255, ${textOpacity})`,
          }}
        >
          {data.title}
        </h2>
      </div>

      {/* ── Description ── */}
      <div
        className="w-full overflow-hidden"
        style={{ height: DESCRIPTION_HEIGHT }}
      >
        <div
          className="p-2.5 pb-3 flex flex-col items-center justify-center text-center"
          style={{
            height: description.height,
            background: description.background,
            color: `rgba(255, 255, 255, ${textOpacity})`,
            transform: `translateY(${descriptionTranslateY}px)`,
          }}
        >
          <div className="text-[40px] font-extrabold -mt-6">
            {data.description.split(/<br\s*\/?>/i).map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
