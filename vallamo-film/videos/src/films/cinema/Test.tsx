import { AbsoluteFill } from "remotion";

import { useTime } from "../../kit/time";
import { display, em } from "../meta/type";
import { Slam, World } from "./kit";

export function CineTest() {
  const t = useTime() + 1.5;
  return (
    <AbsoluteFill>
      <World kind="week" t={t} blur={6} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Slam t={t} at={0} lines={[[["You’re with"]], [["a "], ["client", true]]]} base={display(150)} emStyle={em(160)} size={150} dot />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
