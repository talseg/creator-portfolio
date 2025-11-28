import type { StoryObj } from '@storybook/react-vite';
import type { Project, Image } from '../../database/dbInterfaces';
import { useState } from 'react';
import { ProjectTable } from './ProjectTable';

const getName = (index: number) => {
  switch (index) {
    case 0:
      return "Visual Communication Graduates Exhibition";
      break;
    case 1:
      return "Sheet Magazine";
    default:
      return `Project Name ${index}`;
  }
}



const getImageUrl = (index: number) => {
  switch (index) {
    default:
      return `Image ${index} url`;
  }
}

const createMocImageData = (index: number): Image => {
  return {
    imageIndex: index + 1,
    imageUrl: getImageUrl(index),
    id: `image-id-${index}`
  }
} 

const createImages = (numProjects: number): Image[] => {
  const images: Image[] = []
  for (let index = 0; index < numProjects; index++) {
    images.push(createMocImageData(index));
  }
  return images;
}

const createMockProjectData = (index: number): Project => {
  return {
    id: `project-${index}`,
    projectName: getName(index),
    header: "header " + index,
    projectImageUrl: "url " + index,
    projectIndex: index,
    images: createImages(4)
  }
} 

const createProjects = (numProjects: number): Project[] => {
  const projects: Project[] = []
  for (let index = 0; index < numProjects; index++) {
    projects.push(createMockProjectData(index));
  }
  return projects;
}


const ProjectTableTester: React.FC = () => {

  const [projects, setProjects] = useState<Project[]>(createProjects(3));

  return (
    <ProjectTable projects={projects} setProjects={setProjects}
      onAddProjectImage={() => {}}
    />
  );
  
}


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/ProjectTableTester',
  component: ProjectTableTester,
} //satisfies Meta<typeof EmailPasswordDialogTester>;

export default meta;
type Story = StoryObj<typeof meta>;


// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ProjectTableStory: Story = {
  args: {
  }
};

