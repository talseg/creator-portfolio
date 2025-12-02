import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmailPasswordDialog } from './EmailPasswordDialog';
import { useEffect, useState } from 'react';

interface EmailPasswordDialogTesterProps {
  isOpen: boolean;
}

const EmailPasswordDialogTester: React.FC<EmailPasswordDialogTesterProps> = ({ isOpen }) => {

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
   setOpen(isOpen)
  }, [isOpen])
  

  const handleSubmit = (email: string, password: string): void => {
    if (email === "talseg7@gmail.com" && password=== "password") {
      setOpen(false);
    }
  }

  return (
    <EmailPasswordDialog
      open={open} 
      
      onClose={() => {}} 
      
      onSubmit={handleSubmit}      >

    </EmailPasswordDialog>
  );
}


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components',
  component: EmailPasswordDialogTester,
} satisfies Meta<typeof EmailPasswordDialogTester>;

export default meta;
type Story = StoryObj<typeof meta>;


// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const EmailPasswordDialogStory: Story = {
  args: {
    isOpen: true
  }
};

