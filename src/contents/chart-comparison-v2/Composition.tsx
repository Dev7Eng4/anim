import { Composition } from "remotion";
import { ChartComparison, ChartComparisonSchema } from "./index";
import { techCompany } from "./tech/tech-company";

const COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#D946EF", // Fuchsia
  "#0EA5E9", // Sky
  "#F43F5E", // Rose
  "#64748B", // Slate
  "#1D4ED8", // Dark Blue
  "#B91C1C", // Dark Red
  "#047857", // Dark Green
  "#B45309", // Dark Amber
  "#4338CA", // Dark Indigo
  "#BE185D", // Dark Pink
  "#6D28D9", // Dark Purple
  "#0F766E", // Dark Teal
  "#C2410C", // Dark Orange
  "#0891B2", // Dark Cyan
  "#4D7C0F", // Dark Lime
  "#A21CAF", // Dark Fuchsia
  "#0369A1", // Dark Sky
  "#9F1239", // Dark Rose
  "#334155", // Dark Slate
];

interface TechItem {
  name: string;
  data: { year: number; value: number }[];
  imageSrc?: string;
  country?: string;
}

export const ChartComparisonCompositionV2 = () => {
  const chartItems = (techCompany as TechItem[]).map((item, index) => ({
    ...item,
    title: item.name,
    data: item.data,
    color: COLORS[index % COLORS.length],
    imageSrc:
      item.imageSrc ||
      `https://logo.clearbit.com/${item.name.toLowerCase().replace(/\s/g, "")}.com`,
  }));

  const minYear = Math.min(
    ...techCompany.flatMap((it) => it.data.map((d) => d.year)),
  );
  const maxYear = Math.max(
    ...techCompany.flatMap((it) => it.data.map((d) => d.year)),
  );
  const numYears = maxYear - minYear;
  const secondsPerMonth = 3; // Tốc độ chạy: 0.5 giây cho 1 tháng
  const animationDuration = numYears * 12 * secondsPerMonth;

  const chartData = {
    title: "",
    items: chartItems,
    secondsPerMonth,
    maxItems: 15,
    barSpacing: 8,
    growthMonths: 3,
    barItemHeight: 58,
    maxBarWidth: 1200,
    labelWidth: 250,
    timeAfter: 10,
  };

  return (
    <Composition
      id="ChartComparisonV2"
      component={ChartComparison}
      durationInFrames={Math.ceil(
        (animationDuration + chartData.timeAfter) * 60,
      )}
      fps={60}
      width={1920}
      height={1080}
      schema={ChartComparisonSchema}
      defaultProps={chartData}
    />
  );
};
