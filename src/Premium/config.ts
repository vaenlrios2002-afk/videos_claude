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

  // Dejá "" mientras no haya archivo en public/audio/.
  // Cuando copies tu mp3 a public/audio/intro.mp3, cambialo a "audio/intro.mp3".
  audio: "" as string,
  audioStartFromSec: 0,
  audioFadeOutSec: 1.5,

  clips: [
    // Copia tus mp4 a public/videos/ y descomenta:
    // { src: "videos/clip1.mp4", durationInFrames: 180 },
    // { src: "videos/clip2.mp4", durationInFrames: 180 },
    // { src: "videos/clip3.mp4", durationInFrames: 180 },
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
