import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotNode, DotNodeWrapper, type DotNodeProps } from "./DotNode";



const meta = {
  title: 'Example/DotNode',
  component: DotNodeWrapper,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DotNodeWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DotNodeWrapperElement: Story = {

    args: {
        lineUp: 10,
        lineDown: 20,
        lineLeft: 30,
        lineRight: 40,
        dotSize: 10,
        lineWidth: 1,
        perceptualCentering: true
    }
};