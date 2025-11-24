import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotNodeWrapper, type DotNodeProps } from "./DotNode";
import styled from "styled-components";

const DotWrapper = styled.div`
  display: flex;
  border: 1px solid red;
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
`

const DotNodeTester: React.FC<DotNodeProps> = ( args: DotNodeProps ) => {
  return (
  <DotWrapper >
    <DotNodeWrapper {...args}></DotNodeWrapper>
  </DotWrapper>
  )
}

const meta = {
  title: 'Example/DotNode',
  component: DotNodeTester,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DotNodeTester>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DotNodeWrapperElement: Story = {

    args: {
        lineUp: 50,
        lineDown: 50,
        lineLeft: 50,
        lineRight: 50,
        dotSize: 5,
        lineWidth: 1,
        snapToPixels: true
    }
};