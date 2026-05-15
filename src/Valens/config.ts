export type Clip = {
  src: string;
  startFromSec: number;
  durationInFrames: number;
  playbackRate?: number;
};

export type Phrase = {
  text: string;
  fromFrame: number;
  durationInFrames: number;
  variant: "intro" | "subtle" | "headline" | "italic" | "brand_word" | "climax";
};

export const config = {
  brand: "VALENS",
  handle: "@SOMOSVALENS",
  tagline: "Vístete como la mujer\nen la que te estás convirtiendo.",
  fps: 30,
  width: 1080,
  height: 1920,

  // Audio: poné "" para versión muda (subir a IG y elegir música de la app)
  audio: "audio/birds.mp3" as string,
  audioStartFromSec: 0,
  audioFadeInSec: 1,
  audioFadeOutSec: 2.5,
  audioVolume: 0.85,

  clips: [
    // Cut 0 — Hook: espaldas/ventana
    { src: "videos/toma4.mov", startFromSec: 0, durationInFrames: 120, playbackRate: 1.0 },
    // Cut 1 — "Hola" — frente a cámara
    { src: "videos/toma1.mov", startFromSec: 0, durationInFrames: 60, playbackRate: 1.0 },
    // Cut 2 — Manos slow-mo (uses 0-3.5s de toma2)
    { src: "videos/toma2.mov", startFromSec: 0, durationInFrames: 150, playbackRate: 0.7 },
    // Cut 3 — "lo más hermoso" — TOMA 1 segunda mitad slow-mo
    { src: "videos/toma1.mov", startFromSec: 1.5, durationInFrames: 90, playbackRate: 0.7 },
    // Cut 4 — Logo VALENS
    { src: "videos/toma3.mov", startFromSec: 0, durationInFrames: 90, playbackRate: 1.0 },
    // Cut 5 — Mirando lejos (uses 4-8s de toma4)
    { src: "videos/toma4.mov", startFromSec: 4, durationInFrames: 120, playbackRate: 1.0 },
    // Cut 6 — Detalle prenda (uses 5-8s de toma2)
    { src: "videos/toma2.mov", startFromSec: 5, durationInFrames: 90, playbackRate: 1.0 },
    // Cut 7 — Climax: TOMA 1 entera al 40% (9s visibles, cámara lenta)
    { src: "videos/toma1.mov", startFromSec: 0, durationInFrames: 270, playbackRate: 0.4 },
  ] as Clip[],

  brandFrameDuration: 60, // 2s final

  phrases: [
    { text: "Durante años\nme costó quererme.", fromFrame: 20, durationInFrames: 95, variant: "intro" },
    { text: "Hola.", fromFrame: 135, durationInFrames: 40, variant: "subtle" },
    { text: "Aprender a hacerlo\nfue lo más difícil.", fromFrame: 195, durationInFrames: 125, variant: "headline" },
    { text: "Pero también\nlo más hermoso.", fromFrame: 345, durationInFrames: 65, variant: "italic" },
    { text: "VALENS", fromFrame: 435, durationInFrames: 70, variant: "brand_word" },
    { text: "Una marca\npara mujeres\nen proceso.", fromFrame: 525, durationInFrames: 100, variant: "headline" },
    { text: "De verse, elegirse\ny quererse.", fromFrame: 645, durationInFrames: 70, variant: "italic" },
    // Climax: renderizado palabra por palabra dentro del componente
    { text: "climax", fromFrame: 740, durationInFrames: 245, variant: "climax" },
  ] as Phrase[],
};
