import styled, { css } from "styled-components";

export interface DotNodeProps {
  lineUp?: number;
  lineDown?: number;
  lineLeft?: number;
  lineRight?: number;
  lineWidth?: number;
  dotSize?: number;
  snapToPixels?: boolean;
}

const LineElement = styled.div`
  position: absolute;
  background: black;
`;

const snapOffset = (lineWidth: number, snapToPixels?: boolean) => {
  return lineWidth === 1 && snapToPixels ? "calc(-50% - 0.5px)" : "-50%";
}

export const DotNode = styled.div<DotNodeProps>`
  position: relative;
  width: 0;
  height: 0;

/* DOT (static) */
&::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  background: black;
  top: 50%;
  left: 50%;
  width: ${({ dotSize }) => dotSize ?? 8}px;
  height: ${({ dotSize }) => dotSize ?? 8}px;
  ${({ lineWidth = 1, snapToPixels = true }) =>
    lineWidth === 1 && snapToPixels
      ? css`transform: translate(calc(-50% - 0.5px), calc(-50% - 0.5px));`
      : css`transform: translate(-50%, -50%);`}
}

/* ---------------------- UP LINE ------------------------ */
${({ lineUp, lineWidth = 1, snapToPixels = true }) =>
    Number(lineUp) > 0 &&
    css`
    &::before {
      content: "";
      position: absolute;
      background: black;
      width: ${lineWidth}px;
      height: ${lineWidth === 1 && snapToPixels
        ? `calc(${lineUp}px + 1px)`
        : `${lineUp}px`};
      top: ${lineWidth === 1 && snapToPixels
        ? `calc(50% - ${lineUp}px - 0.5px)`
        : `calc(50% - ${lineUp}px)`};
      left: 50%;
      transform: translateX(
        ${snapOffset(lineWidth, snapToPixels)}
      );
    }
  `}

/* ---------------------- LEFT LINE ---------------------- */
${({ lineLeft, lineWidth = 1, snapToPixels = true }) =>
    Number(lineLeft) > 0 &&
    css`
    & .left-line {
      position: absolute;
      background: black;
      width: ${lineWidth === 1 && snapToPixels
        ? `calc(${lineLeft}px + 1px)`
        : `${lineLeft}px`};
      height: ${lineWidth}px;
      top: 50%;
      left: 50%;
      transform: translate(
        -100%,
        ${snapOffset(lineWidth, snapToPixels)}
      );
    }
  `}

/* ---------------------- RIGHT LINE -------------------- */
${({ lineRight, lineWidth = 1, snapToPixels = true }) =>
    Number(lineRight) > 0 &&
    css`
    & .right-line {
      position: absolute;
      background: black;
      width: ${lineRight}px;
      height: ${lineWidth}px;
      top: 50%;
      left: 50%;
      transform: translate(
        0,
        ${snapOffset(lineWidth, snapToPixels)}
      );
    }
  `}

/* ---------------------- DOWN LINE --------------------- */
${({ lineDown, lineWidth = 1, snapToPixels = true }) =>
    Number(lineDown) > 0 &&
    css`
    & .down-line {
      position: absolute;
      background: black;
      width: ${lineWidth}px;
      height: ${lineDown}px;
      top: 50%;
      left: 50%;
      transform: translate(
        ${snapOffset(lineWidth, snapToPixels)},
        0
      );
    }
  `}
`;

export const DotNodeWrapper: React.FC<DotNodeProps> = props => {
  const { lineLeft, lineRight, lineDown } = props;

  const shouldDraw = (line: number | undefined): boolean => Boolean(line && line > 0);
  
  return (
    <DotNode {...props}>
      {shouldDraw(lineLeft) && <LineElement className="left-line" />}
      {shouldDraw(lineRight) && <LineElement className="right-line" />}
      {shouldDraw(lineDown) && <LineElement className="down-line" />}
    </DotNode>
  );
};
