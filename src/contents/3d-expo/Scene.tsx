import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { z } from "zod";
import { Gallery } from "./Gallery";
import { useVideoConfig } from "remotion";
export const SceneSchema = z.object({
  secondsPerCard: z.number().optional(),
  cardSpacing: z.number().optional(),
  /** Khoảng cách từ camera đến card (đơn vị 3D) - thống nhất góc nhìn */
  cameraDistance: z.number(),
  cardWidth: z.number().optional(),
  cardHeight: z.number().optional(),
  legHeight: z.number().optional(),
  legColor: z.string().optional(),
  frameColor: z.string().optional(),
});

export type SceneProps = z.infer<typeof SceneSchema>;

export const Scene: React.FC<SceneProps> = ({
  secondsPerCard = 15,
  cardSpacing = 38,
  cameraDistance,
  cardWidth = 14,
  cardHeight = 8,
  legHeight = 3.2,
  legColor = "#2a2a2a",
  frameColor = "#2a2a2a",
}) => {
  const { width, height } = useVideoConfig();

  return (
    <div style={{ position: "relative", width, height }}>
      {/* Green Screen Background Layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#00FF00",
          zIndex: 0,
        }}
      />

      {/* 3D Scene Layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ fov: 50 }}
          shadows
          gl={{ alpha: true, antialias: false }} // Tắt làm mịn cạnh để không bị lem viền màu xanh lá
        >
          <React.Suspense fallback={null}>
            <Gallery
              secondsPerCard={secondsPerCard}
              cardSpacing={cardSpacing}
              cameraDistance={cameraDistance}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              legHeight={legHeight}
              legColor={legColor}
              frameColor={frameColor}
            />
          </React.Suspense>
        </ThreeCanvas>
      </div>
    </div>
  );
};
