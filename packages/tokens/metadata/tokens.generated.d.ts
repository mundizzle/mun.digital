export interface MunDigitalTokenMetadataEntry {
  name: string;
  cssVariable: string;
  type: "color" | "dimension";
  category: "Colors" | "Layout";
  mode?: "light" | "dark";
  value: unknown;
  resolvedValue: string;
  sourcePath: string;
}

export interface MunDigitalTokenMetadataCategory {
  name: "Colors" | "Layout";
  description: string;
  tokens: MunDigitalTokenMetadataEntry[];
}

export interface MunDigitalTokenMetadata {
  generatedBy: string;
  source: string;
  exports: {
    css: "@mun.digital/tokens/css";
    metadata: "@mun.digital/tokens/metadata";
  };
  categories: MunDigitalTokenMetadataCategory[];
  tokens: MunDigitalTokenMetadataEntry[];
}

export const tokenMetadata: MunDigitalTokenMetadata;
export default tokenMetadata;
