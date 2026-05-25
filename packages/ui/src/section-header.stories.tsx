import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Controls, Description, Primary, Stories, Subtitle, Title } from "@storybook/addon-docs/blocks";
import { expect, within } from "storybook/test";
import { tokenMetadata } from "@mun.digital/tokens/metadata";
import { SectionHeader } from "./section-header";

const sectionHeaderTokens = tokenMetadata.tokens.filter(
  (token) =>
    token.category === "Layout" ||
    ["foreground", "subtle-foreground", "primary"].includes(token.name),
);

const meta = {
  title: "Portfolio/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs", "section-header"],
  args: {
    index: "02",
    title: "Experience",
  },
  argTypes: {
    index: {
      control: "text",
      description: "Two-character section index used by the default bracketed label.",
      table: {
        category: "Content",
        type: { summary: "string" },
      },
    },
    title: {
      control: "text",
      description: "Uppercase section heading text.",
      table: {
        category: "Content",
        type: { summary: "string" },
      },
    },
    label: {
      control: false,
      description: "Optional custom ReactNode label. Disabled in Controls because freeform ReactNode editing is noisy.",
      table: {
        category: "Slots",
        type: { summary: "ReactNode" },
      },
    },
    className: {
      control: false,
      description: "Optional root class override for integration-level layout adjustments.",
      table: {
        category: "Styling",
        type: { summary: "string" },
      },
    },
    labelClassName: {
      control: false,
      description: "Optional label class override. Prefer semantic token-backed utilities.",
      table: {
        category: "Styling",
        type: { summary: "string" },
      },
    },
    titleClassName: {
      control: false,
      description: "Optional title class override. Prefer semantic token-backed utilities.",
      table: {
        category: "Styling",
        type: { summary: "string" },
      },
    },
  },
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "SectionHeader is the first shared UI slice. It is data-agnostic, token-backed, and keeps the portfolio section rail layout reusable without owning profile content.",
      },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <h2>Generated Design Tokens</h2>
          <p>
            Storybook reads the generated package CSS for token browsing. The docs app uses
            <code>@mun.digital/tokens/metadata</code> as the primary token reference.
          </p>
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Mode</th>
                <th>Resolved value</th>
              </tr>
            </thead>
            <tbody>
              {sectionHeaderTokens.map((token) => (
                <tr key={`${token.name}-${token.mode ?? "base"}`}>
                  <td>
                    <code>{token.cssVariable}</code>
                  </td>
                  <td>{token.mode ?? "base"}</td>
                  <td>
                    <code>{token.resolvedValue}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Stories />
        </>
      ),
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
