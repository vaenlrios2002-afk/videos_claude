export type Clip = {
  src: string;
  startFromSec: number;
  durationInFrames: number;
  caption: string;
};

export const config = {
  brand: "VALENS",
  handle: "@SOMOSVALENS",
  tagline: "Vístete como la mujer\nen la que te estás convirtiendo.",
  fps: 30,
  width: 1080,
  height: 1920,

  // Música de fondo a bajo volumen — no tapa la voz. Poné "" para versión muda.
  audio: "audio/birds.mp3" as string,
  audioStartFromSec: 0,
  audioFadeInSec: 1.2,
  audioFadeOutSec: 1.8,
  audioVolume: 0.12,

  // Volumen de la voz original de cada toma
  voiceVolume: 1.0,

  // Trim por toma: arrancan donde empieza tu voz, terminan donde termina.
  // Caption = lo que dice según el guion (ajustá el texto si no coincide).
  clips: [
    {
      src: "videos/toma1.mov",
      startFromSec: 1.31,
      durationInFrames: 54, // 1.80s
      caption: "Hola. Soy Valentina.",
    },
    {
      src: "videos/toma4.mov",
      startFromSec: 1.13,
      durationInFrames: 183, // 6.09s
      caption: "Durante años me costó quererme.",
    },
    {
      src: "videos/toma2.mov",
      startFromSec: 1.42,
      durationInFrames: 206, // 6.88s
      caption:
        "Aprender fue lo más difícil que he hecho.\nY también lo más hermoso.",
    },
    {
      src: "videos/toma3.mov",
      startFromSec: 2.34,
      durationInFrames: 42, // 1.40s
      caption: "Por eso nació VALENS.",
    },
    {
      src: "videos/toma5.mov",
      startFromSec: 0.5,
      durationInFrames: 86, // 2.85s
      caption: "Vístete como la mujer\nen la que te estás convirtiendo.",
    },
  ] as Clip[],

  brandFrameDuration: 60, // 2s
};
