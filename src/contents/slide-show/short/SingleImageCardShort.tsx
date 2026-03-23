import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { SingleImageCard, SingleImageData } from "./SingleImageCard";
import { ChannelType } from "../constant";

interface SingleImageCardShortProps {
  data: SingleImageData;
  type: ChannelType;
  rank: number;
  durationInFrames: number;
  title: {
    height: number;
    fontSize: number;
  };
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

export const SingleImageCardShort: React.FC<SingleImageCardShortProps> = ({
  data,
  type,
  rank,
  durationInFrames,
  title,
  description,
  subTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing constants (in seconds)
  const RANK_DISPLAY_TIME = 1;
  const FLIP_DURATION = 0.6; // duration for the flip animation

  const rankFrames = RANK_DISPLAY_TIME * fps;
  const flipFrames = FLIP_DURATION * fps;

  // Flip animation (0 to 180 degrees)
  const flipProgress = interpolate(
    frame,
    [rankFrames, rankFrames + flipFrames],
    [0, 180],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
  );

  // const isBackSide = flipProgress < 90;

  return (
    <AbsoluteFill
      style={
        {
          // perspective: "1200px",
        }
      }
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateY(${flipProgress}deg)`,
        }}
      >
        {/* Back Side (Ranking) */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1A0B2E 0%, #090919 100%)",
            borderRadius: "20px",
            border: "4px solid #5c49eb",
            overflow: "hidden",
          }}
        >
          {/* Progress Circle */}
          <svg
            style={{
              position: "absolute",
              width: "600px",
              height: "600px",
              transform: "rotate(-90deg)",
            }}
            viewBox="0 0 200 200"
          >
            {/* Background Circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(92, 73, 235, 0.2)"
              strokeWidth="8"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#5c49eb"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={
                2 *
                Math.PI *
                90 *
                (1 -
                  interpolate(frame, [0, rankFrames], [0, 1], {
                    extrapolateRight: "clamp",
                  }))
              }
            />
          </svg>

          <div
            style={{
              fontSize: "300px",
              fontWeight: "900",
              color: "#fff",
              textShadow: "0 10px 30px rgba(0,0,0,0.5)",
              fontFamily: "Inter, sans-serif",
              zIndex: 1,
            }}
          >
            {rank}
          </div>
        </div>

        {/* Front Side (Content) */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)", // Correctly orientation after flip
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <SingleImageCard
            isShort
            data={data}
            type={type}
            animationProgress={1}
            title={title}
            description={description}
            subTitle={subTitle}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
