import DualImageCardSlideShow from "./contents/slide-show/DualImageCard";
import { SingleSlideShow } from "./contents/slide-show/SingleImageCard";
import "./index.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <SingleSlideShow />
      {/* <DualImageCardSlideShow /> */}
      {/* <ChartComparisonCompositionV2 />
      <ChartComparisonComposition />
      <Expo3DComposition /> */}
    </>
  );
};
