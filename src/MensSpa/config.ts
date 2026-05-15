export type TextOverlay = {
  text: string;
  fromFrame: number;
  durationInFrames: number;
  variant: "hook" | "reveal" | "philosophy" | "cta";
};

export const config = {
  brand: "HAND'S GOD",
  handle: "@handsgod",
  cta: "Reservá tu sesión",

  fps: 30,
  width: 1080,
  height: 1920,

  // Clip único, full duration (80.5s)
  clip: {
    src: "videos/spa.mp4",
    startFromSec: 0,
    durationInFrames: 2415, // 80.5s @ 30fps
  },

  brandFrameDuration: 90, // 3s

  audio: "audio/pulse.mp3" as string,
  audioStartFromSec: 0,
  audioFadeInSec: 1.0,
  audioFadeOutSec: 2.5,
  audioVolume: 0.18,         // música de fondo
  voiceVolume: 1.0,          // voz original al 100%

  // Frases espaciadas a lo largo de los 80s con transiciones de cross-fade
  textOverlays: [
    // Frase 1 — hook (4s a 14s)
    { text: "No es vanidad.", fromFrame: 120, durationInFrames: 300, variant: "hook" },

    // Frase 2 — reveal (32s a 44s) — "respeto" en dorado itálica
    { text: "Es respeto.", fromFrame: 960, durationInFrames: 360, variant: "reveal" },

    // Frase 3 — philosophy (54s a 65s)
    { text: "Para hombres\nque se eligen.", fromFrame: 1620, durationInFrames: 330, variant: "philosophy" },

    // Frase 4 — CTA setup (70s a 79s)
    { text: "Cuidate como\nte merecés.", fromFrame: 2100, durationInFrames: 270, variant: "cta" },
  ] as TextOverlay[],

  // Light leaks cálidos en los momentos de entrada de cada frase
  flashFrames: [120, 960, 1620, 2100, 2415],
};
