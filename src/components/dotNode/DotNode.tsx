import styled, { css } from "styled-components";

export interface DotNodeProps {
  lineUp?: number;
  lineDown?: number;
  lineLeft?: number;
  lineRight?: number;
  lineWidth?: number;
  dotSize?: number;
}

const LineElement = styled.div`
  position: absolute;
  background: black;
`;

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
    transform: translate(-50%, -50%);
  }

  /* ---------------------- UP LINE ------------------------ */
  ${({ lineUp, lineWidth = 1 }) =>
    lineUp &&
    css`
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
    `}

  /* ---------------------- LEFT LINE ---------------------- */
  ${({ lineLeft, lineWidth = 1 }) =>
    lineLeft &&
    css`
      & .left-line {
        position: absolute;
        background: black;
        width: ${lineLeft}px;
        height: ${lineWidth}px;
        top: 50%;
        left: 50%;
        transform: translate(-100%, -50%);
      }
    `}

  /* ---------------------- RIGHT LINE -------------------- */
  ${({ lineRight, lineWidth = 1 }) =>
    lineRight &&
    css`
      & .right-line {
        position: absolute;
        background: black;
        width: ${lineRight}px;
        height: ${lineWidth}px;
        top: 50%;
        left: 50%;
        transform: translate(0, -50%);
      }
    `}

  /* ---------------------- DOWN LINE --------------------- */
  ${({ lineDown, lineWidth = 1 }) =>
    lineDown &&
    css`
      & .down-line {
        position: absolute;
        background: black;
        width: ${lineWidth}px;
        height: ${lineDown}px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, 0);
      }
    `}
`;

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
