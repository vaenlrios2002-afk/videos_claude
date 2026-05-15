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
import { config, type Clip, type Phrase } from "./config";

const { fontFamily: serif } = loadCormorant("normal", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
loadCormorant("italic", {
  weights: ["400", "500"],
  subsets: ["latin"],
});
const { fontFamily: sans } = loadInter("normal", {
  weights: ["300", "400"],
  subsets: ["latin"],
});

const COLORS = {
  cream: "#f5ede4",
  beige: "#e8dccd",
  oliveSoft: "#a8a285",
  darkText: "#2d2a24",
  offWhite: "#faf6ef",
  gold: "#c9a961",
  overlay: "rgba(20, 18, 15, 0.32)",
  vignette:
    "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)",
  flash: "rgba(245, 230, 200, 0.9)",
};

// Instagram Reels safe area for 1080x1920
const SAFE = { top: 260, bottom: 380, x: 70 };

// Cinematic warm grading via CSS filter (no LUT needed)
const VIDEO_FILTER =
  "saturate(0.92) contrast(1.05) brightness(1.02) sepia(0.05)";

const Cut = ({ clip, fps }: { clip: Clip; fps: number }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(
    frame,
    [0, clip.durationInFrames],
    [1.0, 1.06],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo
          src={staticFile(clip.src)}
          startFrom={Math.round(clip.startFromSec * fps)}
          playbackRate={clip.playbackRate ?? 1.0}
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
          <Sequence key={i} from={from} durationInFrames={clip.durationInFrames}>
            <Cut clip={clip} fps={fps} />
          </Sequence>
        );
      })}
    </>
  );
};

const Flash = ({ centerFrame, peak = 0.2 }: { centerFrame: number; peak?: number }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [centerFrame - 8, centerFrame, centerFrame + 18],
    [0, peak, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.flash, opacity, pointerEvents: "none" }}
    />
  );
};

const baseTextWrap: CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  paddingTop: SAFE.top,
  paddingBottom: SAFE.bottom,
  paddingLeft: SAFE.x,
  paddingRight: SAFE.x,
};

const variantStyle = (variant: Phrase["variant"]): CSSProperties => {
  switch (variant) {
    case "intro":
      return {
        color: COLORS.offWhite,
        fontFamily: serif,
        fontWeight: 400,
        fontSize: 86,
        lineHeight: 1.15,
        letterSpacing: "0.005em",
      };
    case "subtle":
      return {
        color: COLORS.offWhite,
        fontFamily: serif,
        fontWeight: 400,
        fontSize: 78,
        letterSpacing: "0.04em",
      };
    case "headline":
      return {
        color: COLORS.offWhite,
        fontFamily: serif,
        fontWeight: 400,
        fontSize: 88,
        lineHeight: 1.15,
      };
    case "italic":
      return {
        color: COLORS.cream,
        fontFamily: serif,
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: 84,
        lineHeight: 1.2,
      };
    case "brand_word":
      return {
        color: COLORS.cream,
        fontFamily: serif,
        fontWeight: 500,
        fontSize: 180,
        letterSpacing: "0.32em",
        textIndent: "0.32em",
      };
    case "climax":
      return {};
  }
};

const PhraseBlock = ({ phrase }: { phrase: Phrase }) => {
  const frame = useCurrentFrame();
  const local = frame - phrase.fromFrame;

  if (phrase.variant === "climax") {
    return <ClimaxBlock phrase={phrase} />;
  }

  const fadeIn = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(
    local,
    [phrase.durationInFrames - 22, phrase.durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const rise = interpolate(local, [0, 30], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const isBrandWord = phrase.variant === "brand_word";
  const brandScale = interpolate(local, [0, 40], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const styles = variantStyle(phrase.variant);
  const offsetY = -60 + rise;

  return (
    <AbsoluteFill
      style={{
        ...baseTextWrap,
        opacity,
        transform: `translateY(${offsetY}px)${isBrandWord ? ` scale(${brandScale})` : ""}`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2
          style={{
            ...styles,
            margin: 0,
            textAlign: "center",
            whiteSpace: "pre-line",
            textShadow: "0 4px 30px rgba(0,0,0,0.75)",
          }}
        >
          {phrase.text}
        </h2>
        {isBrandWord && (
          <div
            style={{
              width: 140,
              height: 1,
              backgroundColor: COLORS.gold,
              marginTop: 36,
              boxShadow: `0 0 14px ${COLORS.gold}`,
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

const ClimaxBlock = ({ phrase }: { phrase: Phrase }) => {
  const frame = useCurrentFrame();
  const local = frame - phrase.fromFrame;

  const fadeIn = interpolate(local, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    local,
    [phrase.durationInFrames - 25, phrase.durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const wrapOpacity = Math.min(fadeIn, fadeOut);

  const words: { t: string; at: number; italic?: boolean; accent?: boolean }[] = [
    { t: "Vístete", at: 0 },
    { t: "como la mujer", at: 30 },
    { t: "en la que te estás", at: 65 },
    { t: "convirtiendo.", at: 105, italic: true, accent: true },
  ];

  return (
    <AbsoluteFill style={{ ...baseTextWrap, opacity: wrapOpacity }}>
      <div
        style={{
          textAlign: "center",
          maxWidth: 940,
          transform: "translateY(-60px)",
        }}
      >
        {words.map((w, i) => {
          const wO = interpolate(local, [w.at, w.at + 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const wR = interpolate(local, [w.at, w.at + 30], [18, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={i}
              style={{
                opacity: wO,
                transform: `translateY(${wR}px)`,
                color: w.accent ? COLORS.gold : COLORS.offWhite,
                fontFamily: serif,
                fontStyle: w.italic ? "italic" : "normal",
                fontWeight: 400,
                fontSize: 96,
                lineHeight: 1.15,
                letterSpacing: "0.005em",
                textShadow: "0 4px 30px rgba(0,0,0,0.8)",
                margin: "10px 0",
              }}
            >
              {w.t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const BrandFrame = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineW = interpolate(frame, [15, 50], [0, 220], {
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
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
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
            opacity: 0.85,
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
            margin: "72px 0 0",
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

  const clipTotalFrames = config.clips.reduce((a, c) => a + c.durationInFrames, 0);
  const brandFromFrame = clipTotalFrames;

  const audioFadeStart = durationInFrames - Math.round(config.audioFadeOutSec * fps);
  const audioFadeInEnd = Math.round(config.audioFadeInSec * fps);
  const audioVolume = interpolate(
    frame,
    [0, audioFadeInEnd, audioFadeStart, durationInFrames],
    [0, config.audioVolume, config.audioVolume, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Sequence from={0} durationInFrames={clipTotalFrames}>
        <ClipTrack fps={fps} />
      </Sequence>

      {/* Soft warm flashes at major transitions */}
      <Flash centerFrame={418} peak={0.18} />
      <Flash centerFrame={723} peak={0.14} />
      <Flash centerFrame={985} peak={0.25} />

      <Sequence from={brandFromFrame} durationInFrames={config.brandFrameDuration}>
        <BrandFrame />
      </Sequence>

      {config.phrases.map((phrase, i) => (
        <Sequence
          key={i}
          from={phrase.fromFrame}
          durationInFrames={phrase.durationInFrames}
        >
          <PhraseBlock phrase={phrase} />
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
