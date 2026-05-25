import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SectionHeader } from "./SectionHeader";

const meta = {
  title: "Components/Resume/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs", "a11y"],
  args: {
    index: "02",
    title: "Experience",
  },
  argTypes: {
    index: {
      control: "text",
      description: "Section index rendered in the bracketed rail label.",
    },
    title: {
      control: "text",
      description: "Section heading text.",
    },
    label: {
      control: false,
      description: "Optional label slot for app-specific section markers.",
    },
    className: {
      control: false,
      description: "Optional root class override for app layout integration.",
    },
    labelClassName: {
      control: false,
      description: "Optional label class override for app layout integration.",
    },
    titleClassName: {
      control: false,
      description: "Optional title class override for app layout integration.",
    },
  },
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "App-owned resume section heading used by the portfolio. It is token-backed, fixture-safe, and intentionally not exported as a reusable package API.",
      },
    },
    layout: "padded",
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Experience" })).toBeVisible();
    await expect(canvas.getByText("02")).toBeVisible();
  },
};

export const LongTitle: Story = {
  args: {
    index: "04",
    title: "Selected Endorsements",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Selected Endorsements" })).toBeVisible();
  },
};

export const CustomLabel: Story = {
  args: {
    index: "03",
    title: "Selected Work",
    label: (
      <span>
        <span className="text-primary">[</span>
        case study
        <span className="text-primary">]</span>
      </span>
    ),
  },
  parameters: {
    controls: {
      exclude: ["label"],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("case study")).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Selected Work" })).toBeVisible();
  },
};
