import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { config, type Clip, type Phrase } from "./config";

const { fontFamily: serif } = loadCormorant("normal", {
  weights: ["300", "400", "500"],
  subsets: ["latin"],
});
loadCormorant("italic", { weights: ["400", "500"], subsets: ["latin"] });

const COLORS = {
  bg: "#0a0805",
  peach: "#f4d9c4",
  cream: "#faf2e8",
  warmFlash: "rgba(248, 218, 188, 0.92)",
  overlay: "rgba(20, 12, 8, 0.20)",
  vignette:
    "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
};

// IG safe area for vertical
const SAFE = { x: 80, top: 260, bottom: 380 };

// Soft aesthetic warm grade — peachy/dreamy, lifts shadows, slightly desaturates
const VIDEO_FILTER =
  "saturate(0.88) contrast(1.06) brightness(1.06) sepia(0.08) hue-rotate(-4deg)";

const GRAIN_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.95   0 0 0 0 0.85   0 0 0 0 0.72   0 0 0 0.4 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
  );

const ClipShot = ({
  clip,
  fps,
  clipIndex,
  startFrame,
}: {
  clip: Clip;
  fps: number;
  clipIndex: number;
  startFrame: number;
}) => {
  const frame = useCurrentFrame();
  // Cross-dissolve in (only after the first clip)
  const isFirst = clipIndex === 0;
  const isLast = clipIndex === config.clips.length - 1;
  const xfade = config.crossDissolveFrames;

  const fadeIn = isFirst
    ? 1
    : interpolate(frame, [0, xfade], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
  // Cross-dissolve out (only before the last clip)
  const fadeOut = isLast
    ? 1
    : interpolate(
        frame,
        [clip.durationInFrames - xfade, clip.durationInFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
  const opacity = Math.min(fadeIn, fadeOut);

  // Very subtle drift per clip — micro Ken Burns
  const scale = interpolate(
    frame,
    [0, clip.durationInFrames],
    [1.02, 1.06],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo
          src={staticFile(clip.src)}
          startFrom={Math.round(clip.startFromSec * fps)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: VIDEO_FILTER,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: COLORS.overlay }} />
      <AbsoluteFill style={{ background: COLORS.vignette }} />
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN_DATA_URI}")`,
          backgroundSize: "320px 320px",
          opacity: 0.1,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const ClipTrack = ({ fps }: { fps: number }) => {
  let cursor = 0;
  const xfade = config.crossDissolveFrames;
  return (
    <>
      {config.clips.map((clip, i) => {
        const from = cursor;
        cursor += clip.durationInFrames - xfade;
        return (
          <Sequence key={i} from={from} durationInFrames={clip.durationInFrames}>
            <ClipShot clip={clip} fps={fps} clipIndex={i} startFrame={from} />
          </Sequence>
        );
      })}
    </>
  );
};

const Flash = ({ centerFrame, peak = 0.14 }: { centerFrame: number; peak?: number }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [centerFrame - 6, centerFrame, centerFrame + 22],
    [0, peak, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.warmFlash, opacity, pointerEvents: "none" }}
    />
  );
};

const PhraseOverlay = ({ phrase }: { phrase: Phrase }) => {
  const frame = useCurrentFrame();
  const local = frame - phrase.fromFrame;

  const fadeIn = interpolate(local, [0, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(
    local,
    [phrase.durationInFrames - 32, phrase.durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);
  const rise = interpolate(local, [0, 40], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const isBeat2 = phrase.variant === "beat2";

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: SAFE.x,
        paddingRight: SAFE.x,
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
        opacity,
        transform: `translateY(${-30 + rise}px)`,
      }}
    >
      <h2
        style={{
          color: isBeat2 ? COLORS.peach : COLORS.cream,
          fontFamily: serif,
          fontWeight: isBeat2 ? 500 : 400,
          fontStyle: isBeat2 ? "italic" : "normal",
          fontSize: isBeat2 ? 168 : 152,
          letterSpacing: "0.01em",
          lineHeight: 1.1,
          margin: 0,
          textAlign: "center",
          textShadow: "0 6px 40px rgba(0,0,0,0.85)",
        }}
      >
        {phrase.text}
      </h2>
    </AbsoluteFill>
  );
};

export const Workout = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const audioFadeStart = durationInFrames - Math.round(config.audioFadeOutSec * fps);
  const audioFadeInEnd = Math.round(config.audioFadeInSec * fps);
  const audioVolume = interpolate(
    frame,
    [0, audioFadeInEnd, audioFadeStart, durationInFrames],
    [0, config.audioVolume, config.audioVolume, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <ClipTrack fps={fps} />

      {config.flashFrames.map((cf, i) => (
        <Flash key={i} centerFrame={cf} peak={0.16} />
      ))}

      {config.phrases.map((p, i) => (
        <Sequence key={i} from={p.fromFrame} durationInFrames={p.durationInFrames}>
          <PhraseOverlay phrase={p} />
        </Sequence>
      ))}

      {config.audio && (
        <Audio
          src={staticFile(config.audio)}
          startFrom={Math.round(config.audioStartFromSec * fps)}
          volume={audioVolume}
        />
      )}
    </AbsoluteFill>
  );
};
