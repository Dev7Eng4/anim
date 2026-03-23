import React from "react";
import { Composition, CalculateMetadataFunction } from "remotion";
import { Scene, SceneSchema, SceneProps } from "./Scene";
import { EXHIBITION_DATA } from "./data";

const FPS = 30;
const DEFAULT_SECONDS_PER_CARD = 15;
const DEFAULT_CARD_SPACING = 38;
const DEFAULT_CAMERA_DISTANCE = 17;
const DEFAULT_CARD_WIDTH = 16;
const DEFAULT_CARD_HEIGHT = 10;
const DEFAULT_LEG_HEIGHT = 1.5;
const DEFAULT_LEG_COLOR = "#2a2a2a";
const DEFAULT_FRAME_COLOR = "#2a2a2a";
const OUTRO_SECONDS = 20;

export const Expo3DComposition: React.FC = () => {
  const secondsPerCard = DEFAULT_SECONDS_PER_CARD;
  const cardSpacing = DEFAULT_CARD_SPACING;
  const cameraDistance = DEFAULT_CAMERA_DISTANCE;
  const cardWidth = DEFAULT_CARD_WIDTH;
  const cardHeight = DEFAULT_CARD_HEIGHT;
  const legHeight = DEFAULT_LEG_HEIGHT;
  const legColor = DEFAULT_LEG_COLOR;
  const frameColor = DEFAULT_FRAME_COLOR;
  const totalSeconds = EXHIBITION_DATA.length * secondsPerCard + OUTRO_SECONDS;

  const calculateMetadata: CalculateMetadataFunction<SceneProps> = async () => {
    return {
      defaultCodec: "h264", // Standard MP4 Codec for Chroma Key
      defaultVideoImageFormat: "png", // Keep precise edges
    };
  };

  return (
    <Composition
      id="Expo3D"
      component={Scene}
      durationInFrames={totalSeconds * FPS}
      fps={FPS}
      width={1920}
      height={1080}
      schema={SceneSchema}
      defaultProps={{
        secondsPerCard,
        cardSpacing,
        cameraDistance,
        cardWidth,
        cardHeight,
        legHeight,
        legColor,
        frameColor,
      }}
      calculateMetadata={calculateMetadata}
    />
  );
};
