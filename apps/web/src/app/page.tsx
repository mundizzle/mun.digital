import { AgentCue } from "@/components/resume/AgentCue";
import { Education } from "@/components/resume/Education";
import { Endorsements } from "@/components/resume/Endorsements";
import { Experience } from "@/components/resume/Experience";
import { Header } from "@/components/resume/Header";
import { Skills } from "@/components/resume/Skills";
import { Summary } from "@/components/resume/Summary";
import { loadResume } from "@mun.digital/profile";
import { adaptResume } from "@/components/resume/adaptResume";
import { webContactLinks } from "@/components/resume/webContactLinks";

export default async function Home() {
  const resume = adaptResume(await loadResume(), { contactLinks: webContactLinks });

  return (
    <div className="relative z-[1] mx-auto w-full max-w-[860px] min-w-0 overflow-x-hidden px-5 pt-14 pb-16 md:px-8 md:pb-24 print:max-w-none print:px-0 print:pt-0 print:pb-0">
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

      <footer className="mt-10 flex justify-between border-t border-border-strong pt-[18px] text-[10.5px] tracking-[0.2em] text-subtle-foreground uppercase print:[break-inside:avoid]">
        <div className="before:text-primary before:content-['■_']">END OF FILE</div>
      </footer>
    </div>
  );
}
