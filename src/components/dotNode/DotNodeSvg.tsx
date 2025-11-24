import styled from "styled-components";

export interface DotNodeSvgProps {
  lineUp?: number | "fill";
  lineDown?: number | "fill";
  lineLeft?: number | "fill";
  lineRight?: number | "fill";
  lineWidth?: number;
  dotSize?: number;
}

const Svg = styled.svg`
  overflow: visible;
  display: block;
`;

export const DotNodeSvg: React.FC<DotNodeSvgProps> = ({
  lineUp = 0,
  lineDown = 0,
  lineLeft = 0,
  lineRight = 0,
  lineWidth = 1,
  dotSize = 8,
}) => {
  // ----------------------------
  //  Pixel crisp center
  // ----------------------------
  const center = 0;

  // ----------------------------
  //  **ViewBox size calculation**
  // ----------------------------
  //
  // If any direction is "fill", we need a viewBox that maps:
  //   left:  -1  →  0%
  //   right: +1  → 100%
  //   same for up/down
  //
  // So we always expose a -1..+1 space.
  //
  // The dot remains at (0,0).
  //
  const viewBox = "-49.5 -49.5 100 100";

  return (
    <Svg width="100" height="100" viewBox={viewBox} preserveAspectRatio="none">
      {/* DOT */}
      <circle
        cx={center}
        cy={center}
        r={dotSize / 2}
        fill="black"
      />

      {/* ---------------------- UP LINE ---------------------- */}
      {lineUp && (
        <line
          x1={center}
          y1={center}
          x2={center}
          /** ⭐ If "fill", go to top (y = -1). Otherwise subtract px. */
          y2={lineUp === "fill" ? -1 : center - (lineUp as number)}
          stroke="black"
          strokeWidth={lineWidth}
        />
      )}

      {/* ---------------------- DOWN LINE ---------------------- */}
      {lineDown && (
        <line
          x1={center}
          y1={center}
          x2={center}
          /** ⭐ If "fill", go to bottom (y = +1) */
          y2={lineDown === "fill" ? 1 : center + (lineDown as number)}
          stroke="black"
          strokeWidth={lineWidth}
        />
      )}

      {/* ---------------------- LEFT LINE ---------------------- */}
      {lineLeft && (
        <line
          x1={center}
          y1={center}
          /** ⭐ If "fill", go to left boundary (x = -1) */
          x2={lineLeft === "fill" ? -1 : center - (lineLeft as number)}
          y2={center}
          stroke="black"
          strokeWidth={lineWidth}
        />
      )}

      {/* ---------------------- RIGHT LINE ---------------------- */}
      {lineRight && (
        <line
          x1={center}
          y1={center}
          /** ⭐ If "fill", go to right boundary (x = +1) */
          x2={lineRight === "fill" ? 1 : center + (lineRight as number)}
          y2={center}
          stroke="black"
          strokeWidth={lineWidth}
        />
      )}
    </Svg>
  );
};
