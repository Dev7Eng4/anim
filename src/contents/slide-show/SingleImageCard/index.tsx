import { Composition } from "remotion";
import {
  SingleImageCarousel,
  SingleImageCarouselSchema,
} from "./SingleImageCarousel";
import { data } from "../amime/onepiece-oldest";

export const SingleSlideShow = () => {
  return (
    <Composition
      id="SingleCardSlideShow"
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
        type: "comic",
        items: data,
        title: {
          height: 130,
          fontSize: 65,
        },
        description: {
          height: 240,
          fontSize: 70,
          background: "linear-gradient(180deg, #1A0B2E 0%, #090919 100%)",
        },
        subTitle: {
          shape: "circle",
          fontSize: 35,
          background: "#000000B3",
          position: "top",
          animation: "flip",
        },
        background: "#0f121f",
        durationPerCard: 4.5,
        imageAnimation: "slide",
      }}
    />
  );
};
