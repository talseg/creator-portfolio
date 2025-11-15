import type { StoryObj } from '@storybook/react-vite';
import type { Project } from '../../database/dbInterfaces';
import { useState } from 'react';
import { ProjectTable } from './ProjectTable';

const ProjectTableTester: React.FC = () => {

  const [projects, setProjects] = useState<Project[]>([]);

  return (
    <ProjectTable projects={projects} setProjects={setProjects}/>
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

