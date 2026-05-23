type JsonRecord = Record<string, unknown>;

type PublicResume = JsonRecord & {
  schema_version?: string;
  basics?: {
    name?: string;
    label?: string;
    summary?: string;
    email?: string;
    phone?: string;
    location?: {
      city?: string;
      region?: string;
      address?: string;
      postalCode?: string;
    };
    profiles?: Array<{
      network?: string;
      username?: string;
      url?: string;
    }>;
  };
};

export function loadResume(): Promise<PublicResume>;
export function sanitizeResume(resume: JsonRecord): PublicResume;
export function searchResume(
  query: string,
  options?: { limit?: number },
): Promise<{
  schema_version: string;
  query: string;
  count: number;
  results: Array<{ path: string; section: string; text: string }>;
}>;
export function searchMcpEvidence(
  query: string,
  options?: { limit?: number },
): Promise<{
  results: Array<{ id: string; title: string; text: string; url: string }>;
}>;
export function fetchMcpEvidence(id: string): Promise<{
  id: string;
  title: string;
  text: string;
  url: string;
  metadata: { path: string; source: string };
}>;
export function buildBrief(): Promise<string>;
