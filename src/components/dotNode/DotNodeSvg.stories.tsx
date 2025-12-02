import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotNodeSvg, type DotNodeSvgProps } from "./DotNodeSvg";
import styled from "styled-components";

const DotWrapper = styled.div`
  display: flex;
  border: 1px solid red;
  width: 80vw;
  height: 90vh;
  /* justify-content: center; */
  /* align-items: center; */
`
const DotNodeSvgTester: React.FC<DotNodeSvgProps> = ( args: DotNodeSvgProps ) => {
  return (
  <DotWrapper >
    <DotNodeSvg {...args}></DotNodeSvg>
  </DotWrapper>
  )
}

const meta = {
  title: 'Components',
  component: DotNodeSvgTester,
  parameters: {
  layout: 'centered',
  },
} satisfies Meta<typeof DotNodeSvgTester>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DotNodeSvgElement: Story = {

    args: {
    lineUp: 50,
    lineDown: 50,
    lineLeft: 50,
    lineRight: 50,
    dotSize: 5,
    lineWidth: 1,
    }
};