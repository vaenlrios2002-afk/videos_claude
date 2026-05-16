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
loadCormorant("italic", { weights: ["300", "400", "500"], subsets: ["latin"] });

const COLORS = {
  bg: "#0a0805",
  peach: "#f4d9c4",
  peachWarm: "#e8b89a",
  cream: "#faf2e8",
  warmFlash: "rgba(248, 218, 188, 0.92)",
  // Cinematic vignette with warm fall-off
  vignette:
    "radial-gradient(ellipse at center, rgba(0,0,0,0) 48%, rgba(20,8,4,0.55) 100%)",
};

// IG safe area for vertical
const SAFE = { x: 80, top: 260, bottom: 380 };

// Cinematic warm film grade — desaturated + peachy + lifted shadows
const VIDEO_FILTER =
  "saturate(0.78) contrast(1.04) brightness(1.05) sepia(0.10) hue-rotate(-3deg)";

// Warm shadow tint (multiplied over the video — adds peach to dark areas)
const SHADOW_TINT =
  "linear-gradient(165deg, rgba(248,210,178,0.10) 0%, rgba(40,18,8,0.18) 100%)";

// Highlight peach bloom (screen blend — warm tint on bright areas)
const HIGHLIGHT_BLOOM =
  "linear-gradient(165deg, rgba(255,220,190,0.22) 0%, rgba(255,255,255,0) 55%)";

// Soft warm light leak from top-right corner
const CORNER_LEAK =
  "radial-gradient(circle at 82% 18%, rgba(255,205,170,0.32) 0%, rgba(255,205,170,0) 42%)";

// Subtle bottom-left ambient warm wash
const AMBIENT_WASH =
  "radial-gradient(circle at 15% 88%, rgba(220,160,130,0.18) 0%, rgba(220,160,130,0) 50%)";

const GRAIN_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="380"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.96   0 0 0 0 0.88   0 0 0 0 0.78   0 0 0 0.35 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
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

  // Stronger Ken Burns per clip — más dinámico
  const scale = interpolate(
    frame,
    [0, clip.durationInFrames],
    [1.0, 1.12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Subtle horizontal drift for more cinematic motion
  const driftX = interpolate(
    frame,
    [0, clip.durationInFrames],
    [-15, 15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Base video with cinematic grade */}
      <AbsoluteFill style={{ transform: `translateX(${driftX}px) scale(${scale})` }}>
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

      {/* Warm tint on shadows (multiply) — peachy darks */}
      <AbsoluteFill
        style={{ background: SHADOW_TINT, mixBlendMode: "multiply", pointerEvents: "none" }}
      />

      {/* Peach bloom on highlights (screen) — softens bright areas */}
      <AbsoluteFill
        style={{ background: HIGHLIGHT_BLOOM, mixBlendMode: "screen", pointerEvents: "none" }}
      />

      {/* Diagonal warm light leak from top-right (screen) */}
      <AbsoluteFill
        style={{ background: CORNER_LEAK, mixBlendMode: "screen", pointerEvents: "none" }}
      />

      {/* Bottom-left ambient warm wash (screen) */}
      <AbsoluteFill
        style={{ background: AMBIENT_WASH, mixBlendMode: "screen", pointerEvents: "none" }}
      />

      {/* Cinematic vignette with warm fall-off */}
      <AbsoluteFill style={{ background: COLORS.vignette, pointerEvents: "none" }} />

      {/* Fine film grain — much subtler than before */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN_DATA_URI}")`,
          backgroundSize: "380px 380px",
          opacity: 0.08,
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
  const isBeat2 = phrase.variant === "beat2";

  // Wrapper fade out at the end of the sequence
  const wrapFadeOut = interpolate(
    local,
    [phrase.durationInFrames - 36, phrase.durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Decorative flourish on top — fades in first
  const flourishOpacity = interpolate(local, [0, 24], [0, 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Word-by-word stagger — más dinámico
  const words = phrase.text.split(" ");
  const STAGGER = 7; // frames per word
  const WORD_FADE = 18;
  const WORD_RISE = 22;
  const startOffset = 18; // wait for flourish before words start

  // Hairline below — grows after all words land
  const lastWordEnd = startOffset + (words.length - 1) * STAGGER + WORD_FADE;
  const lineW = interpolate(
    local,
    [lastWordEnd, lastWordEnd + 36],
    [0, 220],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: SAFE.x,
        paddingRight: SAFE.x,
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
        opacity: wrapFadeOut,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 940 }}>
        {/* Decorative flourish above */}
        <div
          style={{
            color: isBeat2 ? COLORS.peachWarm : COLORS.peach,
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 36,
            letterSpacing: "1.2em",
            marginBottom: 36,
            opacity: flourishOpacity,
            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          }}
        >
          ·  ·  ·
        </div>

        {/* Words with stagger */}
        <h2
          style={{
            color: isBeat2 ? COLORS.peachWarm : COLORS.cream,
            fontFamily: serif,
            fontWeight: isBeat2 ? 400 : 300,
            fontStyle: "italic",
            fontSize: isBeat2 ? 144 : 124,
            letterSpacing: isBeat2 ? "0.005em" : "0.02em",
            lineHeight: 1.12,
            margin: 0,
            textShadow:
              "0 0 28px rgba(255,210,180,0.25), 0 6px 36px rgba(0,0,0,0.85)",
          }}
        >
          {words.map((word, i) => {
            const wordStart = startOffset + i * STAGGER;
            const wOpacity = interpolate(
              local,
              [wordStart, wordStart + WORD_FADE],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              },
            );
            const wRise = interpolate(
              local,
              [wordStart, wordStart + WORD_RISE],
              [16, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              },
            );
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: wOpacity,
                  transform: `translateY(${wRise}px)`,
                  marginRight: i === words.length - 1 ? 0 : "0.28em",
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        {/* Hairline below */}
        <div
          style={{
            width: lineW,
            height: 1,
            backgroundColor: isBeat2 ? COLORS.peachWarm : COLORS.peach,
            margin: "44px auto 0",
            boxShadow: `0 0 14px ${isBeat2 ? "rgba(232,184,154,0.5)" : "rgba(244,217,196,0.5)"}`,
          }}
        />
      </div>
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
