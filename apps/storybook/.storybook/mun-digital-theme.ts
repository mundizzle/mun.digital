import { create } from "storybook/theming";

const monoFont = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
const sansFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

export const munDigitalStorybookTheme = create({
  base: "light",
  brandTitle: "mun.digital Storybook",
  brandUrl: "https://mun.digital",
  colorPrimary: "#0072b6",
  colorSecondary: "#0072b6",
  appBg: "#fbfaf7",
  appContentBg: "#f7f5f1",
  appHoverBg: "#dfeefa",
  appPreviewBg: "#fbfaf7",
  appBorderColor: "#d0d4db",
  appBorderRadius: 2,
  fontBase: sansFont,
  fontCode: monoFont,
  textColor: "#20242b",
  textInverseColor: "#fbfaf7",
  textMutedColor: "#5d6470",
  barTextColor: "#5d6470",
  barHoverColor: "#20242b",
  barSelectedColor: "#0072b6",
  barBg: "#f7f5f1",
  buttonBg: "#dfeefa",
  buttonBorder: "#d0d4db",
  booleanBg: "#d0d4db",
  booleanSelectedBg: "#0072b6",
  inputBg: "#fbfaf7",
  inputBorder: "#d0d4db",
  inputTextColor: "#20242b",
  inputBorderRadius: 2,
});
