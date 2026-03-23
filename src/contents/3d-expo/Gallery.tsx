import React, { useMemo, useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Frame } from "./Frame";
import { EXHIBITION_DATA } from "./data";

// ── Premium Tile Floor Canvas Texture ───────────────────────────────────────
function createFloorTexture(): THREE.CanvasTexture {
  const S = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  const tileSize = 128; // gạch lớn format cao cấp
  const groutW = 2; // đường vữa mỏng, tinh tế
  const pad = groutW / 2;

  const rng = (seed: number) => {
    const x = Math.sin(seed) * 99999;
    return x - Math.floor(x);
  };

  // Màu gạch cao cấp: marble/porcelain trắng xám với tông ấm
  const baseLight = "#e8e4dc"; // trắng kem nhẹ
  const baseDark = "#d4cfc4"; // xám be đậm hơn
  const groutColor = "#b8b0a0"; // vữa tông trung tính sang trọng

  for (let ty = 0; ty < Math.ceil(S / tileSize) + 1; ty++) {
    for (let tx = 0; tx < Math.ceil(S / tileSize) + 1; tx++) {
      const x = tx * tileSize;
      const y = ty * tileSize;

      // Màu nền mỗi viên - checkerboard tông sáng/tối
      const base = (tx + ty) % 2 === 0 ? baseLight : baseDark;
      ctx.fillStyle = base;
      ctx.fillRect(x + pad, y + pad, tileSize - groutW, tileSize - groutW);

      // Hiệu ứng vân đá nhẹ (marble veining) - vài đường mờ
      ctx.save();
      ctx.globalAlpha = 0.08 + rng(tx * 31 + ty * 17) * 0.06;
      ctx.strokeStyle = "#9a9488";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const veins = 3 + Math.floor(rng(tx * 19) * 3);
      for (let v = 0; v < veins; v++) {
        const vx = x + pad + rng(v * 11 + tx) * (tileSize - groutW);
        const vy = y + pad + rng(v * 23 + ty) * (tileSize - groutW);
        ctx.moveTo(vx, vy);
        ctx.bezierCurveTo(
          vx + (rng(v * 5) - 0.5) * 40,
          vy + (rng(v * 7) - 0.5) * 40,
          vx + (rng(v * 13) - 0.5) * 60,
          vy + (rng(v * 17) - 0.5) * 60,
          vx + (rng(v * 19) - 0.5) * 80,
          vy + (rng(v * 29) - 0.5) * 80,
        );
        ctx.stroke();
      }
      ctx.restore();

      // Gradient nhẹ trong mỗi viên - tạo độ sâu, bóng bóng
      const tileGrad = ctx.createLinearGradient(
        x + pad,
        y + pad,
        x + tileSize - pad,
        y + tileSize - pad,
      );
      tileGrad.addColorStop(0, "rgba(255,252,248,0.15)");
      tileGrad.addColorStop(0.5, "rgba(0,0,0,0)");
      tileGrad.addColorStop(1, "rgba(0,0,0,0.04)");
      ctx.fillStyle = tileGrad;
      ctx.fillRect(x + pad, y + pad, tileSize - groutW, tileSize - groutW);
    }
  }

  // Vẽ lưới đường vữa mỏng, đẹp
  ctx.strokeStyle = groutColor;
  ctx.lineWidth = groutW;
  ctx.lineCap = "square";
  for (let i = 0; i <= S; i += tileSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, S);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(S, i);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(20, 20);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}

// ────────────────────────────────────────────────────────────────────────────
interface GalleryProps {
  secondsPerCard?: number;
  cardSpacing?: number;
  /** Khoảng cách từ camera (màn hình) đến các card - để thống nhất góc nhìn giữa các view */
  cameraDistance: number;
  cardWidth?: number;
  cardHeight?: number;
  legHeight?: number;
  legColor?: string;
  frameColor?: string;
}

