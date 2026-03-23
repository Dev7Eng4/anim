import { Composition } from "remotion";
import { ChartComparison, ChartComparisonSchema } from "./index";
import { chartData, MOVIES } from "./data";

export const ChartComparisonComposition = () => {
  return (
    <Composition
      id="ChartComparison"
      component={ChartComparison}
      durationInFrames={(chartData.animationDuration || 10) * 60}
      fps={60}
      width={1920}
      height={1080}
      schema={ChartComparisonSchema}
      defaultProps={chartData}
    />
  );
};
