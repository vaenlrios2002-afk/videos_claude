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
import { loadFont as loadBigShouldersInline } from "@remotion/google-fonts/BigShouldersInline";
import { config, type Cut, type TextOverlay } from "./config";

const { fontFamily: serif } = loadCormorant("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});
loadCormorant("italic", { weights: ["400", "500"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", {
  weights: ["300", "400"],
  subsets: ["latin"],
});

const { fontFamily: bigShoulders } = loadBigShouldersInline("normal", {
  weights: ["300", "400", "500"],
  subsets: ["latin"],
});

const COLORS = {
  cream: "#f0e6d6",
  beige: "#d4c4a8",
  gold: "#c9a961",
  darkBg: "#0a0805",
  darkText: "#1a1612",
  offWhite: "#faf6ef",
  overlay: "rgba(10, 8, 5, 0.35)",
  vignette:
    "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)",
  // HAND'S GOD brand palette
  brandBeige: "#d4c2a8",
  brandNavy: "#3a3d4d",
};

// Meta Ads safe area for 1080x1920
const SAFE = { x: 80, top: 240, bottom: 380 };

// Aggressive warm cinematic grade — also masks the 480p compression
const VIDEO_FILTER =
  "saturate(0.82) contrast(1.18) brightness(1.04) sepia(0.18) hue-rotate(-2deg)";

// SVG noise pattern for subtle film grain (data URI, ~3% opacity overlay)
const GRAIN_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.85   0 0 0 0 0.78   0 0 0 0 0.65   0 0 0 0.45 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
  );

const CutShot = ({ cut, fps }: { cut: Cut; fps: number }) => {
  const frame = useCurrentFrame();
  // Subtle Ken Burns
  const scale = interpolate(
    frame,
    [0, cut.durationInFrames],
    [1.04, 1.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.darkBg }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo
          src={staticFile(cut.src)}
          startFrom={Math.round(cut.startFromSec * fps)}
          volume={config.voiceVolume}
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
      {/* Film grain — masks 480p artifacts */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN_DATA_URI}")`,
          backgroundSize: "320px 320px",
          opacity: 0.18,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const CutsTrack = ({ fps }: { fps: number }) => {
  let cursor = 0;
  return (
    <>
      {config.cuts.map((cut, i) => {
        const from = cursor;
        cursor += cut.durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={cut.durationInFrames}>
            <CutShot cut={cut} fps={fps} />
          </Sequence>
        );
      })}
    </>
  );
};

const Overlay = ({ overlay }: { overlay: TextOverlay }) => {
  const frame = useCurrentFrame();
  const local = frame - overlay.fromFrame;

  const fadeIn = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(
    local,
    [overlay.durationInFrames - 22, overlay.durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);
  const rise = interpolate(local, [0, 30], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const isHook = overlay.variant === "hook";
  const isReveal = overlay.variant === "reveal";

  let color = COLORS.offWhite;
  let fontSize = 120;
  let fontStyle: "normal" | "italic" = "normal";
  let fontWeight = 400;
  let textTransform: "none" | "uppercase" = "none";

  if (isReveal) {
    color = COLORS.gold;
    fontSize = 140;
    fontStyle = "italic";
    fontWeight = 500;
  }
  if (overlay.variant === "cta") {
    fontSize = 78;
    color = COLORS.offWhite;
  }

  // Underline animation only for reveal variant
  const underlineW = isReveal
    ? interpolate(local, [20, 70], [0, 280], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;

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
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            color,
            fontFamily: serif,
            fontWeight,
            fontStyle,
            fontSize,
            letterSpacing: "0.01em",
            lineHeight: 1.1,
            margin: 0,
            textTransform,
            whiteSpace: "pre-line",
            textShadow: "0 6px 36px rgba(0,0,0,0.95)",
          }}
        >
          {overlay.text}
        </h2>
        {isReveal && (
          <div
            style={{
              width: underlineW,
              height: 1,
              backgroundColor: COLORS.gold,
              margin: "32px auto 0",
              boxShadow: `0 0 16px ${COLORS.gold}`,
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

const BrandFrame = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineW = interpolate(frame, [14, 52], [0, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.brandBeige, opacity: fadeIn }}>
      {/* Very subtle grain to keep texture continuity with the video cuts */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN_DATA_URI}")`,
          backgroundSize: "320px 320px",
          opacity: 0.08,
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: SAFE.x,
          paddingRight: SAFE.x,
          transform: "translateY(-30px)",
        }}
      >
        <h1
          style={{
            color: COLORS.brandNavy,
            fontFamily: bigShoulders,
            fontWeight: 400,
            fontSize: 168,
            letterSpacing: "0.04em",
            lineHeight: 0.95,
            margin: 0,
            textAlign: "center",
            whiteSpace: "pre-line",
          }}
        >
          {"HAND'S\nGOD"}
        </h1>
        <div
          style={{
            width: lineW,
            height: 1.5,
            backgroundColor: COLORS.brandNavy,
            margin: "52px 0",
          }}
        />
        <p
          style={{
            color: COLORS.brandNavy,
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 50,
            margin: 0,
            opacity: 0.92,
          }}
        >
          {config.cta}
        </p>
        <p
          style={{
            color: COLORS.brandNavy,
            fontFamily: sans,
            fontWeight: 400,
            fontSize: 26,
            letterSpacing: "0.4em",
            margin: "60px 0 0",
            opacity: 0.7,
          }}
        >
          {config.handle}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MensSpa = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const cutsTotalFrames = config.cuts.reduce(
    (a, c) => a + c.durationInFrames,
    0,
  );

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
    <AbsoluteFill style={{ backgroundColor: COLORS.darkBg }}>
      <Sequence from={0} durationInFrames={cutsTotalFrames}>
        <CutsTrack fps={fps} />
      </Sequence>

      {config.textOverlays.map((overlay, i) => (
        <Sequence
          key={i}
          from={overlay.fromFrame}
          durationInFrames={overlay.durationInFrames}
        >
          <Overlay overlay={overlay} />
        </Sequence>
      ))}

      <Sequence
        from={cutsTotalFrames}
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