export const Gallery: React.FC<GalleryProps> = ({
  secondsPerCard = 10,
  cardSpacing = 38,
  cameraDistance,
  cardWidth = 14,
  cardHeight = 8,
  legHeight = 3.2,
  legColor = "#2a2a2a",
  frameColor = "#2a2a2a",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spacing = cardSpacing;
  const totalDistance = (EXHIBITION_DATA.length - 1) * spacing;

  // Camera travels `spacing` units per card, starting at -spacing/2 before frame 0
  // so that the first card is centered at frame 0
  const framesPerCard = secondsPerCard * fps;
  const cameraX = (frame / framesPerCard) * spacing - spacing / 2;

  // Precompute textures once
  const floorTexture = useMemo(() => createFloorTexture(), []);

  // Ghim cạnh dưới của cardboard cố định tại Y = -3.5 
  // (Khi cardHeight = 8, tâm Y tương ứng là 0.5)
  const cardCenterY = 0.5 + (cardHeight - 8) / 2;

  // Tính toán vị trí sàn sao cho nằm ngay dưới cùng của cụm chân đế
  const borderT = 0.3;
  const lowerBarH = 0.35;
  const baseT = 0.15;
  const legOffsetY = borderT + lowerBarH + legHeight + baseT;
  const floorY = -3.5 - legOffsetY;

  // Khi board giãn cao lên, đẩy hệ thống trần và đèn lên trên để tránh cấn
  const upwardShift = Math.max(0, cardHeight - 8);
  const ceilingY = 14 + upwardShift;
  const lampY = 12 + upwardShift;

  // Cải thiện chất lượng texture khi nhìn từ góc nghiêng với Anisotropy filtering
  const { gl, camera } = useThree();
  useEffect(() => {
    const maxA = gl.capabilities.getMaxAnisotropy();
    floorTexture.anisotropy = maxA;
    floorTexture.needsUpdate = true;
  }, [floorTexture, gl]);

  // Góc nhìn người cao: camera cao hơn (1.6m ~ tầm mắt đứng) → nhìn rõ sàn hơn
  const cameraHeight = 1.6;
  const lookAtHeight = 0.8; // nhìn xuống nhẹ vào card, sàn lộ rõ phía trước
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  // Update camera and light positions directly in the render cycle based on current frame
  camera.position.set(cameraX, cameraHeight, cameraDistance);
  camera.lookAt(cameraX, lookAtHeight, 0);

  if (dirLightRef.current) {
    dirLightRef.current.position.set(cameraX, 15 + upwardShift, 8);
    dirLightRef.current.target.position.set(cameraX, 0, 0);
    dirLightRef.current.target.updateMatrixWorld();
  }

  const backdropW = totalDistance + 120;

  useEffect(() => {
    const light = dirLightRef.current;
    if (!light) return;
    const cam = light.shadow.camera;
    // OPTIMIZATION: Bóp kích thước Shadow map chỉ bao phủ đúng vùng camera đang đứng
    // Gióp bóng đổ siêu sắc nét mà không cần mapSize quá nặng
    cam.left = -40;
    cam.right = 40;
    cam.top = 40;
    cam.bottom = -40;
    cam.near = 1;
    cam.far = 100;
    cam.updateProjectionMatrix();
  }, []);

  return (
    <group>
      {/* ── Ánh sáng phòng: Tăng ambient light để bỏ bớt hàng loạt pointLight nặng nề ── */}
      <ambientLight intensity={2.0} color="#fff8f0" />
      <directionalLight
        ref={dirLightRef}
        position={[0, 15 + upwardShift, 8]}
        intensity={3.8}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* ── Floor (gạch cao cấp bóng) - tự động lún xuống tuỳ vào chiều cao của leg/frame ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[totalDistance / 2, floorY, 15]}
        receiveShadow
      >
        <planeGeometry args={[backdropW * 1.35, 80]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#eae6e0"
          roughness={0.28}
          metalness={0.04}
        />
      </mesh>

      {/* ── Ceiling (dark) ── */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[totalDistance / 2, ceilingY, 5]}
      >
        <planeGeometry args={[backdropW, 60]} />
        <meshStandardMaterial color="#080810" side={THREE.BackSide} />
      </mesh>

      {/* ── Ceiling Lamp Fixtures ── */}
      {Array.from({ length: EXHIBITION_DATA.length + 1 }).map((_, i) => {
        const lx = (i - 0.5) * spacing;
        const ly = lampY; // lamp hanging height
        const lz = 2; // slightly in front of the wall
        return (
          <group key={i} position={[lx, ly, lz]}>
            {/* Lamp socket base */}
            <mesh>
              <boxGeometry args={[0.3, 0.15, 0.3]} />
              <meshBasicMaterial color="#333333" />
            </mesh>
            {/* Lamp cord */}
            <mesh position={[0, 0.75, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
              <meshBasicMaterial color="#222222" />
            </mesh>
            {/* Bulb shade (cone) */}
            <mesh position={[0, 1.6, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.8, 0.9, 16, 1, true]} />
              <meshBasicMaterial color="#444444" side={THREE.DoubleSide} />
            </mesh>
            {/* Glowing bulb — meshBasicMaterial always shines */}
            <mesh position={[0, 1.7, 0]}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshBasicMaterial color="#ffe8a0" />
            </mesh>
            {/* Đã xoá các PointLight nặng nề ở đây để tối ưu hiệu suất render. 
                Shadow vẫn được render đẹp nhờ hệ thống Direction Light Localised phía trên */}
          </group>
        );
      })}

      {/* ── Glass Window Frames (Khung kính nhìn ra ngoài trời) ── */}
      {(() => {
        const windowZ = -25;
        // Chiều cao kính và cột rất lớn để xuyên quá mép trên camera
        const windowH = 100; 
        const mainFrameColor = "#111111"; // Khung đen nhám
        
        const bottomSillH = 0.3; // Tăng lên 3 lần
        const bottomSillTopY = floorY + bottomSillH;
        const windowCenterY = bottomSillTopY + windowH / 2;
        
        const startX = -100;
        const endX = totalDistance + 100;
        
        // FOV 50, distance 42, width visible is ~70. Để 2.5 khoảng hiển thị -> 70 / 2.5 = 28
        const pillarSpacing = 28; 
        const numPillars = Math.ceil((endX - startX) / pillarSpacing) + 1;

        const frames = [];

        // Bottom sill (Thanh ngang dưới)
        frames.push(
          <mesh key="bottom-sill" position={[totalDistance / 2, floorY + bottomSillH / 2, windowZ]}>
            <boxGeometry args={[backdropW * 1.5, bottomSillH, 0.45]} />
            <meshStandardMaterial color={mainFrameColor} roughness={0.6} metalness={0.7} />
          </mesh>
        );

        for (let i = 0; i < numPillars; i++) {
          const px = startX + i * pillarSpacing;
          
          // Main thick pillar (Cột dọc: độ rộng x5)
          frames.push(
            <mesh key={`pillar-${i}`} position={[px, windowCenterY, windowZ]}>
              <boxGeometry args={[0.75, windowH, 0.45]} />
              <meshStandardMaterial color={mainFrameColor} roughness={0.7} metalness={0.5} />
            </mesh>
          );
        }

        // Glass panes (Mặt kính)
        frames.push(
          <mesh key="glass" position={[totalDistance / 2, windowCenterY, windowZ]} receiveShadow>
            <planeGeometry args={[backdropW * 1.5, windowH]} />
            <meshPhysicalMaterial 
              color="#ffffff" 
              transmission={1} 
              opacity={0.1} 
              transparent={true} 
              roughness={0.05} 
              metalness={0.1}
            />
          </mesh>
        );

        return frames;
      })()}

      {/* ── Billboards ── */}
      {EXHIBITION_DATA.map((item, index) => {
        const xPos = index * spacing;
        return (
          <Frame
            key={item.id}
            url={item.imageUrl}
            title={item.title}
            description={item.description}
            powerLevel={item.powerLevel}
            tier={item.tier}
            position={[xPos, cardCenterY, 0]}
            width={cardWidth}
            height={cardHeight}
            legHeight={legHeight}
            legColor={legColor}
            frameColor={frameColor}
          />
        );
      })}
    </group>
  );
};
