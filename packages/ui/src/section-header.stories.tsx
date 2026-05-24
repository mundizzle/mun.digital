import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionHeader } from "./section-header";

const meta = {
  title: "Portfolio/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  args: {
    index: "02",
    title: "Experience",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongTitle: Story = {
  args: {
    index: "04",
    title: "Selected Endorsements",
  },
};
