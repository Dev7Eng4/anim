import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { staticFile, delayRender, continueRender } from "remotion";

interface BillboardProps {
  position: [number, number, number];
  url: string;
  title: string;
  description: string;
  powerLevel: number;
  tier: string;
  width?: number;
  height?: number;
  legHeight?: number;
  legColor?: string;
  frameColor?: string;
}

// Draw the billboard card onto a canvas and return it as a THREE.CanvasTexture
function useBillboardTexture(
  imageTexture: THREE.Texture | null,
  title: string,
  description: string,
  powerLevel: number,
  tier: string,
): THREE.CanvasTexture | null {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  const texture = useMemo(() => {
    if (!imageTexture) return null;
    const W = 1200;
    const H = 700;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d")!;
    const imgW = Math.round(W * 0.42);

    // === Left: character image ===
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, imgW, H);

    if (imageTexture.image) {
      const src = imageTexture.image as HTMLImageElement | HTMLCanvasElement;
      const srcW = (src as HTMLImageElement).naturalWidth || src.width;
      const srcH = (src as HTMLImageElement).naturalHeight || src.height;
      // cover-fit into left panel
      const scale = Math.max(imgW / srcW, H / srcH);
      const dw = srcW * scale;
      const dh = srcH * scale;
      const dx = (imgW - dw) / 2;
      const dy = (H - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, imgW, H);
      ctx.clip();
      ctx.drawImage(src, dx, dy, dw, dh);
      ctx.restore();
    }

    // === Right panel background ===
    const rightX = imgW;
    const rightW = W - imgW;

    // Top: red POWER LEVEL block
    const topH = Math.round(H * 0.42);
    ctx.fillStyle = "#cc1111";
    ctx.fillRect(rightX, 0, rightW, topH);

    // "POWER LEVEL" label
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.round(H * 0.08)}px Arial Black, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("POWER LEVEL", rightX + rightW / 2, topH * 0.3);

    // Power number (large)
    ctx.font = `bold ${Math.round(H * 0.22)}px Arial Black, sans-serif`;
    ctx.fillText(powerLevel.toLocaleString(), rightX + rightW / 2, topH * 0.68);

    // Middle: dark description block
    const midH = Math.round(H * 0.38);
    const midY = topH;

    // Carbon-fiber-like dark background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(rightX, midY, rightW, midH);

    // subtle diagonal stripe texture
    ctx.save();
    ctx.beginPath();
    ctx.rect(rightX, midY, rightW, midH);
    ctx.clip();
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 8;
    for (let i = -midH; i < rightW + midH; i += 16) {
      ctx.beginPath();
      ctx.moveTo(rightX + i, midY);
      ctx.lineTo(rightX + i + midH, midY + midH);
      ctx.stroke();
    }
    ctx.restore();

    // Description text
    ctx.fillStyle = "#dddddd";
    ctx.font = `bold ${Math.round(H * 0.065)}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = description.split("\n");
    const lineH = Math.round(H * 0.09);
    const totalTextH = lines.length * lineH;
    const textStartY = midY + midH / 2 - totalTextH / 2 + lineH / 2;
    lines.forEach((line, i) => {
      ctx.fillText(
        line.toUpperCase(),
        rightX + rightW / 2,
        textStartY + i * lineH,
      );
    });

    // Bottom: name bar (left=orange) + tier bar (right=white)
    const botH = H - topH - midH;
    const botY = midY + midH;
    const nameW = Math.round(rightW * 0.48);

    // Orange name block
    ctx.fillStyle = "#e05c00";
    ctx.fillRect(rightX, botY, nameW, botH);
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.round(H * 0.072)}px Arial Black, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title.toUpperCase(), rightX + nameW / 2, botY + botH / 2);

    // White/light tier block
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(rightX + nameW, botY, rightW - nameW, botH);
    ctx.fillStyle = "#111111";
    ctx.font = `bold italic ${Math.round(H * 0.065)}px Arial Black, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      tier.toUpperCase(),
      rightX + nameW + (rightW - nameW) / 2,
      botY + botH / 2,
    );

    // Divider between image and right panel
    ctx.strokeStyle = "#888888";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(imgW, 0);
    ctx.lineTo(imgW, H);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    textureRef.current = tex;
    return tex;
  }, [imageTexture, title, description, powerLevel, tier]);

  return texture;
}

