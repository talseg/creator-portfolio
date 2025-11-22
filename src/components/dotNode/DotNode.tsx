import styled, { css } from "styled-components";

export interface DotNodeProps {
  lineUp?: number;
  lineDown?: number;
  lineLeft?: number;
  lineRight?: number;
  lineWidth?: number;
  dotSize?: number;
  perceptualCentering?: boolean;
}

// ----------------------------------------------------------
// STATIC (NO PROPS) — DOT + UP LINE
// ----------------------------------------------------------
const DotCSS = css`
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: rgba(255,0,0,0.2);
;
    top: 50%;
    left: 50%;
  }
`;

// const UpLineCSS = css`
//   &::before {
//         content: "";
//         position: absolute;
//         background: black;
//         width: ${lineWidth}px;
//         height: ${lineUp}px;
//         top: calc(50% - ${lineUp}px);
//         left: 50%;
//         transform: translateX(-50%);
//       }
// `;

// ----------------------------------------------------------
// DOWN / LEFT / RIGHT line elements
// ----------------------------------------------------------
const LineElement = styled.div`
  position: absolute;
  background: black;
`;

// ----------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------
export const DotNode = styled.div<DotNodeProps>`
  position: relative;
  width: 0;
  height: 0;

  ${DotCSS}

  ${({ 
    lineUp,
    lineDown,
    lineLeft,
    lineRight,
    lineWidth = 1,
    dotSize = 8,
    perceptualCentering
  }) => css`


    &::before {
        content: "";
        position: absolute;
        background: black;
        width: ${lineWidth}px;
        height: ${lineUp}px;
        top: calc(50% - ${lineUp}px);
        left: 50%;
        transform: translateX(-50%);
      }

    /* ---------------------- DOT SIZE ---------------------- */
    &::after {
      width: ${dotSize}px;
      height: ${dotSize}px;

      ${perceptualCentering
        ? css`
            --offsetX: ${
              (lineRight ? -lineWidth / 4 : 0) +
              (lineLeft ? lineWidth / 4 : 0)
            }px;

            --offsetY: ${
              (lineDown ? -lineWidth / 4 : 0) +
              (lineUp ? lineWidth / 4 : 0)
            }px;

            transform: translate(
              calc(-50% + var(--offsetX)),
              calc(-50% + var(--offsetY))
            );
          `
        : css`
            transform: translate(-50%, -50%);
          `}
    }

    /* ---------------------- UP LINE ----------------------- */
    ${lineUp &&
    css`
      &::before {
        width: ${lineWidth}px;
        height: ${lineUp}px;
        top: calc(50% - ${lineUp}px);
      }
    `}

    /* ---------------------- LEFT LINE --------------------- */
    ${lineLeft &&
    css`
      & .left-line {
        width: ${lineLeft}px;
        height: ${lineWidth}px;
        left: calc(50% - ${lineLeft}px);
        top: calc(50% - ${lineWidth / 2}px);
      }
    `}

    /* ---------------------- RIGHT LINE -------------------- */
    ${lineRight &&
    css`
      & .right-line {
        width: ${lineRight}px;
        height: ${lineWidth}px;
        left: 50%;
        top: calc(50% - ${lineWidth / 2}px);
      }
    `}

    /* ---------------------- DOWN LINE --------------------- */
    /* DEBUG BLUE PIXEL */
    & .debug-dot {
      width: 1px;
      height: 1px;
      background: blue;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    }

    ${lineDown &&
    css`
      & .down-line {
        width: ${lineWidth}px;
        height: ${lineDown}px;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
      }px;
        height: ${lineDown}px;
        top: 50%;
        left: calc(50% - ${lineWidth / 2}px);
      }
    `}
  `}
`;

// ----------------------------------------------------------
// WRAPPER — ONLY RENDERS LINE ELEMENTS IF NEEDED
// ----------------------------------------------------------
export const DotNodeWrapper: React.FC<DotNodeProps> = props => {
  const { lineLeft, lineRight, lineDown } = props;

  return (
    <DotNode {...props}>
      {/* Center debug pixel */}
      <LineElement className="debug-dot" />

      {/* Lines */}
      {lineLeft && <LineElement className="left-line" />}
      {lineRight && <LineElement className="right-line" />}
      {lineDown && <LineElement className="down-line" />}
    </DotNode>
  );
};
