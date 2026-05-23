type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonRecord = { [key: string]: JsonValue };

export function loadResume(): Promise<JsonRecord>;
export function sanitizeResume(resume: JsonRecord): JsonRecord;
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
