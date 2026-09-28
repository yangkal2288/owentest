import { AbsoluteFill } from "remotion";

import { Piece, type PieceName } from "../Piece";

/** Dev check: every piece on a grey ground, so edges and transparency show. */
const NAMES: PieceName[] = ["row-0", "msg-6", "outcome-booked", "upcoming-card", "int-cliniko", "handover", "followup-on", "hours"];
export function PieceTest() {
  return (
    <AbsoluteFill style={{ background: "#d8d8d8", display: "flex", flexWrap: "wrap", gap: 24, padding: 24, alignContent: "flex-start" }}>
      {NAMES.map((n) => (
        <Piece key={n} name={n} w={n === "hours" ? 560 : n === "handover" ? 900 : 560} />
      ))}
    </AbsoluteFill>
  );
}
