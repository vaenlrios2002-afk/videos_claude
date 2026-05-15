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
import { config, type TextOverlay } from "./config";

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
  gold: "#c9a961",
  darkBg: "#0a0805",
  offWhite: "#faf6ef",
  overlay: "rgba(10, 8, 5, 0.32)",
  vignette:
    "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
  flash: "rgba(245, 230, 200, 0.92)",
  // HAND'S GOD brand palette
  brandBeige: "#d4c2a8",
  brandNavy: "#3a3d4d",
};

// Meta Ads safe area
const SAFE = { x: 80, top: 240, bottom: 380 };

// Strong warm cinematic grade — also masks 480p compression
const VIDEO_FILTER =
  "saturate(0.86) contrast(1.16) brightness(1.05) sepia(0.16)";

// SVG noise for subtle film grain (masks pixelation)
const GRAIN_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.85   0 0 0 0 0.78   0 0 0 0 0.65   0 0 0 0.45 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
  );

const FullClip = ({ fps }: { fps: number }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.darkBg }}>
      <OffthreadVideo
        src={staticFile(config.clip.src)}
        startFrom={Math.round(config.clip.startFromSec * fps)}
        volume={config.voiceVolume}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: VIDEO_FILTER,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: COLORS.overlay }} />
      <AbsoluteFill style={{ background: COLORS.vignette }} />
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN_DATA_URI}")`,
          backgroundSize: "320px 320px",
          opacity: 0.16,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const Flash = ({ centerFrame, peak = 0.18 }: { centerFrame: number; peak?: number }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [centerFrame - 6, centerFrame, centerFrame + 22],
    [0, peak, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.flash, opacity, pointerEvents: "none" }}
    />
  );
};

const Overlay = ({ overlay }: { overlay: TextOverlay }) => {
  const frame = useCurrentFrame();
  const local = frame - overlay.fromFrame;

  const fadeIn = interpolate(local, [0, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(
    local,
    [overlay.durationInFrames - 32, overlay.durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = Math.min(fadeIn, fadeOut);
  const rise = interpolate(local, [0, 38], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Per-variant styling
  let color = COLORS.offWhite;
  let fontSize = 120;
  let fontStyle: "normal" | "italic" = "normal";
  let fontWeight: number = 400;
  let withUnderline = false;

  if (overlay.variant === "reveal") {
    color = COLORS.gold;
    fontSize = 144;
    fontStyle = "italic";
    fontWeight = 500;
    withUnderline = true;
  }
  if (overlay.variant === "philosophy") {
    fontSize = 96;
  }
  if (overlay.variant === "cta") {
    fontSize = 92;
  }

  const underlineW = withUnderline
    ? interpolate(local, [28, 90], [0, 280], {
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
        transform: `translateY(${-30 + rise}px)`,
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
            letterSpacing: "0.005em",
            lineHeight: 1.1,
            margin: 0,
            whiteSpace: "pre-line",
            textShadow: "0 6px 36px rgba(0,0,0,0.95)",
          }}
        >
          {overlay.text}
        </h2>
        {withUnderline && (
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
  const fadeIn = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineW = interpolate(frame, [16, 56], [0, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.brandBeige, opacity: fadeIn }}>
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
      {/* Full clip plays uninterrupted for its entire duration */}
      <Sequence from={0} durationInFrames={config.clip.durationInFrames}>
        <FullClip fps={fps} />
      </Sequence>

      {/* Phrase overlays — sparse, premium pacing */}
      {config.textOverlays.map((overlay, i) => (
        <Sequence
          key={i}
          from={overlay.fromFrame}
          durationInFrames={overlay.durationInFrames}
        >
          <Overlay overlay={overlay} />
        </Sequence>
      ))}

      {/* Warm light leaks at every phrase entry + brand transition */}
      {config.flashFrames.map((cf, i) => (
        <Flash key={i} centerFrame={cf} peak={i === config.flashFrames.length - 1 ? 0.28 : 0.16} />
      ))}

      {/* Brand frame */}
      <Sequence
        from={config.clip.durationInFrames}
        durationInFrames={config.brandFrameDuration}
      >
        <BrandFrame />
      </Sequence>

      {/* Background music — Tony Ann PULSE at 18% */}
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
