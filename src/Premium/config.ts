export type Clip = {
  src: string;
  durationInFrames: number;
};

export type Phrase = {
  text: string;
  from: number;
  duration: number;
  variant: "intro" | "hero" | "outro";
};

export const config = {
  brand: "EL ARTE DE ELEGIRTE",
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 540,

  audio: "audio/intro.mp3" as string,
  audioStartFromSec: 0,
  audioFadeOutSec: 1.5,

  clips: [
    { src: "videos/IMG_0095.MOV", durationInFrames: 540 },
  ] as Clip[],

  phrases: [
    {
      text: "Hay un lujo\nque solo entienden\nlos que se eligen.",
      from: 30,
      duration: 140,
      variant: "intro",
    },
    {
      text: "Consentite.",
      from: 200,
      duration: 200,
      variant: "hero",
    },
    {
      text: "Date lo que merecés.",
      from: 430,
      duration: 95,
      variant: "outro",
    },
  ] as Phrase[],
};
