export type Cut = {
  src: string;
  startFromSec: number;
  durationInFrames: number;
};

export type TextOverlay = {
  text: string;
  fromFrame: number;
  durationInFrames: number;
  variant: "hook" | "reveal" | "cta";
};

export const config = {
  brand: "HAND'S GOD",
  handle: "@handsgod",
  cta: "Reservá tu sesión",

  fps: 30,
  width: 1080,
  height: 1920,

  audio: "audio/pulse.mp3" as string,
  audioStartFromSec: 0,
  audioFadeInSec: 0.8,
  audioFadeOutSec: 2.0,
  audioVolume: 0.18,         // música de fondo, no compite con la voz

  voiceVolume: 1.0,          // volumen del audio original (la voz de cada toma)

  // 4 cortes esparcidos del clip de 80s.
  // Ajustá startFromSec si conocés mejor el material.
  cuts: [
    { src: "videos/spa.mp4", startFromSec: 8, durationInFrames: 150 },  // 0-5s
    { src: "videos/spa.mp4", startFromSec: 22, durationInFrames: 150 }, // 5-10s
    { src: "videos/spa.mp4", startFromSec: 38, durationInFrames: 150 }, // 10-15s
    { src: "videos/spa.mp4", startFromSec: 58, durationInFrames: 150 }, // 15-20s
  ] as Cut[],

  brandFrameDuration: 60, // 2s

  textOverlays: [
    { text: "No es vanidad.", fromFrame: 24, durationInFrames: 130, variant: "hook" },
    { text: "Es respeto.", fromFrame: 180, durationInFrames: 200, variant: "reveal" },
    { text: "Cuidate como\nel hombre que ya sos.", fromFrame: 430, durationInFrames: 150, variant: "cta" },
  ] as TextOverlay[],
};
