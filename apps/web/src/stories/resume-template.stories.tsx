import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Experience } from "@/components/resume/Experience";
import { Summary } from "@/components/resume/Summary";

function ResumeExcerptTemplate() {
  return (
    <div className="max-w-[860px]">
      <Summary
        index="01"
        title="Summary"
        paragraphs={[
          "Engineering leader focused on practical product systems, agent-readable public surfaces, and durable delivery habits.",
        ]}
      />
      <Experience
        index="02"
        title="Experience"
        jobs={[
          {
            title: "Engineering Manager",
            company: "Example Studio",
            companyUrl: "https://example.com",
            dates: "2022 - Present",
            tenure: null,
            context: "Leads web platform delivery with tight design and engineering collaboration.",
            bullets: [
              "Introduced a portfolio reference surface for agents and reviewers.",
              "Built repeatable verification around public data boundaries.",
            ],
            selectedWork: ["Agentic public profile workflow"],
            selectedClients: [],
          },
        ]}
      />
    </div>
  );
}

const meta = {
  title: "Templates/Resume/Excerpt",
  component: ResumeExcerptTemplate,
  tags: ["autodocs", "a11y"],
  parameters: {
    a11y: {
      test: "error",
    },
    controls: {
      disable: true,
    },
    docs: {
      description: {
        component:
          "Fixture-backed resume excerpt composed from app components. Route page files are intentionally not imported into Storybook.",
      },
    },
    layout: "padded",
  },
} satisfies Meta<typeof ResumeExcerptTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Summary" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Experience" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Example Studio" })).toHaveAttribute("href", "https://example.com");
  },
};
