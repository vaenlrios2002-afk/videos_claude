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
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { config, type Phrase } from "./config";

const playfair = loadPlayfair("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const inter = loadInter("normal", {
  weights: ["300", "400"],
  subsets: ["latin"],
});

const COLORS = {
  background: "#0a0a0a",
  gold: "#c9a961",
  cream: "#f5f1e8",
  overlay: "rgba(8, 8, 10, 0.62)",
  vignette:
    "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
};

const ClipBackground = () => {
  const frame = useCurrentFrame();
  let cursor = 0;

  return (
    <>
      {config.clips.map((clip, i) => {
        const from = cursor;
        cursor += clip.durationInFrames;
        const scale = interpolate(
          frame,
          [from, from + clip.durationInFrames],
          [1.0, 1.08],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={clip.durationInFrames}
          >
            <AbsoluteFill style={{ transform: `scale(${scale})` }}>
              <OffthreadVideo
                src={staticFile(clip.src)}
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};

const PhraseBlock = ({ phrase }: { phrase: Phrase }) => {
  const frame = useCurrentFrame();
  const local = frame - phrase.from;

  const fadeIn = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(
    local,
    [phrase.duration - 22, phrase.duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const rise = interpolate(local, [0, 30], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  if (phrase.variant === "hero") {
    const scale = interpolate(local, [0, 40], [0.94, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const lineW = interpolate(local, [12, 50], [0, 260], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    return (
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            width: lineW,
            height: 1,
            backgroundColor: COLORS.gold,
            marginBottom: 48,
            boxShadow: `0 0 18px ${COLORS.gold}`,
          }}
        />
        <h1
          style={{
            color: COLORS.gold,
            fontFamily: playfair.fontFamily,
            fontWeight: 400,
            fontSize: 200,
            margin: 0,
            letterSpacing: "0.02em",
            textShadow: "0 6px 40px rgba(0,0,0,0.85)",
          }}
        >
          {phrase.text}
        </h1>
        <div
          style={{
            width: lineW,
            height: 1,
            backgroundColor: COLORS.gold,
            marginTop: 48,
            boxShadow: `0 0 18px ${COLORS.gold}`,
          }}
        />
      </AbsoluteFill>
    );
  }

  const isOutro = phrase.variant === "outro";

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `translateY(${rise}px)`,
      }}
    >
      <h2
        style={{
          color: COLORS.cream,
          fontFamily: playfair.fontFamily,
          fontWeight: 400,
          fontStyle: isOutro ? "italic" : "normal",
          fontSize: isOutro ? 68 : 92,
          lineHeight: 1.22,
          margin: 0,
          textAlign: "center",
          maxWidth: 1500,
          letterSpacing: "0.01em",
          whiteSpace: "pre-line",
          textShadow: "0 4px 30px rgba(0,0,0,0.85)",
        }}
      >
        {phrase.text}
      </h2>
    </AbsoluteFill>
  );
};

const Frame = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 50], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const corner = (style: React.CSSProperties) => (
    <div
      style={{ position: "absolute", backgroundColor: COLORS.gold, ...style }}
    />
  );
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {corner({ top: 60, left: 60, width: 72, height: 1 })}
      {corner({ top: 60, left: 60, width: 1, height: 72 })}
      {corner({ top: 60, right: 60, width: 72, height: 1 })}
      {corner({ top: 60, right: 60, width: 1, height: 72 })}
      {corner({ bottom: 60, left: 60, width: 72, height: 1 })}
      {corner({ bottom: 60, left: 60, width: 1, height: 72 })}
      {corner({ bottom: 60, right: 60, width: 72, height: 1 })}
      {corner({ bottom: 60, right: 60, width: 1, height: 72 })}
    </AbsoluteFill>
  );
};

export const Premium = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const audioFadeStart = durationInFrames - Math.round(config.audioFadeOutSec * fps);
  const audioVolume = interpolate(
    frame,
    [0, 20, audioFadeStart, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const brandOpacity = interpolate(frame, [40, 80], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <ClipBackground />
      <AbsoluteFill style={{ backgroundColor: COLORS.overlay }} />
      <AbsoluteFill style={{ background: COLORS.vignette }} />

      <Frame />

      {config.phrases.map((phrase, i) => (
        <Sequence
          key={i}
          from={phrase.from}
          durationInFrames={phrase.duration}
        >
          <PhraseBlock phrase={phrase} />
        </Sequence>
      ))}

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 100,
        }}
      >
        <span
          style={{
            color: COLORS.cream,
            fontFamily: inter.fontFamily,
            fontWeight: 300,
            fontSize: 18,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            opacity: brandOpacity,
          }}
        >
          {config.brand}
        </span>
      </AbsoluteFill>

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
