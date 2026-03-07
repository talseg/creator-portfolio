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
  padding: .4rem;
  cursor: pointer;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const NextButton:  React.FC<NextButtonProps> = ({ onClick } ) => {

  return (
    <TransparentButton onClick={(e) => onClick(e)}><NextSvg/></TransparentButton>
  )
}