import type { Meta, StoryObj } from '@storybook/react-vite';
import ImageSnapshot from './ImageSnapshot';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components',
  component: ImageSnapshot,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
  }
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args

} satisfies Meta<typeof ImageSnapshot>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ImageSnapshotElement: Story = {
  args: {
    src: "https://firebasestorage.googleapis.com/v0/b/creator-portfolio-f2b93.firebasestorage.app/o/project1%2Fproject.jpg?alt=media&token=20c96aa4-d7a2-41e4-96dc-5e801e1e1ff8",
    showAdd: true,
    showRemove: true,
    onAddClick: () => alert("Add"),
    onRemoveClick: () => alert("Remove")
  },
};
