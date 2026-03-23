import { Composition } from "remotion";
import {
  SingleImageCarousel,
  SingleImageCarouselSchema,
} from "./SingleImageCarousel";
import { data } from "../comic/olderst-characters-marvel";

export const SingleCardSlideShowGame = () => {
  return (
    <Composition
      id="SingleCardSlideShowGame"
      component={SingleImageCarousel}
      fps={60}
      calculateMetadata={({ props }) => {
        return {
          durationInFrames:
            (props.items.length * props.durationPerCard + 20) * 60,
        };
      }}
      width={1920}
      height={1080}
      schema={SingleImageCarouselSchema}
      defaultProps={{
        type: "anime",
        items: data,
        title: {
          height: 100,
          fontSize: 38,
        },
        description: {
          height: 260,
          fontSize: 40,
          background: "linear-gradient(180deg, #1A0B2E 0%, #090919 100%)",
        },
        subTitle: {
          shape: "rect",
          fontSize: 40,
          background: "#000000B3",
          position: "bottom",
        },
        background: "#0f121f",
        durationPerCard: 5,
        imageAnimation: "flip",
        cardVariant: "legend",
      }}
    />
  );
};
