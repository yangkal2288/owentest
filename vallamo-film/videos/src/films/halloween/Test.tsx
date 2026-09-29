import { AbsoluteFill } from "remotion";

import { useTime } from "../../kit/time";
import { Fog, Hand, Night, Shade } from "./art/Spectre";

export function HalloweenTest() {
  const t = useTime() + 2;
  return (
    <AbsoluteFill>
      <Night t={t}>
        <div style={{ position: "absolute", left: 260, top: 120, width: 560 }}>
          <Shade t={t} style={{ width: 560 }} />
        </div>
        <Fog t={t} density={0.55} />
        <div style={{ position: "absolute", left: 180, top: 1180, width: 900 }}>
          <Hand t={t} style={{ width: 900 }} />
        </div>
        <div style={{ position: "absolute", left: 180, top: 1440, width: 900 }}>
          <Hand t={t} pinch={0.5} style={{ width: 900 }} />
        </div>
        <div style={{ position: "absolute", left: 180, top: 1680, width: 900 }}>
          <Hand t={t} pinch={1} style={{ width: 900 }} />
        </div>
      </Night>
    </AbsoluteFill>
  );
}
