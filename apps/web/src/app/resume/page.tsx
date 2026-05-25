import type { Metadata } from "next";
import { AgentCue } from "@/components/resume/AgentCue";
import { Education } from "@/components/resume/Education";
import { Endorsements } from "@/components/resume/Endorsements";
import { Experience } from "@/components/resume/Experience";
import { Header } from "@/components/resume/Header";
import { Skills } from "@/components/resume/Skills";
import { Summary } from "@/components/resume/Summary";
import { PageFrame } from "@/components/chrome/PageFrame";
import { loadResume } from "@mun.digital/profile";
import { adaptResume } from "@/components/resume/adaptResume";
import { webContactLinks } from "@/components/resume/webContactLinks";

export const metadata: Metadata = {
  title: "Resume | mun.digital",
  description: "Public resume and professional profile for Mundi Morgado.",
  alternates: {
    canonical: "https://mun.digital/resume",
  },
};

export default async function ResumePage() {
  const resume = adaptResume(await loadResume(), { contactLinks: webContactLinks });

  return (
    <PageFrame>
      <Header
        location={resume.location}
        name={resume.name}
        contactLinks={resume.contactLinks}
      />

      <main>
        <Summary index="00" title={resume.summaryTitle} paragraphs={resume.summary} />
        <Skills index="01" title={resume.skillsTitle} groups={resume.skills} />
        <Experience index="02" title={resume.experienceTitle} jobs={resume.jobs} />
        <Education index="03" title={resume.educationTitle} entries={resume.education} />
        <Endorsements
          index="04"
          title={resume.endorsementsTitle}
          endorsements={resume.endorsements}
        />
        <AgentCue />
      </main>
    </PageFrame>
  );
}
