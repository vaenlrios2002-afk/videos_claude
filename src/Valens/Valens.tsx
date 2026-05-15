import type { CSSProperties } from "react";
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
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { config, type Clip } from "./config";

const { fontFamily: serif } = loadCormorant("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});
loadCormorant("italic", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", {
  weights: ["300", "400"],
  subsets: ["latin"],
});

const COLORS = {
  beige: "#e8dccd",
  gold: "#c9a961",
  darkText: "#2d2a24",
  offWhite: "#faf6ef",
  captionShadow: "0 4px 24px rgba(0,0,0,0.85)",
  // Subtle dark gradient at bottom for caption legibility
  captionGradient:
    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 100%)",
};

// IG Reels safe area
const SAFE = { x: 70, bottom: 380 };

const ShotWithCaption = ({ clip, fps }: { clip: Clip; fps: number }) => {
  const frame = useCurrentFrame();
  const captionFadeIn = interpolate(frame, [4, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const captionFadeOut = interpolate(
    frame,
    [clip.durationInFrames - 12, clip.durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const captionOpacity = Math.min(captionFadeIn, captionFadeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile(clip.src)}
        startFrom={Math.round(clip.startFromSec * fps)}
        volume={config.voiceVolume}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Caption gradient for legibility */}
      <AbsoluteFill
        style={{
          background: COLORS.captionGradient,
          pointerEvents: "none",
        }}
      />

      {/* Caption */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          padding: `0 ${SAFE.x}px ${SAFE.bottom}px`,
          opacity: captionOpacity,
        }}
      >
        <p
          style={{
            color: COLORS.offWhite,
            fontFamily: serif,
            fontWeight: 400,
            fontSize: 68,
            lineHeight: 1.18,
            letterSpacing: "0.005em",
            textAlign: "center",
            margin: 0,
            whiteSpace: "pre-line",
            textShadow: COLORS.captionShadow,
            maxWidth: 920,
          }}
        >
          {clip.caption}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ClipTrack = ({ fps }: { fps: number }) => {
  let cursor = 0;
  return (
    <>
      {config.clips.map((clip, i) => {
        const from = cursor;
        cursor += clip.durationInFrames;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={clip.durationInFrames}
          >
            <ShotWithCaption clip={clip} fps={fps} />
          </Sequence>
        );
      })}
    </>
  );
};

const BrandFrame = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineW = interpolate(frame, [12, 45], [0, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.beige, opacity: fadeIn }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: SAFE.x,
          paddingRight: SAFE.x,
          transform: "translateY(-40px)",
        }}
      >
        <h1
          style={{
            color: COLORS.darkText,
            fontFamily: serif,
            fontWeight: 500,
            fontSize: 150,
            letterSpacing: "0.4em",
            textIndent: "0.4em",
            margin: 0,
          }}
        >
          {config.brand}
        </h1>
        <div
          style={{
            width: lineW,
            height: 1,
            backgroundColor: COLORS.gold,
            margin: "40px 0",
          }}
        />
        <p
          style={{
            color: COLORS.darkText,
            fontFamily: sans,
            fontWeight: 300,
            fontSize: 30,
            letterSpacing: "0.35em",
            margin: 0,
            opacity: 0.88,
          }}
        >
          {config.handle}
        </p>
        <p
          style={{
            color: COLORS.darkText,
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 38,
            lineHeight: 1.45,
            textAlign: "center",
            margin: "70px 0 0",
            opacity: 0.72,
            maxWidth: 760,
            whiteSpace: "pre-line",
          }}
        >
          {config.tagline}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Valens = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const clipTotalFrames = config.clips.reduce(
    (a, c) => a + c.durationInFrames,
    0,
  );

  const audioFadeStart = durationInFrames - Math.round(config.audioFadeOutSec * fps);
  const audioFadeInEnd = Math.round(config.audioFadeInSec * fps);
  const audioVolume = interpolate(
    frame,
    [0, audioFadeInEnd, audioFadeStart, durationInFrames],
    [0, config.audioVolume, config.audioVolume, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={clipTotalFrames}>
        <ClipTrack fps={fps} />
      </Sequence>

      <Sequence from={clipTotalFrames} durationInFrames={config.brandFrameDuration}>
        <BrandFrame />
      </Sequence>

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
