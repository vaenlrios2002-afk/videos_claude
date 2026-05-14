import {
  AbsoluteFill,
  Sequence,
  Video,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { config } from "./config";

export const Birthday = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 20, 60, 80], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  let cursor = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {config.clips.map((clip, i) => {
        const from = cursor;
        cursor += clip.durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={clip.durationInFrames}>
            <AbsoluteFill>
              <Video
                src={staticFile(clip.src)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      <Sequence from={0} durationInFrames={80}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: titleOpacity,
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: 140,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 800,
              textShadow: "0 6px 30px rgba(0,0,0,0.85)",
              textAlign: "center",
              margin: 0,
            }}
          >
            ¡Feliz cumpleaños, {config.name}!
          </h1>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
