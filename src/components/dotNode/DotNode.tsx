// FINAL — SIMPLE, CLEAN, FULL-ELEMENT DotNode
// No box-shadows. No hacks. Perfect alignment.
// Dot = ::after
// Up line = ::before
// Left, Right, Down = real absolutely positioned <div>s

import styled, { css } from "styled-components";

export interface DotNodeProps {
  lineUp?: number;
  lineDown?: number;
  lineLeft?: number;
  lineRight?: number;
  lineWidth?: number;
  dotSize?: number;
}

// -----------------------------------------------------
// STATIC PARTS — dot + up-line pseudo-elements
// -----------------------------------------------------
const DotCSS = css`
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: black;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const UpLineCSS = css`
  &::before {
    content: "";
    position: absolute;
    background: black;
    left: 50%;
    transform: translateX(-50%);
    width: 0;   /* prevents ghost pixel when no line */
    height: 0;
  }
`;

// -----------------------------------------------------
// LINE ELEMENTS — left, right, down
// -----------------------------------------------------
const LineElement = styled.div`
  position: absolute;
  background: black;
  
`;

export const DotNode = styled.div<DotNodeProps>`
  position: relative;
  width: 0;
  height: 0;

  ${DotCSS}
  ${UpLineCSS}

  ${({ lineUp, lineDown, lineLeft, lineRight, lineWidth = 1, dotSize = 8 }) => css`
    /* Dot sizing */
    &::after {
      width: ${dotSize}px;
      height: ${dotSize}px;
    }

    /* UP */
    ${lineUp &&
    css`
      &::before {
        width: ${lineWidth}px;
        height: ${lineUp}px;
        top: calc(50% - ${lineUp}px);
      }
    `}

    /* LEFT */
    ${lineLeft &&
    css`
      & .left-line {
        width: ${lineLeft}px;
        height: ${lineWidth}px;
        left: calc(50% - ${lineLeft}px);
        top: calc(50% - ${lineWidth / 2}px);
      }
    `}

    /* RIGHT */
    ${lineRight &&
    css`
      & .right-line {
        width: ${lineRight}px;
        height: ${lineWidth}px;
        left: 50%;
        top: calc(50% - ${lineWidth / 2}px);
      }
    `}

    /* DOWN */
    ${lineDown &&
    css`
      & .down-line {
        width: ${lineWidth}px;
        height: ${lineDown}px;
        left: calc(50% - ${lineWidth / 2}px);
        top: 50%;
      }
    `}
  `}
`;

// -----------------------------------------------------
// REACT WRAPPER — only renders line elements when needed
// -----------------------------------------------------
export const DotNodeWrapper: React.FC<DotNodeProps> = props => {
  const { lineLeft, lineRight, lineDown } = props;

  return (
    <DotNode {...props}>
      {lineLeft && <LineElement className="left-line" />}
      {lineRight && <LineElement className="right-line" />}
      {lineDown && <LineElement className="down-line" />}
    </DotNode>
  );
};
