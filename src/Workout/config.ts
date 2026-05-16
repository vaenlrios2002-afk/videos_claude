export type Clip = {
  src: string;
  startFromSec: number;
  durationInFrames: number;
};

export type Phrase = {
  text: string;
  fromFrame: number;
  durationInFrames: number;
  variant: "beat1" | "beat2";
};

export const config = {
  fps: 30,
  width: 1080,
  height: 1920,

  audio: "audio/pulse.mp3" as string,
  audioStartFromSec: 0,
  audioFadeInSec: 1.5,
  audioFadeOutSec: 3.0,
  audioVolume: 0.65,

  // 3 clips back-to-back (60.7s total)
  clips: [
    { src: "videos/workout1.mov", startFromSec: 0, durationInFrames: 232 },  // 7.73s
    { src: "videos/workout2.mov", startFromSec: 0, durationInFrames: 601 },  // 20.03s
    { src: "videos/workout3.mov", startFromSec: 0, durationInFrames: 990 },  // 33.00s
  ] as Clip[],

  // Cross-dissolve duration between clips (frames of overlap)
  crossDissolveFrames: 12,

  phrases: [
    { text: "Más fuerte.", fromFrame: 270, durationInFrames: 360, variant: "beat1" }, // 9s - 21s
    { text: "Más mía.",    fromFrame: 1380, durationInFrames: 440, variant: "beat2" }, // 46s - end
  ] as Phrase[],

  flashFrames: [270, 1380],
};
