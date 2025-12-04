import styled from "styled-components";

const ImageSnapshotContainer = styled.div`
  width: 80px;
  height: 60px;
  overflow: hidden;
  display: grid;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

const SnapshotStyled = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  grid-row: 1;
  grid-column: 1;
`;

const SmallButtonStyled = styled.button`

  width: 16px; // this is ignored
  height: 18px;
  font-size: 18px;
  padding: 0;
  line-height: 0;
`
const ButtonsWrapper = styled.div`
  display: flex;
  gap: 2px;
  grid-row: 1;
  grid-column: 1;
  align-self: flex-start;
  justify-self: end;
  margin-top: 2px;
  margin-right: 4px;
`;

type OperationType = undefined | "add" | "remove";

interface ImageSnapshotProps {
  src: string;
  alt?: string;
  operation: OperationType;
  onAddClick?: () => void;
  onRemoveClick?: () => void;
}

const ImageSnapshot: React.FC<ImageSnapshotProps> = ({ src, alt = "", onAddClick, onRemoveClick }) => {
  const showButtons = Boolean(true);

  return (
    <ImageSnapshotContainer>
      <SnapshotStyled src={src} alt={alt} />
      {
        showButtons &&
        <ButtonsWrapper>
          <SmallButtonStyled onClick={() => onAddClick && onAddClick()}>
            +
          </SmallButtonStyled>
          <SmallButtonStyled onClick={() => onRemoveClick && onRemoveClick()}>
            -
          </SmallButtonStyled>
        </ButtonsWrapper>
      }
    </ImageSnapshotContainer>
  );
}

export default ImageSnapshot;