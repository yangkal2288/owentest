import { AbsoluteFill } from "remotion";

import { useTime } from "../../kit/time";
import { Ghost } from "./art/Ghost";
import { Client, Maya } from "./art/People";
import { Desk, Ledger, Phone, Pumpkin, Room, TreatmentGlass } from "./art/Set";

export function HalloweenTest() {
  const t = useTime() + 2;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Room t={t} />
      <TreatmentGlass t={t} />
      <div style={{ position: "absolute", left: 610, top: 560, width: 440 }}>
        <Ghost pose={{ t, smile: 0.6, brow: 0.25 }} style={{ width: 440 }} />
      </div>
      <Desk y={1180}>
        <div style={{ position: "absolute", left: 120, top: -120 }}>
          <Phone />
        </div>
        <div style={{ position: "absolute", left: 380, top: -150 }}>
          <Ledger open={1} w={360} />
        </div>
        <Pumpkin size={120} style={{ position: "absolute", left: 830, top: -110 }} />
      </Desk>
      <div style={{ position: "absolute", left: 60, top: 1500, width: 380, background: "#F3E8D8", borderRadius: 20 }}>
        <Maya pose={{ arms: "tend", lean: -8 }} t={t} style={{ width: 200 }} />
      </div>
      <div style={{ position: "absolute", left: 300, top: 1640, width: 700 }}>
        <Client t={t} style={{ width: 700 }} />
      </div>
    </AbsoluteFill>
  );
}
