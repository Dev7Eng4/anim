import { Composition } from "remotion";
import { GroupChat } from "./GroupChat";
import messages from "../naruto/if naruto joined the akatsuki";
import { FPS } from "../../../constants";

export const GroupChatComp = () => {
  const totalDurationSeconds = messages.reduce((acc, msg) => acc + msg.time, 0);
  const durationInFrames = Math.max(1, totalDurationSeconds * FPS);

  return (
    <Composition
      id="GroupChatSingle"
      component={GroupChat}
      durationInFrames={durationInFrames}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        theme: "light",
        messages,
      }}
    />
  );
};
