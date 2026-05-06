type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonRecord = { [key: string]: JsonValue };

export const SCHEMA_VERSION: string;
export function sanitizeResume(resume: JsonRecord): JsonRecord;
