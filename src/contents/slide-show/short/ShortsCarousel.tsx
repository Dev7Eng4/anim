import React from "react";
import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { SingleImageCardShort } from "./SingleImageCardShort";
import { SingleImageCarouselSchema } from "../SingleImageCard/SingleImageCarousel";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Anton";

const { fontFamily } = loadFont();

type ShortsCarouselProps = z.infer<typeof SingleImageCarouselSchema>;

export const ShortsCarousel: React.FC<ShortsCarouselProps> = ({
  items,
  durationPerCard,
  type,
  background,
  title,
  description,
  subTitle,
}) => {
  const { fps } = useVideoConfig();
  const durationInFrames = durationPerCard * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: background }}>
      <Series>
        <Series.Sequence durationInFrames={1.5 * fps} layout="none">
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
            }}
          >
            <h1
              style={{
                fontFamily: fontFamily,
                fontSize: "120px",
                color: "white",
                textAlign: "center",
                textTransform: "uppercase",
                lineHeight: "1.2",
                padding: "0 40px",
              }}
            >
              Top 10 <span style={{ color: "red" }}>hot</span> search <br />
              <span style={{ color: "#5c49eb" }}>in 2025</span>
            </h1>
          </AbsoluteFill>
        </Series.Sequence>
        {items.map((item, index) => {
          // Ranking from items.length down to 1
          const rank = items.length - index;

          return (
            <Series.Sequence
              key={index}
              durationInFrames={durationInFrames}
              layout="none"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    position: "relative",
                  }}
                >
                  <SingleImageCardShort
                    data={item}
                    type={type}
                    rank={rank}
                    durationInFrames={durationInFrames}
                    title={title}
                    description={description}
                    subTitle={subTitle}
                  />
                </div>
              </div>
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
