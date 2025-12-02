import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotNodeWrapper, type DotNodeProps } from "./DotNode";
import styled from "styled-components";

const DotWrapper = styled.div`
  display: flex;
  border: 1px solid red;
  width: auto;
  height: 90vh;
  justify-content: center;
  align-items: center;
`

const DotNodeTester: React.FC<DotNodeProps> = (args: DotNodeProps) => {
  return (
    <DotWrapper >
        <DotNodeWrapper {...args}></DotNodeWrapper>
    </DotWrapper>
  )
}

const meta = {
  title: 'Components',
  component: DotNodeTester,
  parameters: {
    // layout: 'centered',
  },
} satisfies Meta<typeof DotNodeTester>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DotNodeWrapperElement: Story = {

  args: {
    lineUp: 105,
    lineDown: 105,
    lineLeft: 165,
    lineRight: 165,
    dotSize: 5,
    lineWidth: 1,
    snapToPixels: true
  }
};