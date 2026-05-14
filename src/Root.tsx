import { Composition } from "remotion";
import { Birthday } from "./Birthday/Birthday";
import { config } from "./Birthday/config";

const totalDuration = Math.max(
  config.fps,
  config.clips.reduce((acc, clip) => acc + clip.durationInFrames, 0),
);

export const RemotionRoot = () => {
  return (
    <Composition
      id="Birthday"
      component={Birthday}
      durationInFrames={totalDuration}
      fps={config.fps}
      width={config.width}
      height={config.height}
    />
  );
};
