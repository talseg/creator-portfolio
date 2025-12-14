import type { StoryObj } from '@storybook/react-vite';
import type { Project } from '../../database/dbInterfaces';


import styled from 'styled-components';
import ProjectImage from './ProjectImage';



const MainWindow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 10.625rem 1fr;
    width: 100%;
    height: 100vh;
`

const ImageColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #ffffff00;
    grid-row: 2;
    grid-column: 2;
`

const createMockProject: () => Project = () => {
    return (
        {
            id: 'proj-id',
            projectName: 'View, Window, and Mirror      2024',
            header: 'project-header',
            projectImageUrl: "https://firebasestorage.googleapis.com/v0/b/creator-portfolio-f2b93.firebasestorage.app/o/project1%2Fproject.jpg?alt=media&token=20c96aa4-d7a2-41e4-96dc-5e801e1e1ff8",
            projectIndex: 1,
            category: "designer"
        }
    );
}

const ProjectImageTester: React.FC<{ project: Project }> = ({ project }) => {
    console.log(project);
    return (
        <MainWindow>
            <ImageColumn>
                <ProjectImage project={project}/>
            </ImageColumn>
        </MainWindow>
    );

}


const meta = {
    title: 'Components',
    component: ProjectImageTester,
}

export default meta;
type Story = StoryObj<typeof meta>;

export const ProjectImageElement: Story = {
    args: {
        project: createMockProject()
  }
};

