import styled from "styled-components";

const ImageSnapshotContainer = styled.div`
  width: 80px;
  height: 60px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SnapshotStyled = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

interface ImageSnapshotProps {
  src: string;
  alt?: string;
}

const ImageSnapshot: React.FC<ImageSnapshotProps> = ({src, alt = "" }) => (
    <ImageSnapshotContainer>
        <SnapshotStyled src={src} alt={alt}/>
    </ImageSnapshotContainer>)

export default ImageSnapshot;