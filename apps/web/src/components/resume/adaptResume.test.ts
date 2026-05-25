import { describe, expect, it } from "vitest";
import { adaptResume } from "./adaptResume";

describe("adaptResume", () => {
  it("builds a public resume view model from sanitized JSON Resume data", () => {
    const viewModel = adaptResume(
      {
        basics: {
          name: "Mundi Morgado",
          summary: "Builds useful product systems.",
          location: {
            city: "Los Angeles",
            region: "CA",
          },
          profiles: [
            { network: "Website", username: "mun.digital", url: "https://mun.digital" },
            { network: "GitHub", username: "mundizzle", url: "https://github.com/mundizzle" },
          ],
        },
        skills: [{ name: "Leadership", keywords: ["architecture", "delivery"] }],
        work: [
          {
            name: "TandemSeven",
            position: "Lead Engineer",
            startDate: "2017-01",
            endDate: "2019-03",
            summary: "Led product UI work.",
            highlights: ["Wilson QBX redesign", "Built reusable delivery practices."],
          },
        ],
      },
      {
        contactLinks: [{ text: "mun.digital", href: "https://mun.digital", group: "direct" }],
      },
    );

    expect(viewModel.name).toBe("Mundi Morgado");
    expect(viewModel.location).toBe("Los Angeles, CA");
    expect(viewModel.summary).toEqual(["Builds useful product systems."]);
    expect(viewModel.contactLinks).toEqual([
      { text: "mun.digital", href: "https://mun.digital", group: "direct" },
      { text: "github.com/mundizzle", href: "https://github.com/mundizzle", group: "profile" },
    ]);
    expect(viewModel.jobs[0]).toMatchObject({
      title: "Lead Engineer",
      company: "TandemSeven",
      dates: "Jan 2017 - Mar 2019",
      selectedWork: ["Wilson QBX redesign"],
      bullets: ["Built reusable delivery practices."],
    });
    expect(viewModel.jobs[0]?.selectedClients).toContain("JP Morgan Chase");
  });
});
