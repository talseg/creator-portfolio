import type { StoryObj } from "@storybook/react-vite";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { projectsStore } from "../../stores/projecrStore";
import { ImageSwapper } from "./ImageSwapper";
import { useState } from "react";

const Wrapper = styled.div`
  width: 50vw;
  background-color: red;
  display: flex;
  flex-direction: column;
  column-gap: 120px;
  align-items: center;
`




export const ImageSwapperTester: React.FC = observer(() => {

  const startProj = 0;

  const [projectIndex, setProjectIndex] = useState(startProj);
  const [nextImage, setShowNext] = useState(false);
  
  const projects = projectsStore.projects;

  if (!projectsStore.allLoaded)
    return <Wrapper>loading {projects.length} projects</Wrapper>;

  const images = projects[projectIndex]?.images ? projects[projectIndex]?.images : [];
  // if (images.length < 1)
  //   return (
  //   <Wrapper>
  //     Loading num images: {images.length}
  //   </Wrapper>
  // );
   

  return (
    <Wrapper>
      <ImageSwapper images={images} showNext={nextImage} showNextDone={() => setShowNext(false)}/>
      <button style={{ marginTop: "30px", width: "20%"}}
        onClick={() => setProjectIndex(
          (prev) => prev+ 1
        )}>{projectIndex} Next Project</button>
      <button style={{ marginTop: "30px", width: "20%"}}
        onClick={() => setShowNext(true)}>Next Image</button>
    </Wrapper>
  );
    

});

const meta = {
  title: 'Components',
  component: ImageSwapperTester,
} //satisfies Meta<typeof EmailPasswordDialogTester>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageSwapperStory: Story = {
  args: {
  }
};