export const Frame: React.FC<BillboardProps> = ({
  position,
  url,
  title,
  description,
  powerLevel,
  tier,
  width = 14,
  height = 8,
  legHeight = 3.2,
  legColor = "#2a2a2a",
  frameColor = "#2a2a2a",
}) => {
  const { gl } = useThree();
  const textureUrl = useMemo(() => staticFile(url), [url]);
  const [imageTexture, setImageTexture] = useState<THREE.Texture | null>(null);
  
  const [handle] = useState(() => delayRender(`Loading image ${url}`));

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      textureUrl,
      (texture) => {
        setImageTexture(texture);
        continueRender(handle);
      },
      undefined,
      (err) => {
        console.error(`Error loading texture ${textureUrl}`, err);
        continueRender(handle); // Continue rendering even on error to avoid timeout
      }
    );
  }, [textureUrl, handle]);

  const cardTexture = useBillboardTexture(
    imageTexture,
    title,
    description,
    powerLevel,
    tier,
  );

  // Add High Quality filtering and cleanup on unmount
  useEffect(() => {
    if (cardTexture) {
      cardTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
      cardTexture.needsUpdate = true;
    }
    return () => {
      if (cardTexture) cardTexture.dispose();
    };
  }, [cardTexture, gl]);

  if (!cardTexture) return null; // Don't render until texture is ready

  // Billboard dimensions (16:9-ish card)
  const billboardW = width;
  const billboardH = height;

  // Metal frame thickness
  const borderT = 0.3;

  // Cấu trúc board giống ảnh: mái che, khung, thanh ngang, chân đứng, chân đế
  const frameMaterial = (
    <meshStandardMaterial
      color={frameColor}
      roughness={0.65}
      metalness={0.6}
    />
  );
  
  const legMaterial = (
    <meshStandardMaterial
      color={legColor}
      roughness={0.65}
      metalness={0.6}
    />
  );

  // 1. Mái che (top canopy) - nhô ra phía trước và hai bên
  const canopyW = billboardW + 2.5;
  const canopyD = 1.5;
  const canopyT = 0.25;
  const canopyY = billboardH / 2 + borderT + canopyT / 2;

  // 2. Thanh ngang dưới (lower bar) - nối hai chân
  const lowerBarW = billboardW - 0.5;
  const lowerBarH = 0.35;
  const lowerBarD = 0.6;
  const lowerBarY = -billboardH / 2 - borderT - lowerBarH / 2;

  // 3. Chân đứng (vertical posts)
  const legW = 0.35;
  const legD = 0.4;
  const legXOffset = billboardW * 0.38; // hai bên, hơi vào trong
  const legTopY = -billboardH / 2 - borderT - lowerBarH;
  const legY = legTopY - legHeight / 2;

  // 4. Chân đế (bases) - rộng hơn chân để ổn định
  const baseSize = 0.9;
  const baseT = 0.15;
  const baseY = legY - legHeight / 2 - baseT / 2;

  return (
    <group position={position}>
      {/* ── Main billboard panel ── */}
      <mesh castShadow>
        <planeGeometry args={[billboardW, billboardH]} />
        <meshBasicMaterial map={cardTexture} side={THREE.FrontSide} />
      </mesh>

      {/* ── Khung viền đen/xám đậm quanh màn hình ── */}
      <mesh
        position={[0, billboardH / 2 + borderT / 2, -0.05]}
        castShadow
      >
        <boxGeometry args={[billboardW + borderT * 2, borderT, 0.25]} />
        {frameMaterial}
      </mesh>
      <mesh
        position={[0, -billboardH / 2 - borderT / 2, -0.05]}
        castShadow
      >
        <boxGeometry args={[billboardW + borderT * 2, borderT, 0.25]} />
        {frameMaterial}
      </mesh>
      <mesh
        position={[-billboardW / 2 - borderT / 2, 0, -0.05]}
        castShadow
      >
        <boxGeometry args={[borderT, billboardH, 0.25]} />
        {frameMaterial}
      </mesh>
      <mesh
        position={[billboardW / 2 + borderT / 2, 0, -0.05]}
        castShadow
      >
        <boxGeometry args={[borderT, billboardH, 0.25]} />
        {frameMaterial}
      </mesh>

      {/* ── Mái che phía trên (top canopy) - nhô ra phía trước ── */}
      <mesh position={[0, canopyY, canopyD / 2 + 0.15]} castShadow>
        <boxGeometry args={[canopyW, canopyT, canopyD]} />
        {frameMaterial}
      </mesh>

      {/* ── Thanh ngang dưới nối hai chân ── */}
      <mesh position={[0, lowerBarY, -0.2]} castShadow>
        <boxGeometry args={[lowerBarW, lowerBarH, lowerBarD]} />
        {legMaterial}
      </mesh>

      {/* ── Hai chân đứng (vertical support posts) ── */}
      {[-1, 1].map((side, i) => (
        <group key={i}>
          <mesh
            position={[side * legXOffset, legY, -0.2]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[legW, legHeight, legD]} />
            {legMaterial}
          </mesh>
          {/* Chân đế (base) - tấm đế rộng hơn chân ── */}
          <mesh
            position={[side * legXOffset, baseY, -0.2]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[baseSize, baseT, baseSize * 0.8]} />
            {legMaterial}
          </mesh>
        </group>
      ))}
    </group>
  );
};
