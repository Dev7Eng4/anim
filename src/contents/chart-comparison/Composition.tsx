import { Composition } from "remotion";
import { ChartComparison, ChartComparisonSchema } from "./index";
import { chartData, MOVIES } from "./data";
import { data } from "../slide-show/comic/most-money-grossing-movies";

export const ChartComparisonComposition = () => {
  const d = data
    .map((item) => ({
      title: item.title,
      description: item.description,
      gross: item.gross,
    }))
    .sort((a, b) => a.gross - b.gross)
    .reverse()
    .slice(0, 50)
    .reverse();

  console.log(d);

  return (
    <Composition
      id="ChartComparison"
      component={ChartComparison}
      durationInFrames={
        (chartData.animationDuration + (chartData.timeAfter || 0)) * 60
      }
      fps={60}
      width={1920}
      height={1080}
      schema={ChartComparisonSchema}
      defaultProps={chartData}
    />
  );
};
