export const config = {
  brand: "VALENS",
  handle: "@SOMOSVALENS",
  tagline: "Vístete como la mujer\nen la que te estás convirtiendo.",
  fps: 30,
  width: 1080,
  height: 1920,

  clip: {
    src: "videos/teaser.mov",
    startFromSec: 0,
    durationInFrames: 654, // 21.8s del clip
  },

  brandFrameDuration: 90, // 3s

  audio: "audio/birds.mp3" as string,
  audioStartFromSec: 0,
  audioFadeInSec: 1.0,
  audioFadeOutSec: 2.0,
  audioVolume: 0.5,

  // Reveal de la frase: dos beats que se reemplazan
  phrases: {
    beatA: {
      text: "No es ropa.",
      from: 75,           // 2.5s
      duration: 195,      // visible ~6.5s (75-270)
    },
    beatB: {
      // "Es recordatorio." — "recordatorio" se renderiza en dorado itálica
      pre: "Es",
      accent: "recordatorio.",
      from: 285,          // 9.5s (15-frame overlap con beatA al cierre)
      duration: 270,      // visible ~9s (285-555)
    },
  },
};
