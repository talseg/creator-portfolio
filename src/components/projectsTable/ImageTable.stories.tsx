import type { StoryObj } from '@storybook/react-vite';
import type { Image } from '../../database/dbInterfaces';
import { useState } from 'react';
import { ImageTable } from './ImageTable';
import { Paper, TableContainer } from '@mui/material';

const getImageUrl = (index: number) => {
  switch (index) {
    default:
      return `Image ${index + 1} url`;
  }
}

const createMocImageData = (index: number): Image => {
  return {
    imageIndex: index,
    imageUrl: getImageUrl(index),
    id: 'mock-image-id-${index}',
  }
}

const createImages = (numProjects: number): Image[] => {
  const images: Image[] = []
  for (let index = 0; index < numProjects; index++) {
    images.push(createMocImageData(index));
  }
  return images;
}


const ImageTableTester: React.FC = () => {

  const [images] = useState<Image[]>(createImages(4));

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 550 }}>
      <ImageTable images={images} projectId={'mock project id'} />
    </TableContainer>
  );

}


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components',
  component: ImageTableTester,
} //satisfies Meta<typeof EmailPasswordDialogTester>;

export default meta;
type Story = StoryObj<typeof meta>;


// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ImageTableStory: Story = {
  args: {
  }
};

