import styled from "styled-components";

interface TextProps {
  fontSize?: string;
  children: string;
  className?: string;
}

const TextStyled = styled.div<{ $finstSize: string }>`
  font-family: EditorSans;
  font-style: italic;
  font-weight: bold;
  letter-spacing: 0.02813rem;
  white-space: pre-wrap;
  font-size: ${({ $finstSize }) => $finstSize};
`;

const LabelText: React.FC<TextProps> = ({ fontSize = "0.9375rem", className, children }) => {
  return (
    <TextStyled $finstSize={fontSize} className={className}>{children}</TextStyled>
  );
}

export default LabelText;