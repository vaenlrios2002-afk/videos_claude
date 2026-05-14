export type Clip = {
  src: string;
  durationInFrames: number;
};

export const config = {
  name: "Cumpleañero",
  fps: 30,
  width: 1920,
  height: 1080,
  clips: [
    // Ejemplos: copia tus videos a public/videos/ y descomenta/edita.
    // { src: "videos/clip1.mp4", durationInFrames: 120 },
    // { src: "videos/clip2.mp4", durationInFrames: 90 },
  ] as Clip[],
};
