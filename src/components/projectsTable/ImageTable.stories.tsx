import type { StoryObj } from '@storybook/react-vite';
import type { Project, Image } from '../../database/dbInterfaces';
import { useState } from 'react';
import { ImageTable } from './ImageTable';

const getImageUrl = (index: number) => {
  switch (index) {
    default:
      return `Image ${index} url`;
  }
}

const createMocImageData = (index: number): Image => {
  return {
    imageIndex: index,
    imageUrl: getImageUrl(index)
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

  const [images, setImages] = useState<Image[]>(createImages(4));

  return (
    <ImageTable images={images} setImages={setImages} />
  );
  
}


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/ImageTableTester',
  component: ImageTableTester,
} //satisfies Meta<typeof EmailPasswordDialogTester>;

export default meta;
type Story = StoryObj<typeof meta>;


// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ImageTableStory: Story = {
  args: {
  }
};

