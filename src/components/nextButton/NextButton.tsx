import type { MouseEvent } from "react";
import styled from "styled-components";
import NextSvg from "../../assets/next.svg?react";

interface NextButtonProps {
  onClick: (e : MouseEvent) => void;
}

const TransparentButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  padding: .4rem;

  color: inherit;
  -webkit-tap-highlight-color: transparent;

  cursor: pointer;
  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    box-shadow: none;
  }
`;

export const NextButton:  React.FC<NextButtonProps> = ({ onClick } ) => {

  return (
    <TransparentButton onClick={(e) => onClick(e)}><NextSvg/></TransparentButton>
  )
}