import pkg from "../../package.json";
import { useRef } from "react";
import { ProjectGallery } from "../components/projectGallery1/ProjectGallery";
import styled from "styled-components";

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  text-align: center;
  min-height: 100vh;
  min-width: 98vw;
`;

const NameStyled = styled.div`
  font-size: 30px;
  margin: 0px;
  text-decoration: underline;
  color: #a7a7a7;
`;

export const StartPage: React.FC = () => {

  //const [imageUrl, setImageUrl] = useState<string | null>(defaultImage);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // const handleUploadClick = (): void => {
  //   fileInputRef.current?.click();
  // }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a temporary URL for the selected image
    //const url = URL.createObjectURL(file);
    //setImageUrl(url);
  };

  return (
    <WrapperStyled>


      {/* Hidden input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <h1 style={{ margin: "0px" }}>
        <a href="https://www.orsegal.net">
          <NameStyled>Or Segal</NameStyled>
        </a>
      </h1>
      <h1 style={{ margin: "0px" }}>Portfolio</h1>
      {/* <div>
        <button onClick={handleUploadClick}>
          Upload
        </button>
      </div> */}

      <ProjectGallery />

      <p
        style={{
          color: "#888"
        }}>
        version: {pkg.version}
      </p>
    </WrapperStyled>
  )
}