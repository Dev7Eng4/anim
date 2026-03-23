import { ChartComparisonProps } from "./index";
import { data } from "./new";

const COLORS = [
  "#202147", // Light Sea Green
  "#16A34A", // Green
  "#000000", // Black
  "#F59E0B", // Amber
  "#7C3AED", // Purple
  "#0891B2", // Cyan
  "#DB2777", // Pink
  "#4B5563", // Gray
  "#65A30D", // Lime
  "#EA580C", // Orange
  "#0F766E", // Teal
  "#af73e6", // Violet
  "#1D4ED8", // Deep Blue
  "#15803D", // Dark Green
  "#B91C1C", // Dark Red
];

// Config values matching index.tsx defaultProps
const MAX_ITEMS = 15;
const GROWTH_MONTHS = 3;

function toMonths(dateStr: string) {
  const [m, y] = dateStr.split("/").map(Number);
  return y * 12 + (m - 1);
}

// Prepare items with dynamic color assignment logic
const processedItems: ((typeof data)[0] & { color?: string })[] = [];
const activeItems: {
  title: string;
  startTime: number;
  gross: number;
  currentVal: number;
  color: string;
}[] = [];

// Helper to get next available color for initial filling
let colorIndex = 0;
const getNextColor = () => COLORS[colorIndex++ % COLORS.length];

for (const item of data) {
  const itemStartMonth = toMonths(item.startTime);

  // 1. Advance simulation for current active items to this new item's start time
  activeItems.forEach((act) => {
    const monthsDiff = itemStartMonth - act.startTime;
    const progress = Math.min(Math.max(monthsDiff / GROWTH_MONTHS, 0), 1);
    act.currentVal = act.gross * progress;
  });

  // 2. Sort by current value descending to determine rankings
  activeItems.sort((a, b) => b.currentVal - a.currentVal);

  // 3. Logic to determine if new item enters and what color it gets
  if (activeItems.length < MAX_ITEMS) {
    // Top up to MAX_ITEMS: Assign new unique color
    const color = getNextColor();
    const newItem = {
      ...item,
      color,
      startTime: itemStartMonth, // Store simple number for simulation
      currentVal: 0,
    };
    activeItems.push(newItem);
    processedItems.push({ ...item, color });
  } else {
    // Chart is full
    const minItem = activeItems[MAX_ITEMS - 1]; // The item at rank 15 (last visible)

    // Check if new item qualifies to enter (beating the current lowest value)
    if (item.gross > minItem.currentVal) {
      // Find a victim to replace.
      // Strategy: Replace the lowest ranking item that is NOT "protected" (currently growing).
      // If all items are protected, we must replace the lowest ranking item (minItem).
      let victimIndex = -1;

      for (let i = activeItems.length - 1; i >= 0; i--) {
        const act = activeItems[i];
        const age = itemStartMonth - act.startTime;
        const isProtected = age < GROWTH_MONTHS;

        if (!isProtected) {
          victimIndex = i;
          break; // Found our victim
        }
      }

      // If no suitable non-protected victim found, fallback to lowest item
      if (victimIndex === -1) {
        victimIndex = MAX_ITEMS - 1;
      }

      const victim = activeItems[victimIndex];
      const inheritedColor = victim.color;

      // Remove the victim
      activeItems.splice(victimIndex, 1);

      const newItem = {
        ...item,
        color: inheritedColor,
        startTime: itemStartMonth,
        currentVal: 0,
      };

      activeItems.push(newItem);
      processedItems.push({ ...item, color: inheritedColor });
    } else {
      // Item skipped
      processedItems.push({ ...item, color: undefined });
    }
  }
}

export const chartData: ChartComparisonProps = {
  title: "",
  items: processedItems, // Use processed items with assigned colors
  animationDuration: 650,
  maxItems: MAX_ITEMS,
  barSpacing: 8, // Tăng khoảng cách giữa các bar
  growthMonths: GROWTH_MONTHS, // Tăng thời gian growth lên 3 tháng
  barItemHeight: 58, // Chiều cao của mỗi bar
  jumpDuration: 0.15, // Tốc độ nhảy tháng (giây/tháng)
  maxBarWidth: 1150,
  labelWidth: 350,
  timeAfter: 10,
};

export const MOVIES = processedItems.map((i) => i.title);
