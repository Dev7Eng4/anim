import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { z } from "zod";

// Schema cho dữ liệu chart
export const ChartComparisonSchema = z.object({
  title: z.string().optional(),
  // Chuỗi các trạng thái theo thời gian
  series: z.array(
    z.object({
      timeLabel: z.string(),
      items: z.array(
        z.object({
          label: z.string(),
          value: z.number(),
          color: z.string().optional(),
        }),
      ),
    }),
  ),
  // Thời gian để animate (tính bằng giây)
  animationDuration: z.number().optional().default(2),
  // Giới hạn số lượng item hiển thị
  maxItems: z.number().optional().default(15),
});

export type ChartComparisonProps = z.infer<typeof ChartComparisonSchema>;

const COLOR_BG = "#0a0a0a";
const COLOR_TEXT = "#ffffff";
const COLOR_MUTED = "#888888";
const COLOR_AXIS = "#333333";
const DEFAULT_BAR_COLOR = "#D4AF37";

export const ChartComparison: React.FC<ChartComparisonProps> = ({
  title,
  series,
  animationDuration = 2,
  maxItems = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Thu thập tất cả labels duy nhất từ series để giữ identity ổn định
  const allLabels = Array.from(
    new Set(series.flatMap((s) => s.items.map((it) => it.label))),
  );

  // Cấu hình layout
  const padding = 25; // Khoảng cách từ text/chart ra viền video
  const chartMarginLeft = 0;
  const chartPaddingLeft = 20;
  const labelWidth = 350; // Chiều rộng mới của label
  const totalLeftOffset =
    padding + chartMarginLeft + chartPaddingLeft + labelWidth;

  const chartHeight = height - 300;
  const chartWidth = width - totalLeftOffset - padding;
  const barHeight = Math.min(60, chartHeight / maxItems - 10);
  const barSpacing = 20;

  // Tính toán thời gian hiện tại dựa trên frame
  const numTimePoints = series.length;
  const totalFrames = animationDuration * fps;
  const timeProgress = interpolate(frame, [0, totalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });

  const currentTimeIndex = Math.floor(timeProgress * (numTimePoints - 1));
  const nextTimeIndex = Math.min(currentTimeIndex + 1, numTimePoints - 1);
  const segmentProgress = (timeProgress * (numTimePoints - 1)) % 1;

  // Hàm lấy giá trị của một label tại một time index
  const getValueAt = (label: string, index: number) => {
    const item = series[index].items.find((it) => it.label === label);
    return item ? item.value : 0;
  };

  // Tính toán giá trị hiện tại của tất cả items
  const currentValuesMap: Record<string, number> = {};
  allLabels.forEach((label) => {
    const val = getValueAt(label, currentTimeIndex);
    const nxt = getValueAt(label, nextTimeIndex);
    currentValuesMap[label] = interpolate(segmentProgress, [0, 1], [val, nxt], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  const currentValues = allLabels.map((l) => currentValuesMap[l]);

  // Giá trị cao nhất tại frame hiện tại
  const maxValue = Math.max(...currentValues, 1);

  // Tìm màu sắc cho từng label
  const labelColors: Record<string, string | undefined> = {};
  allLabels.forEach((label) => {
    for (const s of series) {
      const it = s.items.find((i) => i.label === label);
      if (it && it.color) {
        labelColors[label] = it.color;
        break;
      }
    }
  });

  // Tính toán các mốc giá trị "đẹp"
  const getTicks = (max: number) => {
    const roughStep = max / 4;
    if (roughStep === 0) return [0];
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const normalizedStep = roughStep / magnitude;
    let step;
    if (normalizedStep < 1.5) step = magnitude;
    else if (normalizedStep < 3) step = 2 * magnitude;
    else if (normalizedStep < 7) step = 5 * magnitude;
    else step = 10 * magnitude;
    const ticks = [];
    for (let val = 0; val <= max; val += step) {
      ticks.push(val);
    }
    return ticks;
  };

  const axisTicks = getTicks(maxValue);

  // Smooth Y position calculation
  const getSmoothY = (itemLabel: string, currentFrame: number) => {
    const windowSize = 10; // Giảm window size để phản ứng nhanh hơn
    let totalY = 0;

    for (let i = 0; i < windowSize; i++) {
      const f = Math.max(0, currentFrame - i);
      const fProgress = interpolate(f, [0, totalFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.linear,
      });

      const fTimeIndex = Math.floor(fProgress * (numTimePoints - 1));
      const fNextTimeIndex = Math.min(fTimeIndex + 1, numTimePoints - 1);
      const fSegmentProgress = (fProgress * (numTimePoints - 1)) % 1;

      const fItems = allLabels.map((label) => {
        const val = getValueAt(label, fTimeIndex);
        const nxt = getValueAt(label, fNextTimeIndex);
        return {
          label,
          currentValue: interpolate(fSegmentProgress, [0, 1], [val, nxt], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        };
      });

      const fSorted = fItems.sort((a, b) => b.currentValue - a.currentValue);
      const fRank = fSorted.findIndex((it) => it.label === itemLabel);
      totalY += fRank * (barHeight + barSpacing);
    }

    return totalY / windowSize;
  };

  // Tính toán rank hiện tại để lọc Top 15
  const sortedByCurrentValue = allLabels
    .map((label) => ({ label, value: currentValuesMap[label] }))
    .sort((a, b) => b.value - a.value);

  // Render các bar dựa trên allLabels để giữ identity ổn định
  const bars = allLabels.map((label, index) => {
    const interpolatedValue = currentValuesMap[label];
    const currentRank = sortedByCurrentValue.findIndex(
      (it) => it.label === label,
    );

    // Vị trí Y mượt mà
    const yPosition = getSmoothY(label, frame);

    // Tính toán opacity dựa trên rank và giá trị
    // Nếu rank > maxItems hoặc giá trị = 0, opacity sẽ về 0
    const finalOpacity = interpolate(
      currentRank,
      [maxItems - 0.5, maxItems],
      [interpolatedValue > 0 ? 1 : 0, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    // Chiều rộng của bar
    const barWidth = (interpolatedValue / maxValue) * chartWidth;

    if (finalOpacity <= 0 && currentRank >= maxItems + 2) return null;

    return (
      <div
        key={label}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          height: barHeight,
          transform: `translateY(${yPosition}px)`,
          opacity: finalOpacity,
          pointerEvents: finalOpacity === 0 ? "none" : "auto",
        }}
      >
        {/* Label bên trái */}
        <div
          style={{
            width: labelWidth,
            color: COLOR_TEXT,
            fontSize: 24,
            fontWeight: 500,
            textAlign: "right",
            paddingRight: 30,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </div>

        {/* Bar container */}
        <div
          style={{
            flex: 1,
            height: barHeight,
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Bar */}
          <div
            style={{
              width: barWidth,
              height: barHeight,
              backgroundColor: labelColors[label] || DEFAULT_BAR_COLOR,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 10,
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Giá trị hiển thị trên bar */}
            <span
              style={{
                color: COLOR_TEXT,
                fontSize: 14,
                fontWeight: 600,
                opacity: barWidth > 60 ? 1 : 0,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {Math.round(interpolatedValue).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOR_BG,
        padding,
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Title */}
      {title && (
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            color: COLOR_TEXT,
            fontSize: 48,
            fontWeight: 600,
          }}
        >
          {title}
        </div>
      )}

      {/* Chart Container */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginLeft: chartMarginLeft + chartPaddingLeft + labelWidth,
            marginRight: 0,
            width: chartWidth,
            position: "relative",
            height: 30,
            borderBottom: `1px solid ${COLOR_AXIS}`,
            marginBottom: 20,
          }}
        >
          {axisTicks.map((tickValue) => (
            <div
              key={tickValue}
              style={{
                position: "absolute",
                left: `${(tickValue / maxValue) * 100}%`,
                transform: "translateX(-50%)",
                color: COLOR_MUTED,
                fontSize: 14,
                whiteSpace: "nowrap",
                bottom: 10,
              }}
            >
              {tickValue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                notation: "compact",
              })}
            </div>
          ))}
        </div>

        {/* Chart Area Container */}
        <div
          style={{
            display: "flex",
            flex: 1,
            marginBottom: 20,
          }}
        >
          {/* Chart Area */}
          <div
            style={{
              flex: 1,
              position: "relative",
              paddingLeft: chartPaddingLeft,
              paddingBottom: 20,
              marginLeft: chartMarginLeft,
            }}
          >
            {/* Vertical Grid Lines (Đường lưới dọc đại diện cho giá trị) */}
            {axisTicks.map((tickValue) => (
              <div
                key={tickValue}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `calc(${chartPaddingLeft}px + ${labelWidth}px + ${tickValue / maxValue} * (100% - ${chartPaddingLeft}px - ${labelWidth}px))`,
                  borderLeft: `1px solid ${COLOR_AXIS}`,
                  opacity: 0.2,
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Bars Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                zIndex: 1,
              }}
            >
              {bars}
            </div>

            {/* Current Year Display (timeLabel) */}
            <div
              style={{
                position: "absolute",
                bottom: 40,
                right: 40,
                fontSize: 120,
                fontWeight: 800,
                color: COLOR_TEXT,
                opacity: 0.15,
                fontFamily: "tabular-nums",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              {series[currentTimeIndex].timeLabel}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
