import { Composition } from "remotion";
import { SingleImageCarouselSchema } from "../SingleImageCard/SingleImageCarousel";
import { ShortsCarousel } from "./ShortsCarousel";
import { data } from "../amime/hot-search-2025";

export const ShortsSlideShow = () => {
  return (
    <Composition
      id="ShortsSlideShow"
      component={ShortsCarousel}
      fps={60}
      width={1080}
      height={1920}
      schema={SingleImageCarouselSchema}
      calculateMetadata={({ props }) => {
        return {
          durationInFrames:
            (props.items.length * props.durationPerCard + 2) * 60,
        };
      }}
      defaultProps={{
        type: "anime",
        items: data.slice(-10), // Example: top 10
        title: {
          height: 250,
          fontSize: 80,
        },
        description: {
          height: 460,
          fontSize: 60,
          background: "linear-gradient(180deg, #1A0B2E 0%, #090919 100%)",
        },
        subTitle: {
          shape: "rect",
          fontSize: 40,
          background: "#000000B3",
          position: "bottom",
        },
        background: "#0f121f",
        durationPerCard: 4, // 4 seconds per card as requested
      }}
    />
  );
};
