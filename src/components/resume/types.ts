export interface ContactLink {
  text: string;
  href: string;
}

export interface SkillGroup {
  label: string;
  tokens: string[];
}

export interface Job {
  title: string;
  company: string;
  companyUrl?: string;
  dates: string;
  tenure: string | null;
  context: string;
  bullets: string[];
  selectedWork: string[];
  selectedClients: string[];
}

export interface EducationEntry {
  school: string;
  degree: string;
  dates: string;
}

export interface ResumeViewModel {
  name: string;
  location: string;
  summaryTitle: string;
  skillsTitle: string;
  experienceTitle: string;
  educationTitle: string;
  contactLinks: ContactLink[];
  summary: string[];
  skills: SkillGroup[];
  jobs: Job[];
  education: EducationEntry[];
}
