import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotSvg, type DotSvgProps } from "./DotSvg";
import styled from "styled-components";

const DotWrapper = styled.div`
  display: flex;
  border: 1px solid red;
  width: 100px;
  height: 100px;
  border: 1px solid red;
`
const DotSvgTester: React.FC<DotSvgProps> = (args: DotSvgProps) => {
  return (
    <>
      <div style={{ display: "flex" }}>

        <DotWrapper style={{ justifyContent: "center", alignItems: "center" }}>
          <DotSvg {...args}></DotSvg>
        </DotWrapper>


        <DotWrapper style={{ alignItems: "center" }}>
          <DotSvg {...args}></DotSvg>
        </DotWrapper>


        <DotWrapper style={{ justifyContent: "center" }}>
          <DotSvg {...args}></DotSvg>
        </DotWrapper>

        <DotWrapper style={{ alignItems: "flex-end", justifyContent: "flex-end" }}>
          <DotSvg {...args}></DotSvg>
        </DotWrapper>
      </div>
    </>
  )
}

const meta = {
  title: 'Components',
  component: DotSvgTester,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DotSvgTester>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DotCentered: Story = {
  args: {
    dotSize: 26,
  }
};