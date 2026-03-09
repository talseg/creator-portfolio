import styled from "styled-components";

interface TextProps {
  fontSize?: string;
  children: React.ReactNode;
  className?: string;
}

const TextStyled = styled.div<{ $fontSize: string }>`
  font-family: EditorSans;
  font-style: italic;
  font-weight: bold;
  letter-spacing: 0.02813rem;
  white-space: pre-wrap;
  font-size: ${({ $fontSize }) => $fontSize};
`;

const LabelText: React.FC<TextProps> = ({ fontSize = "0.9375rem", className, children }) => {
  return (
    <TextStyled $fontSize={fontSize} className={className}>{children}</TextStyled>
  );
}

export default LabelText;