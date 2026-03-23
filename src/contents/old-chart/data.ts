import { ChartComparisonProps } from "./index";
import { mock } from "./mock";

const COLORS = [
  "#FF4D4D", // Red
  "#4D79FF", // Blue
  "#4DFF4D", // Green
  "#FFD700", // Gold
  "#FF4DFF", // Magenta
  "#4DFFFF", // Cyan
  "#FFA500", // Orange
  "#9370DB", // Purple
  "#20B2AA", // Light Sea Green
  "#FF69B4", // Hot Pink
];

// Tạo một mapping màu cố định cho mỗi phim để tránh đổi màu khi rank thay đổi
const movieColors: Record<string, string> = {};
let colorIndex = 0;

mock.forEach((yearEntry) => {
  yearEntry.top_15.forEach((movie) => {
    if (!movieColors[movie.title]) {
      movieColors[movie.title] = COLORS[colorIndex % COLORS.length];
      colorIndex++;
    }
  });
});

// Chuyển đổi mock data thành format series mới
export const chartData: ChartComparisonProps = {
  title: "Highest Grossing Movies Over Time",
  series: mock.map((entry) => ({
    timeLabel: String(entry.year),
    items: entry.top_15.map((movie) => ({
      label: movie.title,
      value: movie.gross,
      color: movieColors[movie.title],
    })),
  })),
  animationDuration: 300,
  maxItems: 15,
};

export const MOVIES = Object.keys(movieColors);
