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

  audio: "audio/suelto.mp3" as string,
  audioStartFromSec: 0,
  audioFadeInSec: 1.5,
  audioFadeOutSec: 3.0,
  audioVolume: 0.7,

  // 3 clips back-to-back (60.7s total)
  clips: [
    { src: "videos/workout1.mov", startFromSec: 0, durationInFrames: 232 },  // 7.73s
    { src: "videos/workout2.mov", startFromSec: 0, durationInFrames: 311 },  // 10.37s
    { src: "videos/workout3.mov", startFromSec: 0, durationInFrames: 734 },  // 24.47s
  ] as Clip[],

  // Cross-dissolve duration between clips (frames of overlap)
  crossDissolveFrames: 12,

  phrases: [
    { text: "Hoy suelto todo.",            fromFrame: 210, durationInFrames: 360, variant: "beat1" }, // 7s - 19s
    { text: "Lo que no me deja ser.",      fromFrame: 900, durationInFrames: 340, variant: "beat2" }, // 30s - 41.3s
  ] as Phrase[],

  // Flashes esparcidos — frases + transiciones de cada clip
  flashFrames: [210, 540, 770, 900, 1150],
};
