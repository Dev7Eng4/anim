import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
} from "remotion";
import { useChartData } from "./use-chart-data";
import { z } from "zod";

// Schema cho dữ liệu chart
export const ChartComparisonSchema = z
  .object({
    title: z.string(),
    // Thời gian (giây) để chạy 1 tháng
    secondsPerMonth: z.number(),
    // Giới hạn số lượng item hiển thị cùng lúc
    maxItems: z.number(),
    // Khoảng cách giữa các bar
    barSpacing: z.number(),
    // Khoảng thời gian (tháng) để một item đạt được gross tối đa (cho birth-based logic)
    growthMonths: z.number(),
    // Chiều cao của mỗi bar
    barItemHeight: z.number(),

    // Chiều dài max của line
    maxBarWidth: z.number(),
    // Chiều rộng của label area
    labelWidth: z.number(),
    // Thời gian chờ sau khi chạy xong (giây)
    timeAfter: z.number(),
    items: z.array(
      z
        .object({
          title: z.string(),
          data: z
            .array(z.object({ year: z.number(), value: z.number() }))
            .optional(),
          startTime: z.string().optional(), // Định dạng MM/YYYY
          gross: z.number().optional(),
          color: z.string().optional(),
          imageSrc: z.string().optional(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

export type ChartComparisonProps = z.infer<typeof ChartComparisonSchema>;

const COLOR_BG = "#ffffff";
const COLOR_TEXT = "#000000";
const COLOR_MUTED = "#000";
const COLOR_AXIS = "#000000";
const DEFAULT_BAR_COLOR = "#D4AF37";

export const ChartComparison: React.FC<ChartComparisonProps> = (props) => {
  const {
    title,

    maxItems = 15,
    barSpacing = 20,
    barItemHeight = 50,
    maxBarWidth = 1350,
    labelWidth = 350,
  } = props;

  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Use the optimized hook
  const { getDataAtFrame, getSmoothY, items } = useChartData({
    ...props,
    fps,
  });
  console.log("🚀 ~ ChartComparison ~ items:", items);

  // Calculate state at any given frame
  // Clamp frame to totalFrames - 1 to hold the final state during "timeAfter"
  // Actually useChartData handles clamping internally in getDataAtFrame if we pass a larger frame,
  // but let's be explicit
  const {
    values: currentValuesMap,
    ranks: currentRanksMap,
    monthDisp,
  } = getDataAtFrame(frame);

  const fromMonths = (totalMonths: number) => {
    const monthIndex = Math.floor(Math.max(0, totalMonths)) % 12;
    const years = Math.floor(Math.max(0, totalMonths) / 12);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[monthIndex]} ${years}`;
  };

  const currentTimeLabel = fromMonths(monthDisp);
  const maxValue = Math.max(...Object.values(currentValuesMap), 1);

  // Thu thập thông tin hiển thị
  const allLabels = Array.from(new Set(items.map((it) => it.title)));
  const labelColors: Record<string, string | undefined> = {};
  items.forEach((it) => {
    if (it.color) labelColors[it.title] = it.color;
  });

  // Cấu hình layout
  const padding = 25; // Viền ngoài video
  const chartPaddingLeft = 0;

  // Tổng khoảng cách từ lề trái video đến điểm 0 của bar
  const totalLeftOffset = padding + chartPaddingLeft + labelWidth;

  const chartWidth = maxBarWidth;
  const barHeight = barItemHeight;

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

  // Render các bar dựa trên allLabels để giữ identity ổn định
  const bars = allLabels.map((label) => {
    const interpolatedValue = currentValuesMap[label] || 0;
    const currentRank = currentRanksMap[label] ?? 999;

    const itemData = items.find((i) => i.title === label) as any;

    // Check if active (forced visible) logic?
    // In original code: activeItemIndex logic.
    // In optimized code: `useChartData` doesn't expose activeItemTitle explicitly per frame easily?
    // But `useChartData` ranking/smoothY logic handles it?
    // The opacity logic in original:
    // const isForcedVisible = label === activeItemTitle;
    // We lost `activeItemTitle`.
    // However, `useChartData` handles "force visible" by adjusting rank to `maxItems-1` for intro items.
    // So `currentRank` should already reflect that forcing.

    const yPosition = getSmoothY(
      items.findIndex((i) => i.title === label),
      frame,
    );

    const finalOpacity = interpolate(
      currentRank,
      [maxItems - 0.5, maxItems],
      [interpolatedValue > 0 ? 1 : 0, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    const barWidth = (interpolatedValue / maxValue) * chartWidth;

    if (finalOpacity <= 0 && currentRank >= maxItems) return null;

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
            fontSize: 30,
            fontWeight: 500,
            textAlign: "right",
            paddingRight: 10,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}

          {/* <span className="text-3xl">[Netherlands]</span> */}
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
            className="flex justify-end mr-1 text-white items-center text-3xl pr-2"
            style={{
              width: barWidth,
              height: barHeight,
              backgroundColor: labelColors[label] || DEFAULT_BAR_COLOR,
              border: "1px solid rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            {/* {itemData.country} */}
          </div>
          <Img
            src={
              itemData?.imageSrc ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMAX_logo.svg/2560px-IMAX_logo.svg.png"
            }
            style={{
              maxWidth: 150,
              width: "auto",
              height: 56,
            }}
          />
          {/* <Img
            src={
              items.find((i) => i.title === label)?.imageSrc ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMAX_logo.svg/2560px-IMAX_logo.svg.png"
            }
            style={{
              maxWidth: 150,
              width: "auto",
              height: 56,
            }}
          /> */}

          <span className="ml-2 text-3xl">[{itemData.country}]</span>

          {/* Giá trị hiển thị bên phải thanh bar */}
          <span
            className="ml-2"
            style={{
              // position: "absolute",
              // left: barWidth + barValueGap,
              color: COLOR_TEXT,
              fontSize: 30,
              fontWeight: 600,
              whiteSpace: "nowrap",
              // textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            ${Math.round(interpolatedValue).toLocaleString()}
          </span>
        </div>
      </div>
    );
  });

  // console.log("🚀 ~ ChartComparison ~ bars:", bars);

  // Calculate total height of chart based on maxItems
  const activeChartHeight =
    maxItems * barItemHeight + (maxItems - 1) * barSpacing;

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
            marginLeft: totalLeftOffset - padding, // Trừ padding vì parent AbsoluteFill đã có padding
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
                fontSize: 24,
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
              // paddingBottom: 20, // remove padding bottom if height is fixed
              height: activeChartHeight, // Apply explicit height
            }}
          >
            {/* Vertical Grid Lines */}
            {axisTicks.map((tickValue) => (
              <div
                key={tickValue}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left:
                    totalLeftOffset -
                    padding +
                    (tickValue / maxValue) * chartWidth,
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
            <div className="absolute bottom-0 right-0 z-10 text-[100px] font-bold text-black pointer-events-none">
              {currentTimeLabel}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
