import { Composition } from "remotion";
import { Birthday } from "./Birthday/Birthday";
import { config as birthdayConfig } from "./Birthday/config";
import { Premium } from "./Premium/Premium";
import { config as premiumConfig } from "./Premium/config";

const birthdayDuration = Math.max(
  birthdayConfig.fps,
  birthdayConfig.clips.reduce((acc, c) => acc + c.durationInFrames, 0),
);

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Premium"
        component={Premium}
        durationInFrames={premiumConfig.durationInFrames}
        fps={premiumConfig.fps}
        width={premiumConfig.width}
        height={premiumConfig.height}
      />
      <Composition
        id="PremiumVertical"
        component={Premium}
        durationInFrames={premiumConfig.durationInFrames}
        fps={premiumConfig.fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="Birthday"
        component={Birthday}
        durationInFrames={birthdayDuration}
        fps={birthdayConfig.fps}
        width={birthdayConfig.width}
        height={birthdayConfig.height}
      />
    </>
  );
};
