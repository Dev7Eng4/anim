import { Composition } from "remotion";
import {
  SingleImageCarousel,
  SingleImageCarouselSchema,
} from "./SingleImageCarousel";
import { data } from "../comic/most-money-grossing-movies";

export const SingleSlideShow = () => {
  const d = data
    .map((item) => ({
      title: item.title,
      description: item.description,
      gross: item.gross,
    }))
    .sort((a, b) => a.gross - b.gross)
    .slice(0, 50)
    .reverse();

  console.log(d);

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
          height: 180,
          fontSize: 55,
        },
        description: {
          height: 120,
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
