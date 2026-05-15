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
import { config } from "./config";

const { fontFamily: serif } = loadCormorant("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});
loadCormorant("italic", { weights: ["400", "500"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", {
  weights: ["300", "400"],
  subsets: ["latin"],
});

const COLORS = {
  beige: "#e8dccd",
  gold: "#c9a961",
  darkText: "#2d2a24",
  offWhite: "#faf6ef",
  overlay: "rgba(15, 13, 10, 0.32)",
  vignette:
    "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)",
};

// IG Reels safe area
const SAFE = { x: 70, top: 260, bottom: 400 };

const VIDEO_FILTER =
  "saturate(0.93) contrast(1.05) brightness(1.02) sepia(0.05)";

const VideoLayer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Subtle Ken Burns over the whole clip
  const scale = interpolate(
    frame,
    [0, config.clip.durationInFrames],
    [1.0, 1.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo
          src={staticFile(config.clip.src)}
          startFrom={Math.round(config.clip.startFromSec * fps)}
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

const BeatA = () => {
  const frame = useCurrentFrame();
  const { beatA } = config.phrases;
  const local = frame - beatA.from;

  const fadeIn = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(
    local,
    [beatA.duration - 22, beatA.duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);
  const rise = interpolate(local, [0, 30], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

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
        transform: `translateY(${-40 + rise}px)`,
      }}
    >
      <h2
        style={{
          color: COLORS.offWhite,
          fontFamily: serif,
          fontWeight: 400,
          fontSize: 130,
          letterSpacing: "0.005em",
          margin: 0,
          textAlign: "center",
          textShadow: "0 6px 30px rgba(0,0,0,0.85)",
        }}
      >
        {beatA.text}
      </h2>
    </AbsoluteFill>
  );
};

const BeatB = () => {
  const frame = useCurrentFrame();
  const { beatB } = config.phrases;
  const local = frame - beatB.from;

  const fadeIn = interpolate(local, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(
    local,
    [beatB.duration - 28, beatB.duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const wrapOpacity = Math.min(fadeIn, fadeOut);

  // Word-by-word reveal: "Es" then "recordatorio."
  const preOpacity = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const preRise = interpolate(local, [0, 30], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const accentOpacity = interpolate(local, [35, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const accentRise = interpolate(local, [35, 75], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const accentScale = interpolate(local, [35, 80], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const underlineW = interpolate(local, [55, 110], [0, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: SAFE.x,
        paddingRight: SAFE.x,
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
        opacity: wrapOpacity,
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: "translateY(-40px)",
        }}
      >
        <div
          style={{
            opacity: preOpacity,
            transform: `translateY(${preRise}px)`,
            color: COLORS.offWhite,
            fontFamily: serif,
            fontWeight: 400,
            fontSize: 110,
            letterSpacing: "0.01em",
            margin: 0,
            lineHeight: 1.1,
            textShadow: "0 6px 30px rgba(0,0,0,0.85)",
          }}
        >
          {config.phrases.beatB.pre}
        </div>
        <div
          style={{
            opacity: accentOpacity,
            transform: `translateY(${accentRise}px) scale(${accentScale})`,
            color: COLORS.gold,
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 144,
            letterSpacing: "0.005em",
            margin: "10px 0 0",
            lineHeight: 1.1,
            textShadow: "0 6px 30px rgba(0,0,0,0.9)",
          }}
        >
          {config.phrases.beatB.accent}
        </div>
        <div
          style={{
            width: underlineW,
            height: 1,
            backgroundColor: COLORS.gold,
            margin: "32px auto 0",
            boxShadow: `0 0 14px ${COLORS.gold}`,
            opacity: accentOpacity,
          }}
        />
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
  const lineW = interpolate(frame, [15, 55], [0, 220], {
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

export const Teaser = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const audioFadeStart =
    durationInFrames - Math.round(config.audioFadeOutSec * fps);
  const audioFadeInEnd = Math.round(config.audioFadeInSec * fps);
  const audioVolume = interpolate(
    frame,
    [0, audioFadeInEnd, audioFadeStart, durationInFrames],
    [0, config.audioVolume, config.audioVolume, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Sequence from={0} durationInFrames={config.clip.durationInFrames}>
        <VideoLayer />
      </Sequence>

      <Sequence
        from={config.phrases.beatA.from}
        durationInFrames={config.phrases.beatA.duration}
      >
        <BeatA />
      </Sequence>

      <Sequence
        from={config.phrases.beatB.from}
        durationInFrames={config.phrases.beatB.duration}
      >
        <BeatB />
      </Sequence>

      <Sequence
        from={config.clip.durationInFrames}
        durationInFrames={config.brandFrameDuration}
      >
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
